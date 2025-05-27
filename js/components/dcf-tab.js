import { uuidv4, checkSetElementId, isKeyEvent, keyEvents} from '../dcf-utility.js';

export default class DCFTabs {

    uuid = uuidv4();

    options = {};

    /** @type { HTMLElement|null } tabsGroup */
    tabsGroup = null;

    /** @type { HTMLElement|null } tabsList */
    tabsList = null;

    /** @type { HTMLElement[]|null } tabsPanelList */
    tabsPanelList = null;

    tabSwitchedEvent = new Event(DCFTabs.events('tabSwitched'));

    /**
     * Sets up events to be used and reconfigures tabGroups input to correct form
     * @constructor
     * @param { HTMLElement } tabsGroup - Array, Collection, or single tab group element
     * @param { Object } options - Unused
     * @returns { void }
     */
    constructor(tabsGroup, options = {}) {
        this.tabsGroup = tabsGroup;
        this.options = options;

        // Get the tablist and an array of the panels
        this.tabsList = this.tabsGroup.querySelector('.dcf-tabs > ol, .dcf-tabs > ul');
        this.tabsPanelList = Array.from(this.tabsGroup.querySelectorAll('.dcf-tabs > div:not(:empty), .dcf-tabs > section:not(:empty)'));

        // If the tabGroup has no ID then it will set it
        if (this.tabsGroup.getAttribute('id') === null) {
            this.tabsGroup.setAttribute('id', checkSetElementId(this.tabsGroup, this.uuid.concat('-tab-group')));
        }

        // TabGroup needs to have some panels for it to work
        if (this.tabsPanelList.length === 0) {
            throw new Error('No Panels Found', { cause: this.tabsGroup });
        }

        // Every panel needs to have an ID set
        const panelsWithNoIds = this.tabsPanelList.filter((panel) => panel.getAttribute('id') === null);
        if (panelsWithNoIds.length !== 0) {
            throw new Error('Panels Missing Ids', { cause: panelsWithNoIds });
        }

        // If the tablist is not created it will loop through the panels and create one
        if (this.tabsList === null) {
            this.tabsList = document.createElement('ul');
            this.tabsPanelList.forEach((singlePanel) => {
                // Gets tab text from the panel title
                const tabTextElem = singlePanel.querySelector('.dcf-tabs-panel-title');
                const tabText = tabTextElem !== null ? tabTextElem.innerText : 'Untitled';
                const tabHidden = singlePanel.dataset.tabHidden === 'true';

                // Creates a new link element with the href pointing to panel
                const newTabLinkElem = document.createElement('button');
                newTabLinkElem.innerText = tabText;
                newTabLinkElem.setAttribute('href', `#${singlePanel.id}`);
                if (tabHidden) {
                    newTabLinkElem.setAttribute('hidden', '');
                }

                // Creates new link element and adds everything to appropriate place
                const newTabElem = document.createElement('li');
                newTabElem.append(newTabLinkElem);
                this.tabsList.append(newTabElem);
            });

            // Adds new tablist to the tabGroup before any panels
            this.tabsGroup.insertBefore(this.tabsList, this.tabsPanelList[0]);
        }

        // Adds classes to the tabList and sets role
        this.tabsList.classList.add('dcf-tabs-list', 'dcf-list-bare', 'dcf-mb-0');
        this.tabsList.setAttribute('role', 'tablist');

        // Add tab panel semantics and hide them all in each tab group.
        this.tabsPanelList.forEach((panel) => {
            // Sets up panel with role, tabindex, classes, and hides them
            panel.setAttribute('role', 'tabpanel');
            panel.setAttribute('tabindex', '0');
            panel.classList.add('dcf-tabs-panel');
            panel.setAttribute('hidden', '');
        });

        // Tab styling and functions.
        const tabs = Array.from(this.tabsList.querySelectorAll('a, button'));

        // Checks if there are any tabs not hidden, if not there will be an error
        const tabsNotHidden = tabs.filter((tab) => tab.getAttribute('hidden') === null);
        if (tabsNotHidden.length === 0) {
            throw new Error('All Tabs Hidden');
        }

        // Loops through all the tabs and sets them up
        tabs.forEach((tab, tabIndex) => {
            // Adds classes, roles, tabindex, and removed aria-selected
            tab.classList.add('dcf-tab', 'dcf-d-block');
            tab.setAttribute('role', 'tab');
            tab.setAttribute('tabindex', '-1');
            tab.removeAttribute('aria-selected');

            // Prefix each tab within its parent tab group with the corresponding uuid.
            const nextTab = tabIndex + 1;
            tab.setAttribute('id', checkSetElementId(tab, this.uuid.concat('-tab-', nextTab)));

            // Add class and role to each tab's parent (list item)
            tab.parentNode.classList.add('dcf-tabs-list-item', 'dcf-mb-0');
            tab.parentNode.setAttribute('role', 'presentation');

            // If the href does not exist or it is not a fragment it will error
            if (tab.getAttribute('href') === null || tab.getAttribute('href') === '' || !tab.getAttribute('href').startsWith('#')) {
                throw new Error('Invalid Tab href', { cause: tab });
            }

            // Checks to see if the panel that matches that link exists
            const matchingPanel = document.getElementById(tab.getAttribute('href').replace('#', ''));
            if (matchingPanel === null) {
                throw new Error('Invalid Tab href reference', { cause: tab });
            }

            // Adds the final aria-labelledby to match the panel to the tab
            matchingPanel.setAttribute('aria-labelledby', tab.getAttribute('id'));

            // Sets up event listeners for the tab
            this.#setTabEventListeners(tab);
        });

        // SelectedTab is the final selected tab for the tabGroup
        // This will follow the priority list of
        // - 1. What ever is in the URL Fragment or Hash (Page will also auto scroll down to this one)
        // - 2. The first panel in the URL "Tabs" Param
        // - 3. The first panel with data-default attribute set to true
        // - 4. The first panel in the tabGroup
        let selectedTab = null;

        // Checks hash and it is set try setting it to the matching tab
        if (location.hash !== '') {
            selectedTab = this.tabsGroup.querySelector(`.dcf-tab[href="${location.hash}"]:not([hidden])`);
        }

        // If the tab is still null then go to the next item on the list
        if (selectedTab === null) {
            const allNonHiddenTabs = Array.from(this.tabsGroup.querySelectorAll('.dcf-tab:not([hidden])'));

            // Find the first panel that is in the URL
            allNonHiddenTabs.forEach((tab) => {
                const matchingPanel = document.getElementById(tab.getAttribute('href').replace('#', ''));
                if (selectedTab === null && this.#checkPanelInURL(matchingPanel.getAttribute('id'))) {
                    selectedTab = tab;
                }
            });

            // If the tab is still null then go to the next item on the list
            if (selectedTab === null) {
                // Find the first panel that has data-default as an attribute
                allNonHiddenTabs.forEach((tab) => {
                    const matchingPanel = document.getElementById(tab.getAttribute('href').replace('#', ''));
                    if (selectedTab === null && 'default' in matchingPanel.dataset && matchingPanel.dataset.default === 'true') {
                        selectedTab = tab;
                    }
                });

                // If the tab is still null then just use the first non-hidden tab
                if (selectedTab === null) {
                    selectedTab = allNonHiddenTabs[0];
                }
            }
        }

        // Once we are here we should have a selected tab and we can switch to it
        this.switchTab(selectedTab, false);

        // We can then set up the tabGroup event listeners and dispatch the even that the tabs are ready
        this.#setTabGroupEventListeners(this.tabsGroup);
        this.tabsGroup.dispatchEvent(new CustomEvent(DCFTabs.events('tabsReady'), {
            detail: {
                classInstance: this,
            },
        }));

        this.#scrollToHash();

        // We can set up an event listener on the window for when the hash changes to a tab
        window.addEventListener('hashchange', () => {
            // If the hash is an dcf-tab inside this tab group then we can switch to the tab and scroll down to it
            const tab =  this.tabsGroup.querySelector(`.dcf-tab[href="${location.hash}`);
            if (tab === null) {
                return;
            }
            this.switchTab(tab);
            this.#scrollToHash();
        });

    }

    /**
     * Validates and returns standardized name of events for tabs
     * @static
     * @param { string } name - Name of the event to be returned
     * @returns { string } Standard name of the event
     */
    static events(name) {
        const events = {
            tabsReady: 'tabsReady',
            tabSwitched: 'tabSwitched',
            commandSwitch: 'commandSwitch',
            commandPrev: 'commandPrev',
            commandNext: 'commandNext',
            commandHome: 'commandHome',
            commandEnd: 'commandEnd',
        };
        Object.freeze(events);

        return name in events ? events[name] : undefined;
    }

    #scrollToHash() {
        // If the hash is an dcf-tab then we can switch to the tab and scroll down to it
        const tab = document.querySelector(`.dcf-tab[href="${location.hash}`);
        if (tab === null) {
            return;
        }
        document.getElementById(location.hash.replace('#', '')).scrollIntoView();
    }

    /**
     * Parses url and determines if the panel id is in it
     * @param { string } panelID - Id of the panel element to check
     * @returns { bool }
     */
    #checkPanelInURL(panelID) {
        const url = new URL(location.href);
        const tabsParam = url.searchParams.get('tabs');

        if (tabsParam === null) {
            return false;
        }

        return tabsParam.split(' ').includes(panelID);
    }

    /**
     * Parses url and modifies the hash value in it
     * @returns { void }
     */
    #updateURLHash() {
        const url = new URL(location.href);
        const panel = this.tabsGroup.querySelector('.dcf-tabs-panel:not([hidden])');

        if (panel === null) {
            throw new Error('Invalid tabGroup');
        }

        url.hash = panel.getAttribute('id');
        history.replaceState('', '', url.toString());
    }

    /**
     * Parses url and removes any non-selected tabs from that tabGroup and adds any selected tabs
     * @returns { void }
     */
    #updateURLParam() {
        const url = new URL(location.href);
        const tabsParam = url.searchParams.get('tabs');

        // Get the selected panel
        const panel = this.tabsGroup.querySelector('.dcf-tabs-panel:not([hidden])');
        if (panel === null) {
            throw new Error('Invalid tabGroup');
        }

        // If there is nothing in the url for tabs we can just add the panel id
        if (tabsParam === null) {
            url.searchParams.set('tabs', panel.getAttribute('id'));

            // We want replace state here to not fill up the users history with weird tabs stuff
            history.replaceState('', '', url.toString());
            return;
        }

        // We can filter out any panels that are in the tabGroup then add the selected panel
        const panelList = tabsParam.split(' ');
        const newPanelList = panelList
            .filter((panelToCheck) => this.tabsGroup.querySelector(`#${panelToCheck}`) === null);
        newPanelList.push(panel.getAttribute('id'));

        // We want replace state here to not fill up the users history with weird tabs stuff
        url.searchParams.set('tabs', newPanelList.join(' '));
        history.replaceState('', '', url.toString());
    }

    /**
     * Sets up event listeners on tab group
     * - commandPrev to go to previous tab
     * - commandNext to go to next tab
     * - commandHome to go to first tab
     * - commandEnd to go to last tab
     *
     * @returns { void }
     */
    #setTabGroupEventListeners() {
        this.tabsGroup.addEventListener(DCFTabs.events('commandPrev'), () => {
            this.switchToPreviousTab();
        }, true);
        this.tabsGroup.addEventListener(DCFTabs.events('commandNext'), () => {
            this.switchToNextTab();
        }, true);
        this.tabsGroup.addEventListener(DCFTabs.events('commandHome'), () => {
            this.switchToFirstTab();
        }, true);
        this.tabsGroup.addEventListener(DCFTabs.events('commandEnd'), () => {
            this.switchToEndTab();
        }, true);
    }

    /**
     * Set event listeners on inputted tab element
     * - Left Arrow for previous tab
     * - Right Arrow for next tab
     * - Home for first tab
     * - End for last tab
     * - Click to switch to the inputted tab
     * - commandSwitch to switch to the inputted tab
     *
     * @param {HTMLElement} tab - Tab to set event listeners for
     * @returns { void }
     */
    #setTabEventListeners(tab) {
        tab.addEventListener('keydown', (keydownEvent) => {
            if (isKeyEvent(keydownEvent, keyEvents('arrowLeft'))) {
                // We can switch to the tab
                const newTab = this.switchToPreviousTab();
                if (newTab === null) {
                    return;
                }

                // If we get a tab back we can focus, prevent default, and update tht url hash
                newTab.focus();
                keydownEvent.preventDefault();
                this.#updateURLHash();
            } else if (isKeyEvent(keydownEvent, keyEvents('arrowRight'))) {
                // We can switch to the tab
                const newTab = this.switchToNextTab();
                if (newTab === null) {
                    return;
                }

                // If we get a tab back we can focus, prevent default, and update tht url hash
                newTab.focus();
                keydownEvent.preventDefault();
                this.#updateURLHash();
            } else if (isKeyEvent(keydownEvent, keyEvents('home'))) {
                // We can switch to the tab
                const newTab = this.switchToFirstTab();
                if (newTab === null) {
                    return;
                }

                // If we get a tab back we can focus, prevent default, and update tht url hash
                newTab.focus();
                keydownEvent.preventDefault();
                this.#updateURLHash();
            } else if (isKeyEvent(keydownEvent, keyEvents('end'))) {
                // We can switch to the tab
                const newTab = this.switchToLastTab();
                if (newTab === null) {
                    return;
                }

                // If we get a tab back we can focus, prevent default, and update tht url hash
                newTab.focus();
                keydownEvent.preventDefault();
                this.#updateURLHash();
            }
        });

        // If we click the tab we can switch to it
        tab.addEventListener('click', (clickEvent) => {
            this.switchTab(tab);
            this.#updateURLHash();
            clickEvent.preventDefault();
        });

        // If the command comes in we can switch the tabs
        tab.addEventListener(DCFTabs.events('commandSwitch'), () => {
            this.switchTab(tab);
        });
    }

    /**
     * This function will switch to the next tab
     * @returns {HTMLElement | null}
     */
    switchToNextTab() {
        // Gets the selected tab
        const selectedTab = this.tabsGroup.querySelector('.dcf-tab[aria-selected="true"]');

        // Gets a list of the non hidden tabs
        const nonHiddenTabs = Array.from(selectedTab.closest('.dcf-tabs-list').querySelectorAll('.dcf-tab:not([hidden])'));

        // Find the index of the selected tab and if it hidden we can set it to 0
        let selectedTabIndex = nonHiddenTabs.findIndex((tab) => tab.isEqualNode(selectedTab));
        if (selectedTabIndex === -1) {
            selectedTabIndex = 0;
        }

        // We can then calculate and validate the next index
        const nextIndex = selectedTabIndex + 1;
        if (nextIndex >= nonHiddenTabs.length) {
            return null;
        }

        // If valid we can then switch the tab
        const newTab = nonHiddenTabs[nextIndex];
        this.switchTab(newTab);
        return newTab;
    }

    /**
     * This function will switch to the previous tab
     * @returns {HTMLElement | null}
     */
    switchToPreviousTab() {
        // Gets the selected tab
        const selectedTab = this.tabsGroup.querySelector('.dcf-tab[aria-selected="true"]');

        // Gets a list of the non hidden tabs
        const nonHiddenTabs = Array.from(selectedTab.closest('.dcf-tabs-list').querySelectorAll('.dcf-tab:not([hidden])'));

        // Find the index of the selected tab and if it hidden we can set it to 0
        let selectedTabIndex = nonHiddenTabs.findIndex((tab) => tab.isEqualNode(selectedTab));
        if (selectedTabIndex === -1) {
            selectedTabIndex = 0;
        }

        // We can then calculate and validate the next index
        const nextIndex = selectedTabIndex - 1;
        if (nextIndex < 0) {
            return null;
        }

        // If valid we can then switch the tab
        const newTab = nonHiddenTabs[nextIndex];
        this.switchTab(newTab);
        return newTab;
    }

    /**
     * This function will switch to the first tab
     * @returns {HTMLElement | null}
     */
    switchToFirstTab() {
        // Gets the selected tab
        const selectedTab = this.tabsGroup.querySelector('.dcf-tab[aria-selected="true"]');

        // Gets a list of the non hidden tabs
        const nonHiddenTabs = Array.from(selectedTab.closest('.dcf-tabs-list').querySelectorAll('.dcf-tab:not([hidden])'));

        // We then get the first item in the list and switch to it
        const newTab = nonHiddenTabs[0];
        this.switchTab(newTab);
        return newTab;
    }

    /**
     * This function will switch to the last tab
     * @returns {HTMLElement | null}
     */
    switchToLastTab() {
        // Gets the selected tab
        const selectedTab = this.tabsGroup.querySelector('.dcf-tab[aria-selected="true"]');

        // Gets a list of the non hidden stabs
        const nonHiddenTabs = Array.from(selectedTab.closest('.dcf-tabs-list').querySelectorAll('.dcf-tab:not([hidden])'));

        // We then get the last item in the list and switch to it
        const newTab = nonHiddenTabs[nonHiddenTabs.length - 1];
        this.switchTab(newTab);
        return newTab;
    }

    /**
     * Switched tabs to new tab
     * @param {HTMLElement} newTab - Tab to switch to
     * @param {bool} AfterPageLoad - Whether the page has loaded yet
     * @returns { void }
     */
    switchTab(newTab, AfterPageLoad = true) {
        // Get and validate the currently selected tab and it is the new one as well we can just return
        const selectedTab = this.tabsList.querySelector('.dcf-tab[aria-selected="true"]');
        if (selectedTab !== null && selectedTab.isEqualNode(newTab)) {
            return;
        }

        if (this.tabsGroup.classList.contains('dcf-tabs-scroll') && AfterPageLoad) {
            newTab.scrollIntoView();
        }

        // We can then get a list of the tabs and loop through them
        const tabs = this.tabsList.querySelectorAll('.dcf-tab');
        tabs.forEach((tab) => {
            // We can then find the matching panel and validate it
            const matchingPanel = document.getElementById(tab.getAttribute('href').replace('#', ''));
            if (matchingPanel === null) {
                throw new Error('Invalid Tab href reference', { cause: tab });
            }

            // If the tab we are on is the new one we can select it
            if (tab.isEqualNode(newTab)) {
                tab.setAttribute('tabindex', '0');
                tab.setAttribute('aria-selected', true);
                matchingPanel.removeAttribute('hidden');

                // If we have url tracking enabled we can update the url tabs param
                if (this.tabsGroup.dataset.urlTracking === 'true' && AfterPageLoad) {
                    this.#updateURLParam();
                }
            } else {
                // Otherwise we will hide the tab and panel
                tab.setAttribute('tabindex', '-1');
                tab.removeAttribute('aria-selected');
                matchingPanel.setAttribute('hidden', '');
            }
        });

        // We can then dispatch and event that the tab has switched
        this.tabsGroup.dispatchEvent(this.tabSwitchedEvent);
    }
}
