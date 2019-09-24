(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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
    root.dcfLazyLoad = factory();
  }
})(undefined, function () {
  var LazyLoad = function () {
    /**
     * class constructor
     * @param {imagesList} nodelist of selected images
     * @param {observerConfig} object of intersectionObserver configuration
     * @param {classNames} array of classes applied
     */
    function LazyLoad(imagesList, observerConfig, classNames) {
      var _this = this;

      _classCallCheck(this, LazyLoad);

      this.onIntersection = function (entries, observer) {

        // Disconnect if we've already loaded all of the images
        if (_this.imageCount === 0) {
          _this.observer.disconnect();
        }

        // Loop through the entries
        for (var i = 0; i < entries.length; i++) {
          var entry = entries[i];

          // Are we in viewport?
          // console.log(entry.intersectionRatio);

          if (entry.intersectionRatio > observer.thresholds[0] && entry.intersectionRatio < observer.thresholds[1]) {
            _this.preloadImage(entry.target);
          } else if (entry.intersectionRatio > observer.thresholds[1]) {
            _this.imageCount--;
            _this.applyImage(entry.target);
            _this.observer.unobserve(entry.target);
          }
        }
      };

      this.imagesList = imagesList;
      this.observerConfig = observerConfig;
      this.classNames = classNames; // add onEnter, onEnterActive?
    }

    _createClass(LazyLoad, [{
      key: 'pxTOvw',
      value: function pxTOvw(value) {
        var w = window,
            d = document,
            e = d.documentElement,
            g = d.getElementsByTagName('body')[0],
            x = w.innerWidth || e.clientWidth || g.clientWidth;

        var result = 100 * value / x;
        return result + 'vw';
      }
    }, {
      key: 'applyImage',


      /**
       * Apply the image: preloaded image is loaded but not applied to actual image element
       * @param {string} image: the image element that we are targetting
       */
      value: function applyImage(image) {
        var src = image.dataset.src;
        var srcset = image.dataset.srcset || null;
        var sizes = image.dataset.sizes || this.pxTOvw(image.parentElement.clientWidth);

        if (!src) {
          return;
          //throw new Error('No image src attribute provided');
        }

        // Prevent this from being lazy loaded a second time.
        image.classList.add('dcf-lazy-loaded');
        src && (image.src = src);
        src && image.removeAttribute('data-src');
        srcset && (image.srcset = srcset);
        srcset && image.removeAttribute('data-srcset');
        sizes && (image.sizes = sizes);
        sizes && image.removeAttribute('data-sizes');
        this.classNames.length && this.classNames.forEach(function (className) {
          return image.classList.add(className);
        });
      }
    }, {
      key: 'fetchImage',


      /**
       * Fetches the image for the given source
       * @param {string} src
       * @param {string} srcset, defaults to null if not provided
       */
      value: function fetchImage(src) {
        var srcset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
        var sizes = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

        return new Promise(function (resolve, reject) {
          var image = new Image();
          src && (image.src = src);
          srcset && (image.srcset = srcset);
          sizes && (image.sizes = sizes);

          image.onload = resolve;
          image.onerror = reject;
        });
      }

      /**
       * Preloads the image
       * @param {object} image
       */

    }, {
      key: 'preloadImage',
      value: function preloadImage(image) {
        var src = image.dataset.src;
        var srcset = image.dataset.srcset;
        var sizes = image.dataset.sizes || null;

        if (!src) {
          return;
          //throw new Error('No image src attribute provided');
        }

        return this.fetchImage(src, srcset, sizes).catch(function (err) {
          return 'Image failed to fetch ' + err.mes;
        });
      }
    }, {
      key: 'loadImagesImmediately',


      /**
       * Load all of the images immediately
       * @param {NodeListOf<Element>} preload
       * @param {boolean} images
       */
      value: function loadImagesImmediately(images) {
        var preload = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

        // foreach() is not supported in IE
        for (var i = 0; i < images.length; i++) {
          var image = images[i];
          if (preload === true) {
            this.preloadImage(image);
          }
          this.applyImage(image);
        }
      }

      /**
       * Disconnect the observer
       */

    }, {
      key: 'disconnect',
      value: function disconnect() {
        if (!this.observer) {
          return;
        }

        this.observer.disconnect();
      }

      /**
       * On intersection
       * @param {array} intersection entries
       * @param {object} intersection observer
       */

    }, {
      key: 'initialize',
      value: function initialize() {
        if (!this.imagesList) return;

        // counter: keeps track of which images that hasn't been loaded
        this.imageCount = this.imagesList.length;

        if ('loading' in HTMLImageElement.prototype) {
          // Native lazy loading IS supported, so set src-data to src
          this.loadImagesImmediately(this.imagesList, false);
        } else {
          // Native lazy loading NOT supported, so handle via javascript
          // If browser doesn't support intersection observer, load the images immediately
          if (!('IntersectionObserver' in window)) {
            this.loadImagesImmediately(this.imagesList);
          } else {
            // It is supported, load the images
            this.observer = new IntersectionObserver(this.onIntersection, this.observerConfig);

            // foreach() is not supported in IE
            for (var i = 0; i < this.imageCount; i++) {
              var image = this.imagesList[i];
              if (image.classList.contains('dcf-lazy-loaded')) {
                continue;
              }

              this.observer.observe(image);
            }
          }
        }
      }
    }]);

    return LazyLoad;
  }();

  return LazyLoad;
});

},{}],2:[function(require,module,exports){
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
  var Modal = function () {
    /**
     * class constructor
     * @param {modals} modals of selected modals
     */
    function Modal(modals, bodyScrollLock) {
      _classCallCheck(this, Modal);

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


    _createClass(Modal, [{
      key: 'appendToBody',
      value: function appendToBody(el) {
        var body = document.querySelector('body');
        body.appendChild(el);
      }

      // Toggle modal

    }, {
      key: 'toggleModal',
      value: function toggleModal(modalId, btnId) {
        var thisModal = document.getElementById(modalId);
        var modalOpen = thisModal.getAttribute('aria-hidden') === 'false' ? true : false;

        if (modalOpen) {
          // modal open so close it
          this.closeModal(modalId, btnId);
        } else {
          // modal closed so open it
          this.openModal(modalId, btnId);
        }
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

        var modalWithNavToggleGroup = false;
        if (openBtnId) {
          this.currentBtn = openBtnId;
          var openBtn = document.getElementById(openBtnId);
          modalWithNavToggleGroup = openBtn && openBtn.getAttribute('data-modal-behind-nav-toggle-group') === 'true';
        }

        this.currentModal = modalId;

        // Don't open modal if it's already open
        if (modalOpen) {
          return;
        }

        // Set elements outside of modal to be inert and hidden from screen readers
        nonModals.forEach(function (el, array) {
          el.setAttribute('aria-hidden', 'true');
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
          thisModal.classList.add('dcf-z-modal-behind-nav-toggle-group');
        } else {
          thisModal.classList.add('dcf-z-modal-fullscreen');
        }

        var keycodeTab = 9;
        var tabFocusEls = thisModal.querySelectorAll('button:not([hidden]):not([disabled]), ' + '[href]:not([hidden]), input:not([hidden]):not([type="hidden"]):not([disabled]), ' + 'select:not([hidden]):not([disabled]), textarea:not([hidden]):not([disabled]), ' + '[tabindex="0"]:not([hidden]):not([disabled]), summary:not([hidden]), ' + '[contenteditable]:not([hidden]), audio[controls]:not([hidden]), ' + 'video[controls]:not([hidden])');
        var firstTabFocusEl = tabFocusEls[0];
        var lastTabFocusEl = tabFocusEls[tabFocusEls.length - 1];

        // Send focus to the modal
        thisModal.focus();

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

        // Restore visibility and functionality to elements outside of modal
        nonModals.forEach(function (el, array) {
          el.setAttribute('aria-hidden', 'false');
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
          if (thisModal.classList.contains('dcf-z-modal-fullscreen')) {
            thisModal.classList.remove('dcf-z-modal-fullscreen');
          }
          if (thisModal.classList.contains('dcf-z-modal-behind-nav-toggle-group')) {
            thisModal.classList.remove('dcf-z-modal-behind-nav-toggle-group');
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
    }, {
      key: 'btnToggleListen',
      value: function btnToggleListen(btnToggleModal, modalId, btnId) {
        var modalInstance = this;

        // Listen for when 'open modal' button is pressed
        btnToggleModal.addEventListener('click', function () {
          // Toggle modal when button is pressed
          modalInstance.toggleModal(modalId, btnId);
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
      key: 'generateUUID',
      value: function generateUUID() {
        var d = new Date().getTime();
        var d2 = performance && performance.now && performance.now() * 1000 || 0;
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
          var r = Math.random() * 16;
          if (d > 0) {
            r = (d + r) % 16 | 0;
            d = Math.floor(d / 16);
          } else {
            r = (d2 + r) % 16 | 0;
            d2 = Math.floor(d2 / 16);
          }
          return (c === 'x' ? r : r & 0x3 | 0x8).toString(16);
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
        var btnsToggleModal = document.querySelectorAll('.dcf-btn-toggle-modal');
        var btnsCloseModal = document.querySelectorAll('.dcf-btn-close-modal');
        var modalsWrapper = document.querySelectorAll('.dcf-modal-wrapper');
        var modalsContent = document.querySelectorAll('.dcf-modal-content');
        var modalsHeader = document.querySelectorAll('.dcf-modal-header');

        var currentBtn = null;
        var currentModal = null;

        // Loop through all buttons that open modals
        for (var i = 0; i < btnsToggleModal.length; i++) {
          var btnToggleModal = btnsToggleModal[i];
          var modalId = btnToggleModal.getAttribute('data-toggles-modal');

          // Generate unique ID for each 'open modal' button
          var btnId = this.generateUUID();
          btnToggleModal.setAttribute('id', btnId);

          // Buttons are disabled by default until JavaScript has loaded.
          // Remove the 'disabled' attribute to make them functional.
          btnToggleModal.removeAttribute('disabled');
          this.btnToggleListen(btnToggleModal, modalId, btnId);
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
    }]);

    return Modal;
  }();

  return Modal;
});

},{"./dcf-uuidGen":3}],3:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

;(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if ((typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object') {
    module.exports = factory();
  } else {
    root.dcfHelperUuidv4 = factory();
  }
})(undefined, function () {
  function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0,
          v = c === 'x' ? r : r & 0x3 | 0x8;
      return v.toString(16);
    });
  }

  return uuidv4;
});

},{}],4:[function(require,module,exports){
!function(e,t){if("function"==typeof define&&define.amd)define(["exports"],t);else if("undefined"!=typeof exports)t(exports);else{var o={};t(o),e.bodyScrollLock=o}}(this,function(exports){"use strict";function r(e){if(Array.isArray(e)){for(var t=0,o=Array(e.length);t<e.length;t++)o[t]=e[t];return o}return Array.from(e)}Object.defineProperty(exports,"__esModule",{value:!0});var l=!1;if("undefined"!=typeof window){var e={get passive(){l=!0}};window.addEventListener("testPassive",null,e),window.removeEventListener("testPassive",null,e)}var d="undefined"!=typeof window&&window.navigator&&window.navigator.platform&&/iP(ad|hone|od)/.test(window.navigator.platform),c=[],u=!1,a=-1,s=void 0,v=void 0,f=function(t){return c.some(function(e){return!(!e.options.allowTouchMove||!e.options.allowTouchMove(t))})},m=function(e){var t=e||window.event;return!!f(t.target)||(1<t.touches.length||(t.preventDefault&&t.preventDefault(),!1))},o=function(){setTimeout(function(){void 0!==v&&(document.body.style.paddingRight=v,v=void 0),void 0!==s&&(document.body.style.overflow=s,s=void 0)})};exports.disableBodyScroll=function(i,e){if(d){if(!i)return void console.error("disableBodyScroll unsuccessful - targetElement must be provided when calling disableBodyScroll on IOS devices.");if(i&&!c.some(function(e){return e.targetElement===i})){var t={targetElement:i,options:e||{}};c=[].concat(r(c),[t]),i.ontouchstart=function(e){1===e.targetTouches.length&&(a=e.targetTouches[0].clientY)},i.ontouchmove=function(e){var t,o,n,r;1===e.targetTouches.length&&(o=i,r=(t=e).targetTouches[0].clientY-a,!f(t.target)&&(o&&0===o.scrollTop&&0<r?m(t):(n=o)&&n.scrollHeight-n.scrollTop<=n.clientHeight&&r<0?m(t):t.stopPropagation()))},u||(document.addEventListener("touchmove",m,l?{passive:!1}:void 0),u=!0)}}else{n=e,setTimeout(function(){if(void 0===v){var e=!!n&&!0===n.reserveScrollBarGap,t=window.innerWidth-document.documentElement.clientWidth;e&&0<t&&(v=document.body.style.paddingRight,document.body.style.paddingRight=t+"px")}void 0===s&&(s=document.body.style.overflow,document.body.style.overflow="hidden")});var o={targetElement:i,options:e||{}};c=[].concat(r(c),[o])}var n},exports.clearAllBodyScrollLocks=function(){d?(c.forEach(function(e){e.targetElement.ontouchstart=null,e.targetElement.ontouchmove=null}),u&&(document.removeEventListener("touchmove",m,l?{passive:!1}:void 0),u=!1),c=[],a=-1):(o(),c=[])},exports.enableBodyScroll=function(t){if(d){if(!t)return void console.error("enableBodyScroll unsuccessful - targetElement must be provided when calling enableBodyScroll on IOS devices.");t.ontouchstart=null,t.ontouchmove=null,c=c.filter(function(e){return e.targetElement!==t}),u&&0===c.length&&(document.removeEventListener("touchmove",m,l?{passive:!1}:void 0),u=!1)}else(c=c.filter(function(e){return e.targetElement!==t})).length||o()}});

},{}],5:[function(require,module,exports){
'use strict';

// Lazy Load
var LazyLoad = require('dcf-lazyLoad');
var images = document.querySelectorAll('[loading=lazy], .dcf-lazy-load');
var observerConfig = {
	// Extend intersection root margin by 50px to start intersection earlier by 50px
	rootMargin: '0px 0px 50px 0px',
	threshold: [0, 0.40]
};
var enterClassNames = ['dcf-fade-in'];
var exampleLazyLoad = new LazyLoad(images, observerConfig, enterClassNames);
exampleLazyLoad.initialize();

// Modal
var Modal = require('dcf-modal');
var modals = document.querySelectorAll('.dcf-modal');
var bodyScrollLock = require('body-scroll-lock');
var exampleModal = new Modal(modals, bodyScrollLock);
exampleModal.initialize();

// Notice
// let Notice = require('dcf-notice');
// const noticeOptions = {
// 	widget: 'notice',
// 	'notice-type': 'alert',
// 	animation: 'true',
// 	location: 'fixedBottom',
// 	collapsible: 'true',
// 	id: 'dynamicNotice1'
// };
//
// Notice.create('Spaghetti Monster Lives', 'You know no spaghetti', noticeOptions);


// Date Picker
// let flatpickr = require('flatpickr/flatpickr');
// require("flatpickr/flatpickr.css");
// let datepicker = document.querySelector('[data-widget*="flatpickr"]');
// flatpickr(datepicker, {
// 	enableTime: true,
// 	dateFormat: "Y-m-d h:iK",
// });

},{"body-scroll-lock":4,"dcf-lazyLoad":1,"dcf-modal":2}]},{},[5])

//# sourceMappingURL=bundle.js.map
