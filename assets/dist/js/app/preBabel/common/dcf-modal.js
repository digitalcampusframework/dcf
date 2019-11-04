;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['./dcf-uuidGen'], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require('./dcf-uuidGen'));
  } else {
    root.dcfModal = factory(root.dcfHelperUuidv4);
  }
}(this, function(uuidv4) {
class Modal {
  /**
   * class constructor
   * @param {modals} modals of selected modals
   */
  constructor(modals, bodyScrollLock) {
    this.modals = modals;
    this.disableBodyScroll = null;
    this.enableBodyScroll = null;
    if (bodyScrollLock && bodyScrollLock.disableBodyScroll && bodyScrollLock.enableBodyScroll) {
      this.disableBodyScroll = bodyScrollLock.disableBodyScroll;
      this.enableBodyScroll = bodyScrollLock.enableBodyScroll;
    }
  }

  /**
   * Prepend modals to body so that elements outside of modal can be made inert
   * @param {string} el: the element that we are targetting
   */
  appendToBody(el) {
    const body = document.querySelector('body');
    body.appendChild(el);
  }

  // Toggle modal
  toggleModal(modalId, btnId) {
    const thisModal = document.getElementById(modalId);
    let modalOpen = thisModal.getAttribute('aria-hidden') === 'false' ? true : false;

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
  setNavToggleBtnState(btn, btnState) {
    btnState = typeof btnState !== 'undefined' ? btnState : 'open';
    const btnSVGs = btn.getElementsByTagName('svg');
    const btnLabels = btn.getElementsByClassName('dcf-nav-toggle-label');

    // Set SVG state
    if (btnSVGs.length) {
      const gTags = btnSVGs[0].getElementsByTagName('g');
      for (var i = 0; i < gTags.length; i++) {
        if (gTags[i].classList.contains('dcf-nav-toggle-icon-open')) {
          if (btnState.toLowerCase() == 'open') {
            gTags[i].classList.remove('dcf-d-none');
          } else {
            gTags[i].classList.add('dcf-d-none');
          }
        } else if (gTags[i].classList.contains('dcf-nav-toggle-icon-close')) {
          if (btnState.toLowerCase() == 'open') {
            gTags[i].classList.add('dcf-d-none');
          } else {
            gTags[i].classList.remove('dcf-d-none');
          }
        }
      }
    }

    // Set Button Label
    if (btnLabels.length) {
      if (btnState.toLowerCase() == 'open') {
        btnLabels[0].textContent = btn.getAttribute('data-nav-toggle-label-open') ? btn.getAttribute('data-nav-toggle-label-open') : 'Open';
      } else {
        btnLabels[0].textContent = btn.getAttribute('data-nav-toggle-label-closed') ? btn.getAttribute('data-nav-toggle-label-closed') : 'Close';
      }
    }

  }

  // Open modal
  openModal(modalId, openBtnId) {
    const body = document.querySelector('body');
    const skipNav = document.getElementById('dcf-skip-nav');
    const header = document.getElementById('dcf-header');
    const main = document.getElementById('dcf-main');
    const footer = document.getElementById('dcf-footer');
    const navToggleGroup = document.getElementById('dcf-nav-toggle-group');
    const navToggleGroupParent = navToggleGroup && navToggleGroup.parentElement ? navToggleGroup.parentElement : null;
    const nonModals = [ skipNav, header, main, footer ];

    for (let i = 0; i < this.modals.length; i++) {
      const modal = this.modals[i];
      if (modal.getAttribute('id') !== modalId) {
        this.closeModal(modal.getAttribute('id'));
      }
    }

    const thisModal = document.getElementById(modalId);
    let modalOpen = thisModal.getAttribute('aria-hidden') === 'false' ? true : false;

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
    nonModals.forEach(function(el, array) {
      if (modalWithNavToggleGroup && navToggleGroup && el === navToggleGroupParent) {
        el.setAttribute('aria-hidden','false');

        // hide all children of navToggleGroupParent except navToggleGroup
        const children = navToggleGroupParent.childNodes;
        children.forEach(function(child, array) {
          if (child.nodeType === Node.ELEMENT_NODE) {
            if (child === navToggleGroup) {
              child.setAttribute('aria-hidden', 'false');
            } else {
              child.setAttribute('aria-hidden', 'true');
            }
          }
        });
      } else {
        el.setAttribute('aria-hidden','true');
      }
    });

    // Prevent body from scrolling
    if (this.disableBodyScroll) {
      this.disableBodyScroll(thisModal);
    }

    // Add `.dcf-modal-is-open` helper class to body
    body.classList.add('dcf-modal-is-open');

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
    let firstTabFocusEl = tabFocusEls[0];
    let lastTabFocusEl = tabFocusEls[tabFocusEls.length - 1];

    // Send focus to the modal
    thisModal.focus();

    // Trap focus inside the modal content
    thisModal.addEventListener('keydown', function(e) {

      let isTabPressed = e.key === 'Tab' || e.keyCode === keycodeTab;

      if (!isTabPressed) {
        return;
      }

      if (e.key === 'Tab' || e.keyCode === keycodeTab) {
        if ( e.shiftKey ) { // Tab backwards (shift + tab)
          if (document.activeElement === firstTabFocusEl) {
            e.preventDefault();
            lastTabFocusEl.focus();
          }
        } else { // Tab forwards
          if (document.activeElement === lastTabFocusEl) {
            e.preventDefault();
            firstTabFocusEl.focus();
          }
        }
      }
    });

    // Trigger open modal event for this modal to allow event listeners to handle
    const eventName = 'ModalOpenEvent_' + modalId;
    document.dispatchEvent(new CustomEvent(eventName));
  }

  // Close modal
  closeModal(modalId) {

    const body = document.querySelector('body');
    const skipNav = document.getElementById('dcf-skip-nav');
    const header = document.getElementById('dcf-header');
    const main = document.getElementById('dcf-main');
    const footer = document.getElementById('dcf-footer');
    const navToggleGroup = document.getElementById('dcf-nav-toggle-group');
    const navToggleGroupParent = navToggleGroup && navToggleGroup.parentElement ? navToggleGroup.parentElement: null;
    const nonModals = [ skipNav, header, main, footer ];
    const thisModal = document.getElementById(modalId);
    let modalClosed = thisModal.getAttribute('aria-hidden') === 'true' ? true : false;
    this.currentModal = null;

    // Don't close modal if it's already closed
    if (modalClosed) {
      return;
    }

    // Remove `.dcf-modal-is-open` helper class from body
    body.classList.remove('dcf-modal-is-open');

    if (this.currentBtn) {
      const closeBtn = document.getElementById(this.currentBtn);
      if (closeBtn && closeBtn.getAttribute('data-with-nav-toggle-group') === 'true') {
        this.setNavToggleBtnState(closeBtn, 'open');
      }
    }

    // Restore visibility and functionality to elements outside of modal
    nonModals.forEach(function(el, array) {
      if (navToggleGroup && el === navToggleGroupParent) {
        // show all children of navToggleGroupParent
        const children = navToggleGroupParent.childNodes;
        children.forEach(function (child, array) {
          if (child.nodeType === Node.ELEMENT_NODE) {
            child.setAttribute('aria-hidden', 'false');
          }
        });
      }

      // show all nonModals
      el.setAttribute('aria-hidden','false');
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
    const eventName = 'ModalCloseEvent_' + modalId;
    document.dispatchEvent(new CustomEvent(eventName));
  }

  btnToggleListen(btnToggleModal, modalId, btnId) {
    let modalInstance = this;

    // Listen for when 'open modal' button is pressed
    btnToggleModal.addEventListener('click', function () {
      // Toggle modal when button is pressed
      modalInstance.toggleModal(modalId, btnId);
    }, false);
  }

  btnCloseListen(btnCloseModal, modal) {
    let modalInstance = this;

    // Listen for when 'close modal' button is pressed
    btnCloseModal.addEventListener('click', function () {

      // Open modal when button is pressed
      modalInstance.closeModal(modal.getAttribute('id'));
    }, false);
  }

  overlayListen(modal, modalWrapper) {
    let modalInstance = this;

    // Listen for clicks on the open modal
    modal.addEventListener('click', function (event) {

      // If the click is in modal wrapper, leave the modal open
      if (modalWrapper.contains(event.target)) {
        return;
      }

      // If the click is outside the modal wrapper (on the modal overlay), close the modal
      modalInstance.closeModal(modal.getAttribute('id'));
    });
  }

  escListen() {
    let modalInstance = this;

    // Listen for when 'esc' key is pressed
    document.addEventListener('keydown', function (event) {

      // Close the currently open modal when 'esc' key is pressed
      if (event.which === 27 && modalInstance.currentModal) {
        event.preventDefault();
        modalInstance.closeModal(modalInstance.currentModal);
      }
    });

  }

  generateUUID() {
    var d = new Date().getTime();
    var d2 = (performance && performance.now && (performance.now()*1000)) || 0;
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16;
      if(d > 0){
        r = (d + r)%16 | 0;
        d = Math.floor(d/16);
      } else {
        r = (d2 + r)%16 | 0;
        d2 = Math.floor(d2/16);
      }
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
  }

  initialize() {
    if(!this.modals) {
      return;
    }

    // Define constants used in modal component
    const body = document.querySelector('body');
    const btnsToggleModal = document.querySelectorAll('.dcf-btn-toggle-modal');
    const btnsCloseModal = document.querySelectorAll('.dcf-btn-close-modal');
    const modalsWrapper = document.querySelectorAll('.dcf-modal-wrapper');
    const modalsContent = document.querySelectorAll('.dcf-modal-content');
    const modalsHeader = document.querySelectorAll('.dcf-modal-header');

    let currentBtn = null;
    let currentModal = null;

    // Loop through all buttons that open modals
    for (let i = 0; i < btnsToggleModal.length; i++) {
      const btnToggleModal = btnsToggleModal[i];
      const modalId = btnToggleModal.getAttribute('data-toggles-modal');

      // Generate unique ID for each 'open modal' button
      const btnId = this.generateUUID();
      btnToggleModal.setAttribute('id', btnId);

      // Buttons are disabled by default until JavaScript has loaded.
      // Remove the 'disabled' attribute to make them functional.
      btnToggleModal.removeAttribute('disabled');
      this.btnToggleListen(btnToggleModal, modalId, btnId);
    }

    // Loop through all modals
    for (let i = 0; i < this.modals.length; i++) {
      const modal = this.modals[i];
      const modalWrapper = modalsWrapper[i];
      const modalContent = modalsContent[i];
      const modalHeader = modalsHeader[i];
      const btnCloseModal = btnsCloseModal[i];
      const modalId = modal.id;
      const modalHeadingId = modalId + '-heading';

      // Get all headings in each modal header
      const modalHeadings = modalHeader.querySelectorAll('h1, h2, h3, h4, h5, h6');

      // Set ID on the first heading of each modal
      modalHeadings[0].id = modalHeadingId;

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
      if (modal.classList.length === 1 && modal.classList.contains('dcf-modal')) {
        // If no custom classes are present, add default background utility class to modal
        modal.classList.add('dcf-bg-overlay-dark');
      }

      // Add default utility classes to each modal
      modal.classList.add('dcf-fixed', 'dcf-pin-top', 'dcf-pin-left', 'dcf-h-100%', 'dcf-w-100%', 'dcf-d-flex', 'dcf-ai-center', 'dcf-jc-center', 'dcf-opacity-0', 'dcf-pointer-events-none', 'dcf-invisible');

      // Set attribute for modal wrapper
      modalWrapper.setAttribute('role', 'document');

      // Check modal wrapper for any additional classes
      if (modalWrapper.classList.length === 1 && modalWrapper.classList.contains('dcf-modal-wrapper')) {
        // If no custom classes are present, add default utility classes to modal wrapper
        modalWrapper.classList.add('dcf-relative', 'dcf-h-auto', 'dcf-overflow-y-auto');
      }

      // Check modal header for any additional classes
      if (modalHeader.classList.length === 1 && modalHeader.classList.contains('dcf-modal-header')) {
        // If no custom classes are present, add default utility classes to modal header
        modalHeader.classList.add('dcf-wrapper', 'dcf-pt-8', 'dcf-sticky', 'dcf-pin-top');
      }

      // Check each 'close' button for any additional classes
      if (btnCloseModal.classList.length === 1 && btnCloseModal.classList.contains('dcf-btn-close-modal')) {
        // If no custom classes are present, add default utility classes to 'close' button
        btnCloseModal.classList.add('dcf-btn', 'dcf-btn-tertiary', 'dcf-absolute', 'dcf-pin-top', 'dcf-pin-right', 'dcf-z-1');
      }

      // Check modal content for any additional classes
      if (modalContent.classList.length === 1 && modalContent.classList.contains('dcf-modal-content')) {
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

return Modal;
}));
