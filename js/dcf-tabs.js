import { DCFUtility } from './dcf-utility';

export class DCFTabs {
  // Set up the button
  constructor(tabGroups, options = {}) {
    // Store the button inputted (always will be an array)
    this.tabGroups = tabGroups;
    if (NodeList.prototype.isPrototypeOf(this.tabGroups)) {
      this.tabGroups = Array.from(this.tabGroups);
    } else if (!Array.isArray(this.tabGroups)) {
      this.tabGroups = [ this.tabGroups ];
    }
  }

  // The names of the events to be used easily
  static events(name) {
    const events = {
    };
    Object.freeze(events);

    return name in events ? events[name] : undefined;
  }

  // Initialize the buttons that were inputted in the constructor
  initialize() {
    // loops through each one
    this.tabGroups.forEach((tabGroup) => {
      // Create a random ID for the button
      const uuid = DCFUtility.uuidv4();

      let tabList = tabGroup.querySelector('.dcf-tabs > ol, .dcf-tabs > ul');
      const panels = Array.from(tabGroup.querySelectorAll('.dcf-tabs > div, .dcf-tabs > section'));

      if (tabGroup.getAttribute('id') === null) {
        tabGroup.setAttribute('id', DCFUtility.checkSetElementId(tabGroup, uuid.concat('-tab-group')));
      }

      if (panels.length === DCFUtility.magicNumbers('int0')) {
        throw new Error('No Panels Found', { cause: tabGroup });
      }
      const panelsWithNoIds = panels.filter((panel) => panel.getAttribute('id') === null);
      if (panelsWithNoIds.length !== DCFUtility.magicNumbers('int0')) {
        throw new Error('Panels Missing Ids', { cause: panelsWithNoIds });
      }

      // Build the tablist from the titles of the panels
      if (tabList === null) {
        tabList = document.createElement('ul');
        panels.forEach((singlePanel) => {
          const tabTextElem = singlePanel.querySelector('.dcf-tabs-panel-title');
          let tabText = tabTextElem !== null ? tabTextElem.innerText : 'Untitled';

          let newTabLinkElem = document.createElement('a');
          newTabLinkElem.innerText = tabText;
          newTabLinkElem.href = `#${singlePanel.id}`;

          let newTabElem = document.createElement('li');
          newTabElem.append(newTabLinkElem);
          tabList.append(newTabElem);
        });

        tabGroup.insertBefore(tabList, panels[DCFUtility.magicNumbers('int0')]);
      }

      tabList.classList.add('dcf-tabs-list', 'dcf-list-bare', 'dcf-mb-0');
      tabList.setAttribute('role', 'tablist');

      let selectedPanel = location.hash !== '' ? tabGroup.querySelector(location.hash) : null;
      // Add tab panel semantics and hide them all in each tab group.
      panels.forEach((panel) => {
        // Set role to each tab panel
        panel.setAttribute('role', 'tabpanel');
        // Set tabindex to let panel be focused
        panel.setAttribute('tabindex', '0');
        // Add class to each tab panel
        panel.classList.add('dcf-tabs-panel');
        // Hide all tab panels
        panel.setAttribute('hidden', '');

        if (selectedPanel === null && this.checkPanelInURL(panel.getAttribute('id'))) {
          selectedPanel = panel;
        }
      });
      if (selectedPanel === null) {
        selectedPanel = tabGroup.querySelector('[data-default="true"]');
        if (selectedPanel === null) {
          selectedPanel = panels[DCFUtility.magicNumbers('int0')];
        }
      }

      // Tab styling and functions.
      const tabs = tabList.querySelectorAll('a');
      tabs.forEach((tab, tabIndex) => {
        // Add class to each tab
        tab.classList.add('dcf-tab', 'dcf-d-block');

        // Prefix each tab within its parent tab group with the corresponding uuid.
        let nextTab = tabIndex + DCFUtility.magicNumbers('int1');
        tab.setAttribute('id', DCFUtility.checkSetElementId(tab, uuid.concat('-tab-', nextTab)));

        // Add role to each tab
        tab.setAttribute('role', 'tab');

        tab.setAttribute('tabindex', '-1');
        tab.removeAttribute('aria-selected');

        // Add class to each tab's parent (list item)
        tab.parentNode.classList.add('dcf-tabs-list-item', 'dcf-mb-0');

        // Add role to each tab's parent (list item)
        tab.parentNode.setAttribute('role', 'presentation');

        if (tab.getAttribute('href') === null || tab.getAttribute('href') === '' || !tab.getAttribute('href').startsWith('#')) {
          throw new Error('Invalid Tab href', { cause: tab });
        }

        let matchingPanel = document.getElementById(tab.getAttribute('href').replace('#', ''));
        if (matchingPanel === null) {
          throw new Error('Invalid Tab href reference', { cause: tab });
        }
        matchingPanel.setAttribute('aria-labelledby', tab.getAttribute('id'));

        if (matchingPanel.isEqualNode(selectedPanel)) {
          tab.setAttribute('tabindex', '0');
          tab.setAttribute('aria-selected', 'true');
          matchingPanel.removeAttribute('hidden');
        }

        this.setTabEventListeners(tab);
      });
    });

    window.addEventListener('hashchange', () => {
      let panel = document.getElementById(location.hash.replace('#', ''));
      if (panel === null || !panel.classList.contains('.dcf-tabs-panel')) {
        return;
      }
      this.switchTab(panel);
    });
  }

  checkPanelInURL(panelID) {
    const url = new URL(location.href);
    const tabsParam = url.searchParams.get('tabs');

    if (tabsParam === null) {
      return false;
    }

    return tabsParam.split(' ').includes(panelID);
  }

  updateURLHash(tabGroup) {
    const url = new URL(location.href);
    const panel = tabGroup.querySelector('.dcf-tabs-panel:not([hidden])');

    if (panel === null) {
      throw new Error('Invalid tabGroup');
    }

    url.hash = panel.getAttribute('id');
    history.replaceState('', '', url.toString());
  }

  updateURLParam(tabGroup) {
    const url = new URL(location.href);
    const tabsParam = url.searchParams.get('tabs');

    const panel = tabGroup.querySelector('.dcf-tabs-panel:not([hidden])');
    if (panel === null) {
      throw new Error('Invalid tabGroup');
    }

    if (tabsParam === null) {
      url.searchParams.set('tabs', panel.getAttribute('id'));
      history.replaceState('', '', url.toString());
      return;
    }
    const panelList = tabsParam.split(' ');

    const newPanelList = panelList
      .filter((panelToCheck) => tabGroup.querySelector(`#${panelToCheck}`) === null);

    newPanelList.push(panel.getAttribute('id'));

    url.searchParams.set('tabs', newPanelList.join(' '));
    history.replaceState('', '', url.toString());
  }

  /**
   * Set event listeners on inputted tab element
   * - Left Arrow for previous tab
   * - Right Arrow for next tab
   * - Home for first tab
   * - End for last tab
   * - Click to switch to the inputted tab
   *
   * @param {HTMLElement} tab Tab to set event listeners for
   * @returns { void }
   */
  setTabEventListeners(tab) {
    const tabGroup = tab.closest('.dcf-tabs');
    tab.addEventListener('keydown', (keydownEvent) => {
      if (DCFUtility.isKeyEvent(keydownEvent, DCFUtility.keyEvents('arrowLeft'))) {
        let newTab = this.switchToPreviousTab(tabGroup);
        if (newTab === null) {
          return;
        }
        newTab.focus();
        keydownEvent.preventDefault();
        this.updateURLHash(tabGroup);
      } else if (DCFUtility.isKeyEvent(keydownEvent, DCFUtility.keyEvents('arrowRight'))) {
        let newTab = this.switchToNextTab(tabGroup);
        if (newTab === null) {
          return;
        }
        newTab.focus();
        keydownEvent.preventDefault();
        this.updateURLHash(tabGroup);
      } else if (DCFUtility.isKeyEvent(keydownEvent, DCFUtility.keyEvents('home'))) {
        let newTab = this.switchToFirstTab(tabGroup);
        if (newTab === null) {
          return;
        }
        newTab.focus();
        keydownEvent.preventDefault();
        this.updateURLHash(tabGroup);
      } else if (DCFUtility.isKeyEvent(keydownEvent, DCFUtility.keyEvents('end'))) {
        let newTab = this.switchToLastTab(tabGroup);
        if (newTab === null) {
          return;
        }
        newTab.focus();
        keydownEvent.preventDefault();
        this.updateURLHash(tabGroup);
      }
    });

    tab.addEventListener('click', () => {
      this.switchTab(tab);
    });
  }

  /**
   * This function will switch to the next tab
   * @param {HTMLElement} tabGroup Tab currently selected
   * @returns {HTMLElement | null}
   */
  switchToNextTab(tabGroup) {
    const selectedTab = tabGroup.querySelector('.dcf-tab[aria-selected="true"]');
    const nextTabsListItem = selectedTab.parentElement.nextElementSibling;
    if (nextTabsListItem === null) {
      return null;
    }
    const newTab = nextTabsListItem.querySelector('.dcf-tab');
    this.switchTab(newTab);
    return newTab;
  }

  /**
   * This function will switch to the previous tab
   * @param {HTMLElement} tabGroup Tab currently selected
   * @returns {HTMLElement | null}
   */
  switchToPreviousTab(tabGroup) {
    const selectedTab = tabGroup.querySelector('.dcf-tab[aria-selected="true"]');
    const previousTabsListItem = selectedTab.parentElement.previousElementSibling;
    if (previousTabsListItem === null) {
      return null;
    }
    const newTab = previousTabsListItem.querySelector('.dcf-tab');
    this.switchTab(newTab);
    return newTab;
  }

  /**
   * This function will switch to the previous tab
   * @param {HTMLElement} tabGroup Tab currently selected
   * @returns {HTMLElement | null}
   */
  switchToFirstTab(tabGroup) {
    const selectedTab = tabGroup.querySelector('.dcf-tab[aria-selected="true"]');
    const firstTabsListItem = selectedTab.closest('.dcf-tabs-list').firstElementChild;
    if (firstTabsListItem === null) {
      return null;
    }
    const newTab = firstTabsListItem.querySelector('.dcf-tab');
    this.switchTab(newTab);
    return newTab;
  }

  /**
   * This function will switch to the previous tab
   * @param {HTMLElement} tabGroup Tab currently selected
   * @returns {HTMLElement | null}
   */
  switchToLastTab(tabGroup) {
    const selectedTab = tabGroup.querySelector('.dcf-tab[aria-selected="true"]');
    const lastTabsListItem = selectedTab.closest('.dcf-tabs-list').lastElementChild;
    if (lastTabsListItem === null) {
      return null;
    }
    const newTab = lastTabsListItem.querySelector('.dcf-tab');
    this.switchTab(newTab);
    return newTab;
  }

  /**
   * Switched tabs to new panel
   * @param {HTMLElement} newPanel Panel to switch to
   * @returns { void }
   */
  switchTab(newPanel) {
    const tabGroup = newPanel.closest('.dcf-tabs');
    const tabList = newPanel.closest('.dcf-tabs-list');

    if (tabList === null) {
      throw new Error('Invalid Tab');
    }

    const tabs = tabList.querySelectorAll('.dcf-tab');
    tabs.forEach((tab) => {
      const matchingPanel = document.getElementById(tab.getAttribute('href').replace('#', ''));
      if (matchingPanel === null) {
        throw new Error('Invalid Tab href reference', { cause: tab });
      }
      if (tab.isEqualNode(newPanel)) {
        tab.setAttribute('tabindex', '0');
        tab.setAttribute('aria-selected', true);
        matchingPanel.removeAttribute('hidden');

        if (tabGroup.dataset.urlTracking === 'true') {
          this.updateURLParam(tabGroup);
        }
      } else {
        tab.setAttribute('tabindex', '-1');
        tab.removeAttribute('aria-selected');
        matchingPanel.setAttribute('hidden', '');
      }
    });
  }
}
