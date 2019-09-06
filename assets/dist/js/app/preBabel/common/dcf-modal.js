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
  prependBody(el) {
    const body = document.querySelector('body');
    const firstChild = body.firstElementChild;
    body.insertBefore(el, firstChild);
  }

  // Open modal
  openModal(modalId, openBtnId) {

    const body = document.querySelector('body');
    const skipNav = document.getElementById('dcf-skip-nav');
    const header = document.getElementById('dcf-header');
    const main = document.getElementById('dcf-main');
    const footer = document.getElementById('dcf-footer');
    const nonModals = [ skipNav, header, main, footer ];

    for (let i = 0; i < this.modals.length; i++) {
      const modal = this.modals[i];
      if (modal.getAttribute('id') !== modalId) {
        this.closeModal(modal.getAttribute('id'));
      }
    }

    const thisModal = document.getElementById(modalId);
    let modalOpen = thisModal.getAttribute('aria-hidden') === 'false' ? true : false;

    if (openBtnId) {
      this.currentBtn = openBtnId;
    }

    this.currentModal = modalId;

    // Don't open modal if it's already open
    if (modalOpen) {
      return;
    }

    // Set elements outside of modal to be inert and hidden from screen readers
    nonModals.forEach(function(el, array) {
      el.setAttribute('aria-hidden','true');
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

    const keycodeTab = 9;
    const tabFocusEls = thisModal.querySelectorAll('button:not([hidden]):not([disabled]), [href]:not([hidden]), input:not([hidden]):' +
            'not([type="hidden"]):not([disabled]), select:not([hidden]):not([disabled]), text' +
            'area:not([hidden]):not([disabled]), [tabindex="0"]:not([hidden]):not([disabled])' +
            ', summary:not([hidden]), [contenteditable]:not([hidden]), audio[controls]:not([h' +
            'idden]), video[controls]:not([hidden])');
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
  }

  // Close modal
  closeModal(modalId) {

    const body = document.querySelector('body');
    const skipNav = document.getElementById('dcf-skip-nav');
    const header = document.getElementById('dcf-header');
    const main = document.getElementById('dcf-main');
    const footer = document.getElementById('dcf-footer');
    const nonModals = [skipNav, header, main, footer];
    const thisModal = document.getElementById(modalId);
    let modalClosed = thisModal.getAttribute('aria-hidden') === 'true' ? true : false;
    this.currentModal = null;

    // Don't close modal if it's already closed
    if (modalClosed) {
      return;
    }

    // Remove `.dcf-modal-is-open` helper class from body
    body.classList.remove('dcf-modal-is-open');

    // Restore visibility andd functionality to elements outside of modal
    nonModals.forEach(function(el, array) {
      el.setAttribute('aria-hidden','false');
    });

    // Set attribute for this modal
    thisModal.setAttribute('aria-hidden', 'true');

    // Add/remove classes to this modal
    thisModal.classList.remove('dcf-opacity-100', 'dcf-pointer-events-auto');
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
  }

  btnOpenListen(btnOpenModal, modalId, btnId) {
    let modalInstance = this;

    // Listen for when 'open modal' button is pressed
    btnOpenModal.addEventListener('click', function () {

      // Open modal when button is pressed
      modalInstance.openModal(modalId, btnId);
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
    const btnsOpenModal = document.querySelectorAll('.dcf-btn-open-modal');
    const btnsCloseModal = document.querySelectorAll('.dcf-btn-close-modal');
    const modalsWrapper = document.querySelectorAll('.dcf-modal-wrapper');
    const modalsContent = document.querySelectorAll('.dcf-modal-content');
    const modalsHeader = document.querySelectorAll('.dcf-modal-header');

    let currentBtn = null;
    let currentModal = null;

    // Loop through all buttons that open modals
    for (let i = 0; i < btnsOpenModal.length; i++) {
      const btnOpenModal = btnsOpenModal[i];
      const modalId = btnOpenModal.getAttribute('data-opens-modal');

      // Generate unique ID for each 'open modal' button
      const btnId = this.generateUUID();
      btnOpenModal.setAttribute('id', btnId);

      // Buttons are disabled by default until JavaScript has loaded.
      // Remove the 'disabled' attribute to make them functional.
      btnOpenModal.removeAttribute('disabled');
      this.btnOpenListen(btnOpenModal, modalId, btnId);
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

      // Prepend modals to body so that elements outside of modal can be made inert when modal is open
      this.prependBody(modal);

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
        modalWrapper.classList.add('dcf-h-auto', 'dcf-overflow-y-auto');
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
