'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

;(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['./dcf-uuidGen'], factory);
  } else if ((typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object') {
    module.exports = factory(require('./dcf-uuidGen'));
  } else {
    root.dcfModal = factory(root.dcfHelperUuidv4);
  }
})(undefined, function (uuidv4) {
  var bodyScrollLock = require('body-scroll-lock');
  var disableBodyScroll = bodyScrollLock.disableBodyScroll;
  var enableBodyScroll = bodyScrollLock.enableBodyScroll;

  var Modal = function () {
    /**
     * class constructor
     * @param {modals} modals of selected modals
     */
    function Modal(modals) {
      _classCallCheck(this, Modal);

      this.modals = modals;
    }

    /**
     * Prepend modals to body so that elements outside of modal can be made inert
     * @param {string} el: the element that we are targetting
     */


    _createClass(Modal, [{
      key: 'prependBody',
      value: function prependBody(el) {
        var body = document.querySelector('body');
        var firstChild = body.firstElementChild;
        body.insertBefore(el, firstChild);
      }

      // Open modal

    }, {
      key: 'openModal',
      value: function openModal(modalId, openBtnId) {

        var body = document.querySelector('body');
        var skipNav = document.getElementById('dcf-skip-nav');
        var header = document.getElementById('dcf-header');
        var main = document.getElementById('dcf-main');
        var footer = document.getElementById('dcf-footer');
        var nonModals = [skipNav, header, main, footer];

        for (var i = 0; i < this.modals.length; i++) {
          var modal = this.modals[i];
          if (modal.getAttribute('id') !== modalId) {
            this.closeModal(modal.getAttribute('id'));
          }
        }

        var thisModal = document.getElementById(modalId);
        var modalOpen = thisModal.getAttribute('aria-hidden') === 'false' ? true : false;

        if (openBtnId) {
          this.currentBtn = openBtnId;
        }

        this.currentModal = modalId;

        // Don't open modal if it's already open
        if (modalOpen) {
          return;
        }

        // Set elements outside of modal to be inert and hidden from screen readers
        nonModals.forEach(function (el, array) {
          el.setAttribute('aria-hidden', 'true');
          el.setAttribute('inert', '');
        });

        // Prevent body from scrolling
        disableBodyScroll(thisModal);

        // Add `.dcf-modal-is-open` helper class to body
        body.classList.add('dcf-modal-is-open');

        // Set attribute for this modal
        thisModal.setAttribute('aria-hidden', 'false');

        // Add/remove classes to this modal
        thisModal.classList.remove('dcf-opacity-0', 'dcf-pointer-events-none', 'dcf-invisible');
        thisModal.classList.add('dcf-opacity-100', 'dcf-pointer-events-auto');

        var keycodeTab = 9;
        var tabFocusEls = thisModal.querySelectorAll('button:not([hidden]):not([disabled]), [href]:not([hidden]), input:not([hidden]):' + 'not([type="hidden"]):not([disabled]), select:not([hidden]):not([disabled]), text' + 'area:not([hidden]):not([disabled]), [tabindex="0"]:not([hidden]):not([disabled])' + ', summary:not([hidden]), [contenteditable]:not([hidden]), audio[controls]:not([h' + 'idden]), video[controls]:not([hidden])');
        var firstTabFocusEl = tabFocusEls[0];
        var lastTabFocusEl = tabFocusEls[tabFocusEls.length - 1];

        // Send focus to the first focusable element in the modal content
        firstTabFocusEl.focus();

        // Trap focus inside the modal content
        thisModal.addEventListener('keydown', function (e) {

          var isTabPressed = e.key === 'Tab' || e.keyCode === keycodeTab;

          if (!isTabPressed) {
            return;
          }

          if (e.key === 'Tab' || e.keyCode === keycodeTab) {
            if (e.shiftKey) {
              // Tab backwards (shift + tab)
              if (document.activeElement === firstTabFocusEl) {
                e.preventDefault();
                lastTabFocusEl.focus();
              }
            } else {
              // Tab forwards
              if (document.activeElement === lastTabFocusEl) {
                e.preventDefault();
                firstTabFocusEl.focus();
              }
            }
          }
        });
      }

      // Close modal

    }, {
      key: 'closeModal',
      value: function closeModal(modalId) {

        var body = document.querySelector('body');
        var skipNav = document.getElementById('dcf-skip-nav');
        var header = document.getElementById('dcf-header');
        var main = document.getElementById('dcf-main');
        var footer = document.getElementById('dcf-footer');
        var nonModals = [skipNav, header, main, footer];
        var thisModal = document.getElementById(modalId);
        var modalClosed = thisModal.getAttribute('aria-hidden') === 'true' ? true : false;
        this.currentModal = null;

        // Don't close modal if it's already closed
        if (modalClosed) {
          return;
        }

        // Remove `.dcf-modal-is-open` helper class from body
        body.classList.remove('dcf-modal-is-open');

        // Restore visibility andd functionality to elements outside of modal
        nonModals.forEach(function (el, array) {
          el.setAttribute('aria-hidden', 'false');
          el.removeAttribute('inert');
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
        enableBodyScroll(thisModal);
      }
    }, {
      key: 'btnOpenListen',
      value: function btnOpenListen(btnOpenModal, modalId, btnId) {
        var modalInstance = this;

        // Listen for when 'open modal' button is pressed
        btnOpenModal.addEventListener('click', function () {

          // Open modal when button is pressed
          modalInstance.openModal(modalId, btnId);
        }, false);
      }
    }, {
      key: 'btnCloseListen',
      value: function btnCloseListen(btnCloseModal, modal) {
        var modalInstance = this;

        // Listen for when 'close modal' button is pressed
        btnCloseModal.addEventListener('click', function () {

          // Open modal when button is pressed
          modalInstance.closeModal(modal.getAttribute('id'));
        }, false);
      }
    }, {
      key: 'overlayListen',
      value: function overlayListen(modal, modalWrapper) {
        var modalInstance = this;

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
    }, {
      key: 'escListen',
      value: function escListen() {
        var modalInstance = this;

        // Listen for when 'esc' key is pressed
        document.addEventListener('keydown', function (event) {

          // Close the currently open modal when 'esc' key is pressed
          if (event.which === 27 && modalInstance.currentModal) {
            event.preventDefault();
            modalInstance.closeModal(modalInstance.currentModal);
          }
        });
      }
    }, {
      key: 'initialize',
      value: function initialize() {
        if (!this.modals) {
          return;
        }

        // Define constants used in modal component
        var body = document.querySelector('body');
        var btnsOpenModal = document.querySelectorAll('.dcf-btn-open-modal');
        var btnsCloseModal = document.querySelectorAll('.dcf-btn-close-modal');
        var modalsWrapper = document.querySelectorAll('.dcf-modal-wrapper');
        var modalsContent = document.querySelectorAll('.dcf-modal-content');
        var modalsHeader = document.querySelectorAll('.dcf-modal-header');

        var currentBtn = null;
        var currentModal = null;

        // Loop through all buttons that open modals
        for (var i = 0; i < btnsOpenModal.length; i++) {
          var btnOpenModal = btnsOpenModal[i];
          var modalId = btnOpenModal.getAttribute('data-opens-modal');

          // Generate unique ID for each 'open modal' button
          var btnId = uuidv4();
          btnOpenModal.setAttribute('id', btnId);

          // Buttons are disabled by default until JavaScript has loaded.
          // Remove the 'disabled' attribute to make them functional.
          btnOpenModal.removeAttribute('disabled');
          this.btnOpenListen(btnOpenModal, modalId, btnId);
        }

        // Loop through all modals
        for (var _i = 0; _i < this.modals.length; _i++) {
          var modal = this.modals[_i];
          var modalWrapper = modalsWrapper[_i];
          var modalContent = modalsContent[_i];
          var modalHeader = modalsHeader[_i];
          var btnCloseModal = btnsCloseModal[_i];
          var _modalId = modal.id;
          var modalHeadingId = _modalId + '-heading';

          // Get all headings in each modal header
          var modalHeadings = modalHeader.querySelectorAll('h1, h2, h3, h4, h5, h6');

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
    }]);

    return Modal;
  }();

  return Modal;
});