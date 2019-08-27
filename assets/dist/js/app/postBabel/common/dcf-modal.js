'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

;(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if ((typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object') {
    module.exports = factory();
  } else {
    root.dcfModal = factory();
  }
})(undefined, function () {
  var Modal = function () {

    /**
     * class constructor
     * @param {modals} modals of selected modals
     */
    function Modal(modals) {
      _classCallCheck(this, Modal);

      //     this.thebody = body;
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

      // Transition modal on close
      //   modalTransition(event, modal) {
      //     const thisModal = this;
      //
      //     // Remove the event listener after the modal transition has completed
      //     thisModal.removeEventListener('transitionend', modalTransition);
      //
      //     // Add the `.dcf-invisible` class to this modal after the transition
      //     if (!thisModal.classList.contains('dcf-invisible')) {
      //       thisModal.classList.add('dcf-invisible');
      //     }
      //   }

      // Open modal

    }, {
      key: 'openModal',
      value: function openModal(modalId, openBtnId) {

        var body = document.querySelector('body');

        for (var i = 0; i < this.modals.length; i++) {
          var modal = this.modals[i];

          if (modal.getAttribute('id') !== modalId) {
            this.closeModal(modal.getAttribute('id'));
          }
        }

        var thisModal = document.getElementById(modalId);
        var modalOpen = thisModal.getAttribute('aria-hidden') === 'false' ? true : false;

        if (openBtnId) {
          currentBtn = openBtnId;
        }

        currentModal = modalId;

        // Don't open modal if it's already open
        if (modalOpen) {
          return;
        }

        // Set elements outside of modal to be inert and hidden from screen readers
        nonModals.forEach(function (el, array) {
          el.setAttribute('aria-hidden', 'true');
          el.setAttribute('inert', '');
          // TODO: Configure inert polyfill
        });

        //   	Prevent body from scrolling
        //   	disableBodyScroll(thisModal);

        // Add `.dcf-modal-is-open` helper class to body
        body.classList.add('dcf-modal-is-open');

        // Set attribute for this modal
        thisModal.setAttribute('aria-hidden', 'false');

        // Add/remove classes to this modal
        thisModal.classList.remove('dcf-opacity-0', 'dcf-pointer-events-none', 'dcf-invisible');
        thisModal.classList.add('dcf-opacity-100', 'dcf-pointer-events-auto');

        // Send focus to modal content
        thisModal.focus();

        // TODO: Trap focus inside the modal content
      }

      // Close modal

    }, {
      key: 'closeModal',
      value: function closeModal(modalId) {

        var body = document.querySelector('body');
        var thisModal = document.getElementById(modalId);

        var modalClosed = thisModal.getAttribute('aria-hidden') === 'true' ? true : false;

        currentModal = null;

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

        // Add event listener for the end of the modal transition
        //     thisModal.addEventListener('transitionend', modalTransition);

        // Send focus back to button that opened modal
        if (currentBtn) {
          document.getElementById(currentBtn).focus();
        }

        // TODO: Allow body to scroll
      }
    }, {
      key: 'btnOpenListen',
      value: function btnOpenListen(btnOpenModal, modalId, btnId) {

        // TODO: account for multiple buttons able to open a single modal (e.g., search)
        // Listen for when 'open modal' button is pressed
        btnOpenModal.addEventListener('click', function () {
          // Open modal when button is pressed
          this.openModal(modalId, btnId);
        }, false);
      }
    }, {
      key: 'btnCloseListen',
      value: function btnCloseListen(btnCloseModal, modal) {

        // Listen for when 'close modal' button is pressed
        btnCloseModal.addEventListener('click', function () {
          // Open modal when button is pressed
          this.closeModal(modal.getAttribute('id'));
        }, false);
      }
    }, {
      key: 'overlayListen',
      value: function overlayListen(modal, modalContent) {

        // Listen for clicks on the open modal
        modal.addEventListener('click', function (event) {

          // If the click is in modal content, leave the modal open
          if (modalContent.contains(event.target)) {
            return;
          }

          // If the click is outside the modal content (on the modal overlay), close the modal
          this.closeModal(modal.getAttribute('id'));
        });
      }

      // Listen for when 'esc' key is pressed
      //   document.addEventListener('keydown', function (event) {
      //
      //     // Close the currently open modal when 'esc' key is pressed
      //     if (event.which === 27 && currentModal) {
      //       event.preventDefault();
      //       closeModal(currentModal);
      //     }
      //   }, false);


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
        var modalsContent = document.querySelectorAll('.dcf-modal-content');
        var skipNav = document.getElementById('dcf-skip-nav');
        var header = document.getElementById('dcf-header');
        var main = document.getElementById('dcf-main');
        var footer = document.getElementById('dcf-footer');
        var nonModals = [skipNav, header, main, footer];

        var currentBtn = null;
        var currentModal = null;

        // Loop through all buttons that open modals
        for (var i = 0; i < btnsOpenModal.length; i++) {
          var btnOpenModal = btnsOpenModal[i];
          var modalId = btnOpenModal.getAttribute('data-opens-modal');
          var btnId = 'dcf-btn-opens-' + modalId;
          btnOpenModal.setAttribute('id', btnId);

          // Buttons are disabled by default until JavaScript has loaded.
          // Remove the 'disabled' attribute to make them functional.
          btnOpenModal.removeAttribute('disabled');

          this.btnOpenListen(btnOpenModal, modalId, btnId);
        }

        // Loop through all modals
        for (var _i = 0; _i < this.modals.length; _i++) {
          var modal = this.modals[_i];
          var modalContent = modalsContent[_i];
          var btnCloseModal = btnsCloseModal[_i];
          var _modalId = modal.id;
          var modalHeadingId = _modalId + '-heading';

          // Get all headings in each modal
          var modalHeadings = modalContent.querySelectorAll('h1, h2, h3, h4, h5, h6');

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

          // Add classes to each modal
          modal.classList.add('dcf-fixed', 'dcf-pin-top', 'dcf-pin-left', 'dcf-h-100%', 'dcf-w-100%', 'dcf-d-flex', 'dcf-ai-center', 'dcf-jc-center', 'dcf-invisible');

          // Set attribute for modal content
          modalContent.setAttribute('role', 'document');

          // Add classes to modal content
          // TODO: add these classes only if no custom classes are present in the markup
          modalContent.classList.add('dcf-relative', 'dcf-wrapper', 'dcf-pt-7', 'dcf-pb-7');

          // Add classes and attributes to each 'close' button
          // TODO: add these classes only if no custom classes are present in the markup
          btnCloseModal.classList.add('dcf-absolute', 'dcf-pin-top', 'dcf-pin-right', 'dcf-z-1');

          // Set attributes for each 'close' button
          btnCloseModal.setAttribute('type', 'button');
          btnCloseModal.setAttribute('aria-label', 'Close');

          this.overlayListen(modal, modalContent);

          this.btnCloseListen(btnCloseModal, modal);
        }
      }
    }]);

    return Modal;
  }();

  return Modal;
});