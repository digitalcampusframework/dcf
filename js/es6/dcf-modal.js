import { disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock/lib/bodyScrollLock.es6';

class DCFModal {
  constructor(modals) {
    this.modals = modals;
    this.currentModal = null;
    this.currentBtn = null;

    this.body = document.querySelector('body');

    this.nonModals = [];
    const skipNav = document.getElementById('dcf-skip-nav');
    const header = document.getElementById('dcf-header');
    const main = document.getElementById('dcf-main');
    const footer = document.getElementById('dcf-footer');

    if (skipNav) {
      this.nonModals.push(skipNav);
    }
    if (header) {
      this.nonModals.push(header);
    }
    if (main) {
      this.nonModals.push(main);
    }
    if (footer) {
      this.nonModals.push(footer);
    }

    // Body Scroll Lock
    this.disableBodyScroll = disableBodyScroll;
    this.enableBodyScroll = enableBodyScroll;
    this.clearAllBodyScrollLocks = clearAllBodyScrollLocks;
    /*if (bodyScrollLock && bodyScrollLock.disableBodyScroll && bodyScrollLock.enableBodyScroll) {
      this.disableBodyScroll = bodyScrollLock.disableBodyScroll;
      this.enableBodyScroll = bodyScrollLock.enableBodyScroll;
    }
    */
  }

  magicNumbers(magicNumber) {
    const magicNumbers = {
      int0: 0,
      int1: 1,
      int16: 16,
      int1000: 1000,
      hex0x3: 0x3,
      hex0x8: 0x8,
      escCode: 27
    };
    Object.freeze(magicNumbers);

    if (magicNumber in magicNumbers) {
      return magicNumbers[magicNumber];
    }
    return undefined;
  }

  /**
   * Prepend modals to body so that elements outside of modal can be made inert
   * @param {string} el: the element that we are targetting
   */
  appendToBody(el) {
    this.body.appendChild(el);
  }

  // Toggle modal
  toggleModal(modalId, btnId) {
    const thisModal = document.getElementById(modalId);
    let modalOpen = thisModal.getAttribute('aria-hidden') === 'false';

    if (modalOpen) {
      // modal open so close it
      this.closeModal(modalId);
    } else {
      // modal closed so open it
      this.openModal(modalId, btnId);
    }
  }

  // Set nav toggle button state as open or closed
  // Note: Assumes nav toggle buttons are svgs with expected markup
  setNavToggleBtnState(btn, btnState = 'open') {
    const btnSVGs = btn.getElementsByTagName('svg');
    const btnLabels = btn.getElementsByClassName('dcf-nav-toggle-label');

    // Set SVG state
    if (btnSVGs.length) {
      const gTags = btnSVGs[this.magicNumbers('int0')].getElementsByTagName('g');
      gTags.foreach((tag) => {
        if (tag.classList.contains('dcf-nav-toggle-icon-open')) {
          if (btnState.toLowerCase() === 'open') {
            tag.classList.remove('dcf-d-none');
          } else {
            tag.classList.add('dcf-d-none');
          }
        } else if (tag.classList.contains('dcf-nav-toggle-icon-close')) {
          if (btnState.toLowerCase() === 'open') {
            tag.classList.add('dcf-d-none');
          } else {
            tag.classList.remove('dcf-d-none');
          }
        }
      });
    }

    // Set Button Label
    if (btnLabels.length) {
      if (btnState.toLowerCase() === 'open') {
        btnLabels[this.magicNumbers('int0')].textContent =
          btn.getAttribute('data-nav-toggle-label-open') ? btn.getAttribute('data-nav-toggle-label-open') : 'Open';
      } else {
        btnLabels[this.magicNumbers('int0')].textContent =
          btn.getAttribute('data-nav-toggle-label-closed') ? btn.getAttribute('data-nav-toggle-label-closed') : 'Close';
      }
    }
  }

  // Open modal
  openModal(modalId, openBtnId) {
    const navToggleGroup = document.getElementById('dcf-nav-toggle-group');
    const navToggleGroupParent = navToggleGroup && navToggleGroup.parentElement ? navToggleGroup.parentElement : null;

    this.modals.forEach((modal) => {
      if (modal.getAttribute('id') !== modalId) {
        this.closeModal(modal.getAttribute('id'));
      }
    });

    const thisModal = document.getElementById(modalId);
    let modalOpen = thisModal.getAttribute('aria-hidden') === 'false';

    let modalWithNavToggleGroup = false;
    if (openBtnId) {
      this.currentBtn = openBtnId;
      const openBtn = document.getElementById(openBtnId);
      modalWithNavToggleGroup = openBtn && openBtn.getAttribute('data-with-nav-toggle-group') === 'true';
      if (modalWithNavToggleGroup) {
        this.setNavToggleBtnState(openBtn, 'closed');
      }
    }

    this.currentModal = modalId;

    // Don't open modal if it's already open
    if (modalOpen) {
      return;
    }

    // Set elements outside of modal to be inert and hidden from screen readers
    this.nonModals.forEach((nonModal) => {
      if (modalWithNavToggleGroup && navToggleGroup && nonModal === navToggleGroupParent) {
        nonModal.setAttribute('aria-hidden', 'false');

        // hide all children of navToggleGroupParent except navToggleGroup
        const children = navToggleGroupParent.childNodes;
        children.forEach((child) => {
          if (child.nodeType === Node.ELEMENT_NODE) {
            if (child === navToggleGroup) {
              child.setAttribute('aria-hidden', 'false');
            } else {
              child.setAttribute('aria-hidden', 'true');
            }
          }
        });
      } else {
        nonModal.setAttribute('aria-hidden', 'true');
      }
    });

    // Prevent body from scrolling
    if (this.disableBodyScroll) {
      this.disableBodyScroll(thisModal);
    }

    // Add `.dcf-modal-is-open` helper class to body
    this.body.classList.add('dcf-modal-is-open');

    // Set attribute for this modal
    thisModal.setAttribute('aria-hidden', 'false');

    // Add/remove classes to this modal
    thisModal.classList.remove('dcf-opacity-0', 'dcf-pointer-events-none', 'dcf-invisible');
    thisModal.classList.add('dcf-opacity-100', 'dcf-pointer-events-auto');

    // Apply modal with toggle group class if requested
    if (modalWithNavToggleGroup) {
      thisModal.classList.add('dcf-z-modal-with-nav-toggle-group');
    }
    const keycodeTab = 9;
    const tabFocusEls = thisModal.querySelectorAll('button:not([hidden]):not([disabled]), ' +
      '[href]:not([hidden]), input:not([hidden]):not([type="hidden"]):not([disabled]), ' +
      'select:not([hidden]):not([disabled]), textarea:not([hidden]):not([disabled]), ' +
      '[tabindex="0"]:not([hidden]):not([disabled]), summary:not([hidden]), ' +
      '[contenteditable]:not([hidden]), audio[controls]:not([hidden]), ' +
      'video[controls]:not([hidden])');
    let firstTabFocusEl = tabFocusEls[this.magicNumbers('int0')];
    let lastTabFocusEl = tabFocusEls[tabFocusEls.length - this.magicNumbers('int1')];

    // Send focus to the modal
    thisModal.focus();

    // Trap focus inside the modal content
    thisModal.addEventListener('keydown', (event) => {
      let isTabPressed = event.key === 'Tab' || event.keyCode === keycodeTab;

      if (!isTabPressed) {
        return;
      }

      if (event.key === 'Tab' || event.keyCode === keycodeTab) {
        if (event.shiftKey) { // Tab backwards (shift + tab)
          if (document.activeElement === firstTabFocusEl) {
            event.preventDefault();
            lastTabFocusEl.focus();
          }
        } else if (document.activeElement === lastTabFocusEl) {
          event.preventDefault();
          firstTabFocusEl.focus();
        }
      }
    });

    // Trigger open modal event for this modal to allow event listeners to handle
    const eventName = `ModalOpenEvent_${ modalId}`;
    document.dispatchEvent(new CustomEvent(eventName));
  }

  // Close modal
  closeModal(modalId) {
    const navToggleGroup = document.getElementById('dcf-nav-toggle-group');
    const navToggleGroupParent = navToggleGroup && navToggleGroup.parentElement ? navToggleGroup.parentElement : null;
    const thisModal = document.getElementById(modalId);
    let modalClosed = thisModal.getAttribute('aria-hidden') === 'true';
    this.currentModal = null;

    // Don't close modal if it's already closed
    if (modalClosed) {
      return;
    }

    // Remove `.dcf-modal-is-open` helper class from body
    this.body.classList.remove('dcf-modal-is-open');

    if (this.currentBtn) {
      const closeBtn = document.getElementById(this.currentBtn);
      if (closeBtn && closeBtn.getAttribute('data-with-nav-toggle-group') === 'true') {
        this.setNavToggleBtnState(closeBtn, 'open');
      }
    }

    // Restore visibility and functionality to elements outside of modal
    this.nonModals.forEach((nonModal) => {
      if (navToggleGroup && nonModal === navToggleGroupParent) {
        // show all children of navToggleGroupParent
        const children = navToggleGroupParent.childNodes;
        children.forEach((child) => {
          if (child.nodeType === Node.ELEMENT_NODE) {
            child.setAttribute('aria-hidden', 'false');
          }
        });
      }

      // show all nonModals
      nonModal.setAttribute('aria-hidden', 'false');
    });

    // Set attribute for this modal
    thisModal.setAttribute('aria-hidden', 'true');

    // Add/remove classes to this modal
    thisModal.classList.remove('dcf-opacity-100', 'dcf-pointer-events-auto', 'z-modal-with-nav-toggle-group');
    thisModal.classList.add('dcf-opacity-0', 'dcf-pointer-events-none');

    // Modal transition
    function modalTransition() {
      // Remove event listener after the modal transition
      thisModal.removeEventListener('transitionend', modalTransition);

      // Add the `.dcf-invisible` class to this modal after the transition
      if (!thisModal.classList.contains('dcf-invisible')) {
        thisModal.classList.add('dcf-invisible');
      }
    }

    // Add event listener for the end of the modal transition
    thisModal.addEventListener('transitionend', modalTransition);

    // Send focus back to button that opened modal
    if (this.currentBtn) {
      document.getElementById(this.currentBtn).focus();
    }

    // Allow body to scroll
    if (this.enableBodyScroll) {
      this.enableBodyScroll(thisModal);
    }

    // Trigger close modal event for this modal to allow event listeners to handle
    const eventName = `ModalCloseEvent_${ modalId}`;
    document.dispatchEvent(new CustomEvent(eventName));
  }

  btnToggleListen(btnToggleModal, modalId, btnId) {
    // Listen for when 'open modal' button is pressed
    btnToggleModal.addEventListener('click', () => {
      // Toggle modal when button is pressed
      this.toggleModal(modalId, btnId);
    }, false);
  }

  btnCloseListen(btnCloseModal, modal) {
    // Listen for when 'close modal' button is pressed
    btnCloseModal.addEventListener('click', () => {
      // Open modal when button is pressed
      this.closeModal(modal.getAttribute('id'));
    }, false);
  }

  overlayListen(modal, modalWrapper) {
    // Listen for clicks on the open modal
    modal.addEventListener('click', (event) => {
      // If the click is in modal wrapper, leave the modal open
      if (modalWrapper.contains(event.target)) {
        return;
      }

      // If the click is outside the modal wrapper (on the modal overlay), close the modal
      this.closeModal(modal.getAttribute('id'));
    });
  }

  escListen() {
    // Listen for when 'esc' key is pressed
    document.addEventListener('keydown', (event) => {
      // Close the currently open modal when 'esc' key is pressed
      if (event.which === this.magicNumbers('escCode') && this.currentModal) {
        event.preventDefault();
        this.closeModal(this.currentModal);
      }
    });
  }

  generateUUID() {
    const NUMERIC_0 = this.magicNumbers('int0');
    const NUMERIC_16 = this.magicNumbers('int16');
    const HEX0x3 = this.magicNumbers('hex0x3');
    const HEX0x8 = this.magicNumbers('hex0x8');

    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (uuid) => {
      let rand = Math.random() * NUMERIC_16 | NUMERIC_0,
        uuidv4 = uuid === 'x' ? rand : rand & HEX0x3 | HEX0x8;
      return uuidv4.toString(NUMERIC_16);
    });
  }

  initialize() {
    if (!this.modals) {
      return;
    }

    // Define constants used in modal component
    const btnsToggleModal = document.querySelectorAll('.dcf-btn-toggle-modal');
    const btnsCloseModal = document.querySelectorAll('.dcf-btn-close-modal');
    const modalsWrapper = document.querySelectorAll('.dcf-modal-wrapper');
    const modalsContent = document.querySelectorAll('.dcf-modal-content');
    const modalsHeader = document.querySelectorAll('.dcf-modal-header');

    // Loop through all buttons that open modals
    btnsToggleModal.forEach((button) => {
      const modalId = button.getAttribute('data-toggles-modal');

      // Generate unique ID for each 'open modal' button
      const btnId = this.generateUUID();
      button.setAttribute('id', btnId);

      // Buttons are disabled by default until JavaScript has loaded.
      // Remove the 'disabled' attribute to make them functional.
      button.removeAttribute('disabled');
      this.btnToggleListen(button, modalId, btnId);
    });

    // Loop through all modals
    for (let modalIndex = 0; modalIndex < this.modals.length; modalIndex++) {
      const modal = this.modals[modalIndex];
      const modalWrapper = modalsWrapper[modalIndex];
      const modalContent = modalsContent[modalIndex];
      const modalHeader = modalsHeader[modalIndex];
      const btnCloseModal = btnsCloseModal[modalIndex];
      const modalId = modal.id;
      const modalHeadingId = `${modalId }-heading`;

      // Get all headings in each modal header
      const modalHeadings = modalHeader.querySelectorAll('h1, h2, h3, h4, h5, h6');

      // Set ID on the first heading of each modal
      modalHeadings[this.magicNumbers('int0')].id = modalHeadingId;

      // Append modals to body so that elements outside of modal can be hidden when modal is open
      this.appendToBody(modal);

      // Modals are hidden by default until JavaScript has loaded.
      // Remove `hidden` attribute, then later replace with `.dcf-invisible` to allow for modal transitions.
      modal.removeAttribute('hidden');

      // Set attributes for each modal
      modal.setAttribute('aria-labelledby', modalHeadingId);
      modal.setAttribute('aria-hidden', 'true');
      modal.setAttribute('role', 'dialog');
      modal.setAttribute('tabindex', '-1');

      // Check modal for any additional classes
      if (modal.classList.length === this.magicNumbers('int1') && modal.classList.contains('dcf-modal')) {
        // If no custom classes are present, add default background utility class to modal
        modal.classList.add('dcf-bg-overlay-dark');
      }

      // Add default utility classes to each modal
      modal.classList.add('dcf-fixed', 'dcf-pin-top', 'dcf-pin-left', 'dcf-h-100%', 'dcf-w-100%', 'dcf-d-flex', 'dcf-ai-center',
        'dcf-jc-center', 'dcf-opacity-0', 'dcf-pointer-events-none', 'dcf-invisible');

      // Set attribute for modal wrapper
      modalWrapper.setAttribute('role', 'document');

      // Check modal wrapper for any additional classes
      if (modalWrapper.classList.length === this.magicNumbers('int1') && modalWrapper.classList.contains('dcf-modal-wrapper')) {
        // If no custom classes are present, add default utility classes to modal wrapper
        modalWrapper.classList.add('dcf-relative', 'dcf-h-auto', 'dcf-overflow-y-auto');
      }

      // Check modal header for any additional classes
      if (modalHeader.classList.length === this.magicNumbers('int1') && modalHeader.classList.contains('dcf-modal-header')) {
        // If no custom classes are present, add default utility classes to modal header
        modalHeader.classList.add('dcf-wrapper', 'dcf-pt-8', 'dcf-sticky', 'dcf-pin-top');
      }

      // Check each 'close' button for any additional classes
      if (btnCloseModal.classList.length === this.magicNumbers('int1') && btnCloseModal.classList.contains('dcf-btn-close-modal')) {
        // If no custom classes are present, add default utility classes to 'close' button
        btnCloseModal.classList.add('dcf-btn', 'dcf-btn-tertiary', 'dcf-absolute', 'dcf-pin-top', 'dcf-pin-right', 'dcf-z-1');
      }

      // Check modal content for any additional classes
      if (modalContent.classList.length === this.magicNumbers('int1') && modalContent.classList.contains('dcf-modal-content')) {
        // If no custom classes are present, add default utility classes to modal content
        modalContent.classList.add('dcf-wrapper', 'dcf-pb-8');
      }

      // Set attributes for each 'close' button
      btnCloseModal.setAttribute('type', 'button');
      btnCloseModal.setAttribute('aria-label', 'Close');

      this.escListen();
      this.overlayListen(modal, modalWrapper);
      this.btnCloseListen(btnCloseModal, modal);
    }
  }
}
