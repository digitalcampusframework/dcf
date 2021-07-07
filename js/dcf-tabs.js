class DCFTabs {
  constructor(tabGroups, options = {}) {
    this.tabGroups = tabGroups;
    this.tabHashLookup = {};
    this.useHashChange = true;
    if (options.useHashChange === false) {
      this.useHashChange = false;
    }
  }

  // Tab switching function
  switchTab(oldTab, newTab, setPageHash = false) {
    if (oldTab) {
      oldTab.removeAttribute('aria-selected');
      oldTab.setAttribute('tabindex', '-1');

      // hide panel for oldTab
      const hidePanelID = oldTab.getAttribute('data-panel-id');
      if (hidePanelID) {
        const hidePanel = document.getElementById(hidePanelID);
        if (hidePanel) {
          hidePanel.hidden = true;
        }
      }
    }

    newTab.focus();
    // Make the active tab focusable by the user (Tab key)
    newTab.removeAttribute('tabindex');
    // Set the selected state
    newTab.setAttribute('aria-selected', 'true');
    newTab.setAttribute('tabindex', '0');


    // show panel for newTab
    const showPanelID = newTab.getAttribute('data-panel-id');
    if (showPanelID) {
      const showPanel = document.getElementById(showPanelID);
      if (showPanel) {
        showPanel.hidden = false;
        showPanel.scrollIntoView();
      } else {
        // eslint-disable-next-line no-console
        console.error(`DCF Tabs: The tab panel with id ${showPanelID} is not associated with a tab.`);
      }
    } else {
      const tabId = newTab.getAttribute('id');
      // eslint-disable-next-line no-console
      console.error(`DCF Tabs: The tab with id ${tabId} is missing panel href to map to panel.`);
    }

    if (setPageHash) {
      // Set page hash
      this.setPageHash(newTab.getAttribute('href'));
    }
  }

  getCurrentTabByTab(tab) {
    const tabList = tab.parentNode.parentNode;
    let currentTab = null;
    if (tabList.tagName === 'OL' || tabList.tagName === 'UL') {
      currentTab = tabList.querySelector('[aria-selected]');
    }
    return currentTab;
  }

  isHash(hash) {
    return hash && hash.substr(DCFUtility.magicNumbers('int0'), DCFUtility.magicNumbers('int1')) === '#';
  }

  setPageHash(testHash) {
    // use clear hash if not valid hash
    const hash = this.isHash(testHash) ? testHash : '';
    // set hash
    if (hash && history.pushState) {
      history.pushState(null, null, window.location.origin + window.location.pathname + hash);
    } else {
      location.hash = hash;
    }
  }

  displayTabByHash(hash) {
    if (this.useHashChange && this.isHash(hash)) {
      if (hash && this.tabHashLookup[hash]) {
        const newTab = this.tabHashLookup[hash];
        const oldTab = this.getCurrentTabByTab(newTab);
        if (oldTab !== newTab) {
          this.switchTab(oldTab, newTab, false);
        }
      }
    }
  }

  initialize() {
    Array.prototype.forEach.call(this.tabGroups, (tabGroup) => {
      // Define constants for tabs
      const tabList = tabGroup.querySelector('.dcf-tabs > ol, .dcf-tabs > ul');
      const tabs = tabList.querySelectorAll('a');
      const panels = tabGroup.querySelectorAll('.dcf-tabs > div, .dcf-tabs > section');
      const uuid = DCFUtility.uuidv4();

      // Prefix each tab group with a unique ID.
      tabGroup.setAttribute('id', DCFUtility.checkSetElementId(tabGroup, uuid.concat('-tab-group')));

      // Tab styling and functions.
      Array.prototype.forEach.call(tabs, (tab, tabIndex) => {
        // Add class to each tab
        tab.classList.add('dcf-tab', 'dcf-d-block');

        // Prefix each tab within its parent tab group with the corresponding uuid.
        let nextTab = tabIndex + DCFUtility.magicNumbers('int1');
        tab.setAttribute('id', DCFUtility.checkSetElementId(tab, uuid.concat('-tab-', nextTab)));

        // Add role to each tab
        tab.setAttribute('role', 'tab');

        // Add tabindex to each tab
        tab.setAttribute('tabindex', '-1');

        // Add class to each tab's parent (list item)
        tab.parentNode.classList.add('dcf-tabs-list-item', 'dcf-mb-0');

        // Add role to each tab's parent (list item)
        tab.parentNode.setAttribute('role', 'presentation');

        const tabHref = tab.getAttribute('href');
        // Add tab to tabHashLookup
        if (this.isHash(tabHref)) {
          tab.setAttribute('data-panel-id', tabHref.substring(DCFUtility.magicNumbers('int1')));
          this.tabHashLookup[tabHref] = tab;
        }

        // Handle clicking of tabs for mouse users
        tab.addEventListener('click', (clickEvent) => {
          clickEvent.preventDefault();
          let currentTab = tabList.querySelector('[aria-selected]');
          if (clickEvent.currentTarget !== currentTab) {
            this.switchTab(currentTab, clickEvent.currentTarget, this.useHashChange);
          }
        });

        // Handle keydown events for keyboard users
        tab.addEventListener('keydown', (keydownEvent) => {
          // Get the index of the current tab in the tabs node list
          let index = Array.prototype.indexOf.call(tabs, keydownEvent.currentTarget);
          // Work out which key the user is pressing and
          // Calculate the new tab's index where appropriate
          let dir = 0;
          if (DCFUtility.isKeyEvent(keydownEvent, DCFUtility.keyEvents('arrowLeft'))) {
            if (index > DCFUtility.magicNumbers('int0')) {
              dir = index - DCFUtility.magicNumbers('int1');
            } else {
              dir = tabs.length - DCFUtility.magicNumbers('int1');
            }
          } else if (DCFUtility.isKeyEvent(keydownEvent, DCFUtility.keyEvents('arrowRight'))) {
            if (index < tabs.length - DCFUtility.magicNumbers('int1')) {
              dir = index + DCFUtility.magicNumbers('int1');
            }
          } else if (DCFUtility.isKeyEvent(keydownEvent, DCFUtility.keyEvents('arrowDown'))) {
            dir = 'down';
          } else {
            dir = null;
          }

          if (dir !== null) {
            keydownEvent.preventDefault();
            // If the down key is pressed, move focus to the open panel,
            // otherwise switch to the adjacent tab
            if (dir === 'down') {
              const tabPanelID = tab.getAttribute('data-panel-id');
              if (tabPanelID) {
                const tabPanel = document.getElementById(tabPanelID);
                if (tabPanel) {
                  tabPanel.focus();
                }
              }
            } else if (tabs[dir]) {
              this.switchTab(keydownEvent.currentTarget, tabs[dir], false);
            }
          }
        }, false);
      });

      // Add tab panel semantics and hide them all in each tab group.
      Array.prototype.forEach.call(panels, (panel) => {
        // Set role to each tab panel
        panel.setAttribute('role', 'tabpanel');
        // Set tabindex to let panel be focused
        panel.setAttribute('tabindex', '-1');
        // Add class to each tab panel
        panel.classList.add('dcf-tabs-panel');
        // Hide all tab panels
        panel.hidden = true;

        const panelID = panel.getAttribute('id');
        if (panelID) {
          const panelTab = this.tabHashLookup[`#${panelID}`];
          if (panelTab) {
            // Declare which tab labels each panel
            panel.setAttribute('aria-labelledby', panelTab.getAttribute('id'));
            panel.addEventListener('keydown', (keydownEvent) => {
              if (DCFUtility.isKeyEvent(keydownEvent, DCFUtility.keyEvents('arrowUp'))) {
                panelTab.focus();
                keydownEvent.stopPropagation();
              }
            });
          }
        }
      });

      // Add classes to tab list
      tabList.classList.add('dcf-tabs-list', 'dcf-list-bare', 'dcf-mb-0');
      // Add role to the tab list
      tabList.setAttribute('role', 'tablist');
      // Initially activate the first tab and reveal the first tab panel
      this.switchTab(null, tabs[DCFUtility.magicNumbers('int0')], false);

      window.addEventListener('resetTabGroup', () => {
        const newTab = tabs[DCFUtility.magicNumbers('int0')];
        const oldTab = this.getCurrentTabByTab(newTab);
        if (oldTab !== newTab) {
          this.switchTab(oldTab, newTab, false);
        }
      });
    });

    // Handle hash change
    window.addEventListener('hashchange', () => {
      const hash = window.location.hash;
      if (hash) {
        this.displayTabByHash(hash);
      } else {
        window.dispatchEvent(new Event('resetTabGroup'));
      }
    });

    // Open tab on page load if valid
    if (this.useHashChange && window.location.hash) {
      this.displayTabByHash(window.location.hash);
    }
  }
}
