class DCFNavMenuToggle {
  constructor(bodyScrollLock) {
    this.disableBodyScroll = bodyScrollLock.disableBodyScroll;
    this.enableBodyScroll = bodyScrollLock.enableBodyScroll;

    // grab an element
    this.skipNav = document.getElementById('dcf-skip-nav');
    this.institutionTitle = document.getElementById('dcf-institution-title');
    this.logo = document.getElementById('dcf-logo-lockup');
    this.nav = document.getElementById('dcf-navigation');
    this.main = document.querySelector('main');
    this.footer = document.getElementById('dcf-footer');

    // construct an instance of Headroom, passing the element
    const mobileActions = document.querySelectorAll('.hrjs');
    Array.prototype.forEach.call(mobileActions, (action) => {
      try {
        const headroomObj = new Headroom(action, {
          tolerance: {
            up: 5,
            down: 5
          }
        });
        headroomObj.init();
      } catch (err) {
        // do nothing
      }
    });

    this.toggleButtons = document.querySelectorAll('.dcf-nav-toggle-btn-menu');
    this.toggleIconOpen = document.getElementById('dcf-nav-toggle-icon-open-menu');
    this.toggleIconClose = document.getElementById('dcf-nav-toggle-icon-close-menu');
    this.toggleLabel = document.querySelector('.dcf-nav-toggle-label-menu');
    this.mobileNav = document.getElementById('dcf-navigation');
    this.modalParent = document.querySelector('.dcf-nav-menu');
    this.mobileNavMenu = document.getElementById('dcf-nav-menu-child');
    if (!this.mobileNavMenu) {
      this.mobileNavMenu = document.createElement('nav');
      this.mobileNavMenu.setAttribute('id', 'dcf-nav-menu-child');
    }
    this.tabFocusEls = this.mobileNavMenu.querySelectorAll('[href]');
    this.firstTabFocusEl = this.tabFocusEls[DCFUtility.magicNumbers('int0')];
    this.lastTabFocusEl = this.tabFocusEls[this.tabFocusEls.length - DCFUtility.magicNumbers('int1')];
    this.closeSearchEvent = new CustomEvent('closeSearch');
    this.closeIDMOptionsEvent = new CustomEvent('closeDropDownWidget', { detail: { type: 'idm-logged-in' } });

    // We need to keep track of the toggle button that activated the menu so that we can return focus to it when the menu is closed
    this.activeToggleButton = null;

    this.isNavigationOpen = () => this.modalParent.classList.contains('dcf-modal-open');

    this.closeOpenNavigation = () => {
      if (this.isNavigationOpen() === true) {
        this.closeNavModal();
      }
    };

    this.onKeyDown = (event) => {
      if (event.keyCode === DCFUtility.magicNumbers('escCode')) {
        this.closeNavModal();
      }

      const keycodeTab = 9;
      const isTabPressed = event.key === 'Tab' || event.keyCode === keycodeTab;

      if (!isTabPressed) {
        return;
      }

      // Trap focus inside the nav modal
      if (event.key === 'Tab' || event.keyCode === keycodeTab) {
        if (event.shiftKey) {
          // Tab backwards (shift + tab)
          if (document.activeElement === this.firstTabFocusEl) {
            event.preventDefault();
            this.lastTabFocusEl.focus();
          }
        } else if (document.activeElement === this.lastTabFocusEl) {
          event.preventDefault();
          this.firstTabFocusEl.focus();
        }
      }
    };

    // add an event listener for close Navigation Event
    document.addEventListener('closeNavigation', this.closeOpenNavigation, false);

    // add an event listener for resize
    window.addEventListener('resize', this.closeOpenNavigation, false);

    Array.prototype.forEach.call(this.toggleButtons, (button) => {
      button.addEventListener('click', (clickEvent) => {
        this.activeToggleButton = clickEvent.currentTarget;
        if (this.isNavigationOpen() === true) {
          this.closeNavModal();
        } else {
          this.openNavModal();
        }
        return false;
      }, false);
    });

    const primaryNavLi = document.querySelectorAll('.dcf-nav-menu-child>ul>li');
    const allPrimaryNavLi = Array.from(primaryNavLi);
    // Find any child <ul> in local navigation <li>
    const hasChild = allPrimaryNavLi.find((el) => el.querySelector('ul'));
    const desktopBtn = document.getElementById('dcf-menu-toggle');

    // Show "desktop" menu toggle button if navigation contains children
    if (hasChild && desktopBtn) {
      desktopBtn.removeAttribute('hidden');
      desktopBtn.setAttribute('aria-expanded', 'false');
      desktopBtn.setAttribute('aria-label', 'open menu');
    }
  }

  openNavModal() {
    // Hide other mobile toggles
    document.dispatchEvent(this.closeSearchEvent);
    document.dispatchEvent(this.closeIDMOptionsEvent);

    if (window.matchMedia('(max-width: 56.12em)').matches) {
      this.skipNav.setAttribute('aria-hidden', 'true');
      this.institutionTitle.setAttribute('aria-hidden', 'true');
      this.logo.setAttribute('aria-hidden', 'true');
      this.nav.setAttribute('aria-hidden', 'false');
      this.main.setAttribute('aria-hidden', 'true');
      this.footer.setAttribute('aria-hidden', 'true');
      this.disableBodyScroll(this.mobileNavMenu);
    }
    Array.prototype.forEach.call(this.toggleButtons, (button) => {
      button.setAttribute('aria-expanded', 'true');
      button.setAttribute('aria-label', 'close menu');
    });
    this.modalParent.classList.add('dcf-modal-open');
    this.toggleIconOpen.classList.add('dcf-d-none');
    this.toggleIconClose.classList.remove('dcf-d-none');
    this.toggleLabel.textContent = 'Close';

    this.firstTabFocusEl.focus();
    document.addEventListener('keydown', this.onKeyDown);
  }

  closeNavModal() {
    if (window.matchMedia('(max-width: 56.12em)').matches) {
      this.skipNav.setAttribute('aria-hidden', 'false');
      this.institutionTitle.setAttribute('aria-hidden', 'false');
      this.logo.setAttribute('aria-hidden', 'false');
      this.nav.setAttribute('aria-hidden', 'true');
      this.main.setAttribute('aria-hidden', 'false');
      this.footer.setAttribute('aria-hidden', 'false');

      // Allow body scroll when navigation is closed
      this.enableBodyScroll(this.mobileNavMenu);
    }
    Array.prototype.forEach.call(this.toggleButtons, (button) => {
      button.setAttribute('aria-expanded', 'false');
      button.setAttribute('aria-label', 'open menu');
    });
    this.modalParent.classList.remove('dcf-modal-open');
    this.toggleIconOpen.classList.remove('dcf-d-none');
    this.toggleIconClose.classList.add('dcf-d-none');
    this.toggleLabel.textContent = 'Menu';
    this.activeToggleButton.focus();
    document.removeEventListener('keydown', this.onKeyDown);
  }
}
