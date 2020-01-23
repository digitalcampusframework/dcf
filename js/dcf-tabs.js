class DCFTabs{
    constructor(tabGroups) {
        this.tabGroups = tabGroups;
    }

    initialize(){
        Array.prototype.forEach.call(this.tabGroups, (tabGroup, i) => {

            // Define constants for tabs
            const tabList = tabGroup.querySelector('.dcf-tabs > ol, .dcf-tabs > ul');
            const tabs = tabList.querySelectorAll('a');
            const panels = tabGroup.querySelectorAll('.dcf-tabs > div, .dcf-tabs > section');
            const uuid = DCFUtility.uuidv4();

            // Prefix each tab group with a unique ID.
            tabGroup.setAttribute('id', uuid + '-tab-group');

            // Tab switching function
            const switchTab = (oldTab, newTab) => {
                newTab.focus();
                // Make the active tab focusable by the user (Tab key)
                newTab.removeAttribute('tabindex');
                // Set the selected state
                newTab.setAttribute('aria-selected', 'true');
                oldTab.removeAttribute('aria-selected');
                oldTab.setAttribute('tabindex', '-1');
                // Get the indices of the new and old tabs to find the correct
                // tab panels to show and hide
                let index = Array.prototype.indexOf.call(tabs, newTab);
                let oldIndex = Array.prototype.indexOf.call(tabs, oldTab);
                panels[oldIndex].hidden = true;
                panels[index].hidden = false;
            };

            // Tab styling and functions.
            Array.prototype.forEach.call(tabs, (tab, i) => {
                // Add class to each tab
                tab.classList.add('dcf-tab', 'dcf-d-block');
                // Prefix each tab within its parent tab group with the corresponding uuid.
                tab.setAttribute('id', uuid + '-tab-' + (i + 1));
                // Add role to each tab
                tab.setAttribute('role', 'tab');
                // Add tabindex to each tab
                tab.setAttribute('tabindex', '-1');
                // Add class to each tab's parent (list item)
                tab.parentNode.classList.add('dcf-tabs-list-item', 'dcf-mb-0');
                // Add role to each tab's parent (list item)
                tab.parentNode.setAttribute('role', 'presentation');
                //Handle clicking of tabs for mouse users
                tab.addEventListener('click', (e) => {
                    e.preventDefault();
                    let currentTab = tabList.querySelector('[aria-selected]');
                    if (e.currentTarget !== currentTab) {
                        switchTab(currentTab, e.currentTarget);
                    }
                });
                //Handle keydown events for keyboard users
                tab.addEventListener('keydown', (e) => {
                    // Get the index of the current tab in the tabs node list
                    let index = Array.prototype.indexOf.call(tabs, e.currentTarget);
                    // Work out which key the user is pressing and
                    // Calculate the new tab's index where appropriate
                    let dir = e.which === 37 ? index - 1 : e.which === 39 ? index + 1 : e.which === 40 ? 'down' : null;
                    if (dir !== null) {
                        e.preventDefault();
                        // If the down key is pressed, move focus to the open panel,
                        // otherwise switch to the adjacent tab
                        dir === 'down' ? panels[i].focus() : tabs[dir] ? switchTab(e.currentTarget, tabs[dir]) : void 0;
                    }
                });
            });

            // Add tab panel semantics and hide them all in each tab group.
            Array.prototype.forEach.call(panels, (panel, i) => {
                // Set role to each tab panel
                panel.setAttribute('role', 'tabpanel');
                // Set tabindex to let panel be focused
                panel.setAttribute('tabindex', '-1');
                // Add class to each tab panel
                panel.classList.add('dcf-tabs-panel');
                // Add ID to tab list link
                panel.setAttribute('id', uuid + '-tab-' + (i + 1));
                // Declare which tab labels each panel
                panel.setAttribute('aria-labelledby', tabs[i].id);
                panel.classList.add('dcf-mb-5');
                // Hide all tab panels
                panel.hidden = true;
            });

            // Add classes to tab list
            tabList.classList.add('dcf-tabs-list', 'dcf-list-bare', 'dcf-mb-0');
            // Add role to the tab list
            tabList.setAttribute('role', 'tablist');
            // Initially activate the first tab and reveal the first tab panel
            tabs[0].removeAttribute('tabindex');
            tabs[0].setAttribute('aria-selected', 'true');
            panels[0].hidden = false;
        });
    }
}
