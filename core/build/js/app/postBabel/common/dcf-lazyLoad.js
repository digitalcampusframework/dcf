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