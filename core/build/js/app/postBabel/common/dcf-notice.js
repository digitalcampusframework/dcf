'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

;(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['./dcf-uuidGen'], factory);
  } else if ((typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object') {
    module.exports = factory(require('./dcf-uuidGen'));
  } else {
    root.dcfWidgetNotice = factory(root.dcfHelperUuidv4);
  }
})(undefined, function (uuidv4) {
  // uuid-gen dependency defined in gruntfile UMD task and passed in as uuidv4
  // TODO change this to use Class instead

  var Notice = {};
  var notices = document.querySelectorAll('[data-widget="notice"]');
  var fixedBottomExists = document.querySelector('[id*="unl-widget-fixedBottom-"]') ? true : false; // flag for checking if a fixedBottom notice has been previously added to the page set flag to true

  notices = [].slice.call(notices);

  // standard classes based on what kind of notice, keep it to DCF classes for now
  var noticeClasses = {
    notify: ['dcf-notice', 'unl-notice-notify'],
    success: ['dcf-notice', 'unl-notice-success'],
    alert: ['dcf-notice', 'unl-notice--alert'],
    fatal: ['dcf-notice', 'unl-notice--fatal']
  };

  var noticeLocationClasses = {
    current: ['uno'],
    nav: ['foo'],
    fixedBottom: ['bar', 'dcf-fixed', 'dcf-notice-fixedBottom', 'dcf-pin-bottom', 'dcf-pin-right', 'dcf-pin-left'],
    fixedBottomLeft: ['zoink'] // TODO add option that goes 50% width on desktop when fixedBottom
  };

  // default animations depending on associated locations
  // fixedBottom associated with slideUp animation. Everything else uses slideInScroll
  var noticeAnimationClasses = {
    slideInScroll: ['baz'],
    slideUp: ['car']
  };

  var closeButtonClasses = ['dcf-absolute', 'dcf-pin-top', 'dcf-pin-right', 'dcf-mt-3', 'dcf-mr-3', 'dcf-btn', 'dcf-btn-tertiary', 'js-notice-toggle'];

  /**
   * Functions
   */

  /**
   * @purpose - move element to be the first child of main
   * @param el - the element to be moved
   */
  function prependMain(el) {
    var main = document.querySelector('main');
    var firstChild = main.firstElementChild;
    main.insertBefore(el, firstChild);
  }

  /**
   * @purpose - permanently closes the notice element
   * @param notice - notice to be closed
   *
   */
  function closeNotice(notice) {

    function hideNotice(e) {
      if (e.propertyName !== "max-height") return;
      notice.classList.add('dcf-d-none');
      notice.removeEventListener('transitionend', hideNotice);
      document.querySelector('main').focus(); // sending focus back to main
    }

    notice.addEventListener('transitionend', hideNotice);
    notice.classList.add('dcf-notice-fixedBottom--close');

    localStorage.setItem(notice.id, 'closed');
  }

  /**
   * @purpose - collapse message when collapse button is selected
   * @param el - notice to be closed
   * @param closeButton - the close button associated with this notice
   * @param title - title of notice
   * @param message - message of notice
   */
  function collapseExpandMessage(el, closeButton, title, message) {
    // Find out if notice is expanded
    var expanded = closeButton.getAttribute('aria-expanded') === "true" ? true : false;

    if (expanded) {
      // if expanded, collapse message
      closeButton.innerText = "Expand";
      title.classList.add('dcf-notice-title-collapse');
      message.classList.add('dcf-notice-message-collapse');
      if (el.id) localStorage.setItem(el.id, 'collapsed');
    } else {
      // if collapse, expand message
      closeButton.innerText = "Collapse";
      message.classList.remove('dcf-notice-message-collapse');
      title.classList.remove('dcf-notice-title-collapse');
      if (el.id) localStorage.setItem(el.id, 'expanded');
    }

    // Invert to get new state
    expanded = new Boolean(!expanded);

    //Apply new state to notice
    closeButton.setAttribute('aria-expanded', expanded.toString());
  }

  /**
   * @purpose add a close button to the widget and the associated click events
   * @param el
   * @param isCollapsible
   */
  function addCloseButton(el, isCollapsible) {
    var closeButton = document.createElement('button');
    closeButtonClasses.forEach(function (closeButtonclass) {
      return closeButton.classList.add(closeButtonclass);
    });

    if (isCollapsible) {
      // if notice can be collapsed
      var noticeTitle = el.querySelector('.js-notice-title');
      var noticeMessage = el.querySelector('.js-notice-message');
      var noticeMessageId = noticeMessage.id || uuidv4();

      closeButton.innerText = 'collapse';
      closeButton.setAttribute('aria-expanded', 'true');

      if (!noticeTitle) {
        console.error('Your notice is missing a title.');
        return;
      }

      if (!noticeMessage) {
        console.error('Your notice is missing a message.');
        return;
      }

      noticeTitle.classList.add('dcf-notice-title');

      !noticeMessage.id && (noticeMessage.id = noticeMessageId); //if no id is provided use the generated id
      closeButton.setAttribute('aria-controls', noticeMessageId);
      noticeMessage.classList.add('dcf-notice-message');

      closeButton.addEventListener('click', function () {
        collapseExpandMessage(el, closeButton, noticeTitle, noticeMessage);
      });
    } else {
      // else close the notice out completely
      closeButton.innerText = 'close';
      closeButton.addEventListener('click', function () {
        closeNotice(el);
      });
    }

    el.insertBefore(closeButton, el.firstElementChild);
  }

  /**
   * Intersection Observer related code
   */

  // intersection observer - one time drawing variables and functions
  var isDrawn = false;
  var isMobile = false;
  var mobileObserver = void 0,
      desktopObserver = void 0;
  var mq = window.matchMedia("(min-width: 480px)");
  var mobileConfig = {
    /* on mobile given potential line breaks, we won't be able to view the entire notice in its
    entirety at one go so might want to show the notice when close to half of it is shown */
    root: null,
    rootMargin: '0px',
    threshold: 0.65
  };
  var desktopConfig = {
    root: null,
    rootMargin: '0px',
    threshold: 0.8
  };

  function observerCallback(entries, observer) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        if (entry.intersectionRatio > 0 && entry.intersectionRatio >= observer.thresholds[0]) {
          noticeAnimationClasses.slideInScroll.forEach(function (noticeAnimationClass) {
            return entry.target.classList.add(noticeAnimationClass);
          });

          // set isDrawn flag to true after actions have been taken
          isDrawn = true;
          observer.disconnect();
        }
      }
    });
  }

  function onWidthChange(mq) {
    if (isDrawn) return;
    if (mq.matches) {
      //desktop
      isMobile = false;
      createDesktopObserver();

      if (mobileObserver) {
        mobileObserver.disconnect();
      }
    } else {
      //mobile
      isMobile = true;
      createMobileObserver();

      if (desktopObserver) {
        desktopObserver.disconnect();
      }
    }
  }

  function createMobileObserver() {
    notices.forEach(function (notice) {
      mobileObserver = new IntersectionObserver(observerCallback, mobileConfig);
      mobileObserver.observe(notice);
    });
  }

  function createDesktopObserver() {
    notices.forEach(function (notice) {
      desktopObserver = new IntersectionObserver(observerCallback, desktopConfig);
      desktopObserver.observe(notice);
    });
  }

  /**
   * @purpose reusable notice creation and styling code
   * @param notice - the notice element
   */
  function createNotice(notice) {
    if (notice.initialized) return; // exit if the notice has been initialized

    var noticeType = notice.dataset.noticeType;
    var noticeLocation = notice.dataset.location;
    var noticeAnimation = notice.dataset.animation === "true" ? true : false;
    var noticeCollapsible = notice.dataset.collapsible === "true" ? true : false;

    // 1.check notice option type and add the needed classes
    if (noticeClasses[noticeType]) {
      noticeClasses[noticeType].forEach(function (noticeClass) {
        return notice.classList.add(noticeClass);
      });
    } else {
      // default to info notify styling
      noticeClasses.notify.forEach(function (noticeClass) {
        return notice.classList.add(noticeClass);
      });
    }

    // 2.check widget location whether its current, nav, or fixed-bottom and assign class names
    if (noticeLocation === 'fixedBottom') {
      if (!fixedBottomExists) {
        // get provided id and append it with a prefix
        if (notice.id) {
          notice.id = 'dcf-widget-fixedBottom--' + notice.id;
        } else {
          console.info('An id attribute needs to be provided for the fixed to bottom notice to function properly with' + ' localStorage');
        }

        // check to see if data-collapsible is false and exists in storage as closed, hide notice rightaway
        if (!noticeCollapsible && localStorage.getItem(notice.id) === 'closed') {
          notice.classList.add('dcf-d-none');
          return;
        }

        // add assigned classes
        if (noticeLocationClasses[noticeLocation]) {
          noticeLocationClasses[noticeLocation].forEach(function (noticeLocationClass) {
            return notice.classList.add(noticeLocationClass);
          });
        }

        addCloseButton(notice, noticeCollapsible);
        prependMain(notice); // move fixed-bottom notice to the top of source
        fixedBottomExists = true;
      } else {
        console.error('Only one fixed to bottom notice may exist on a page');
      }
    } else {
      // location other than fixedBottom

      if (noticeLocationClasses[noticeLocation]) {
        noticeLocationClasses[noticeLocation].forEach(function (noticeLocationClass) {
          return notice.classList.add(noticeLocationClass);
        });
      } else {
        // set current option as the default notice styling
        noticeLocationClasses.current.forEach(function (noticeLocationClass) {
          return notice.classList.add(noticeLocationClass);
        });
      }

      // 2.1 if its nav, move the element to after the nav and before the page title
      if (noticeLocation === 'nav') {
        prependMain(notice);
      }
    }

    // 3. check animation type whether its slide-in-scroll?
    // if exist will have to implement intersection observer
    // Question for Michael if multiple widgets need intersection observer, how can we make it more modular?
    if (noticeAnimation) {
      if (noticeLocation === 'fixedBottom') {
        // add noticeAnimationClasses.slideUp
        noticeAnimationClasses.slideUp.forEach(function (noticeAnimationClass) {
          return notice.classList.add(noticeAnimationClass);
        });
      } else {
        // implement intersection observer
        // add noticeAnimationClasses.slideInScroll
        if ('IntersectionObserver' in window) {
          notice.classList.add('hide-animate');
          mq.addListener(function () {
            return onWidthChange(mq);
          });

          //check browser width once on page load
          onWidthChange(mq);
        }
      }
    }

    notice.initialized = true;

    // 4. check localStorage for fixed bottom and collapsible
    if (noticeCollapsible && localStorage.getItem(notice.id) === 'collapsed') {
      var noticeTitle = notice.querySelector('.js-notice-title');
      var noticeMessage = notice.querySelector('.js-notice-message');
      var toggleButton = notice.querySelector('.js-notice-toggle');

      if (!noticeTitle) {
        console.error('Your notice is missing a title.');
        return;
      }

      if (!noticeMessage) {
        console.error('Your notice is missing a message.');
        return;
      }

      collapseExpandMessage(notice, toggleButton, noticeTitle, noticeMessage);
    }
  }

  /**
   *  widget.initialize is the default functionality that scans all the existing notice widgets in the dom
   *  and initialize them
   */
  Notice.initialize = function () {
    notices.forEach(function (notice) {
      createNotice(notice);
    });
  };

  /**
   * widget.create takes in arguments to dynamically create notices on the fly
   */
  Notice.create = function () {
    var noticeTitle = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
    var noticeMessage = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
    var widgetOptions = arguments[2];
    var insertionReference = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'main';
    var insertionPoint = arguments[4];


    if (noticeTitle.length === 0) {
      console.error('Please provide a notice title');
      return;
    }

    if (noticeMessage.length === 0) {
      console.error('Please provide a notice message');
      return;
    }

    var notice = document.createElement('div');
    var noticeHeader = document.createElement('h2');
    var noticeContent = document.createElement('p');

    // set up the notice element
    var keys = Object.keys(widgetOptions);
    notice.setAttribute('role', 'alert');

    keys.forEach(function (key) {
      if (key === 'id') {
        notice.id = widgetOptions[key];
      } else {
        notice.setAttribute('data-' + key, widgetOptions[key]);
      }
    });

    if (typeof noticeTitle === 'string') noticeHeader.innerText = noticeTitle;
    if (typeof noticeMessage === 'string') noticeContent.innerText = noticeMessage;

    noticeHeader.classList.add('js-notice-title');
    noticeContent.classList.add('js-notice-message');

    notice.appendChild(noticeHeader);
    notice.appendChild(noticeContent);

    // insert the notice
    if (insertionReference === 'main' && insertionPoint === undefined) {
      // assuming no insertionReference or insertionPoint provided
      prependMain(notice);
    } else {
      // if insertionReference provided without insertigonPoint provided, default will be afterbegin
      if (insertionPoint === undefined) insertionPoint = 'afterbegin';
      var targetElement = document.querySelector(insertionReference);
      targetElement.insertAdjacentElement(insertionPoint, notice);
    }

    // call createNotice
    createNotice(notice);
  };

  return Notice;
});