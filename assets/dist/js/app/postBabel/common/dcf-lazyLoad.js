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
     * @param {itemList} nodelist of selected lazy loadable nodes
     * @param {observerConfig} object of intersectionObserver configuration
     * @param {classNames} array of classes applied
     */
    function LazyLoad(itemList, observerConfig, classNames) {
      var _this = this;

      _classCallCheck(this, LazyLoad);

      this.onIntersection = function (entries, observer) {

        // Disconnect if we've already loaded all of the images
        if (_this.itemsCount === 0) {
          _this.observer.disconnect();
        }

        // Loop through the entries
        for (var i = 0; i < entries.length; i++) {
          var entry = entries[i];

          switch (entry.target.nodeName) {
            case 'IMG':
              if (entry.intersectionRatio > observer.thresholds[0] && entry.intersectionRatio < observer.thresholds[1]) {
                _this.preloadImage(entry.target);
              } else if (entry.intersectionRatio > observer.thresholds[1]) {
                _this.itemsCount--;
                _this.applyImage(entry.target);
                _this.observer.unobserve(entry.target);
              }
              break;

            default:
              // do nothing skip to next item;
              continue;
          }
        }
      };

      this.itemList = itemList;
      this.observerConfig = observerConfig;
      this.classNames = classNames;
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
        }

        // Process parent picture lazy load if image is child of a picture
        if (image.parentNode.nodeName == 'PICTURE') {
          this.applyPicture(image.parentNode);
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
        }

        return this.fetchImage(src, srcset, sizes).catch(function (err) {
          return 'Image failed to fetch ' + err.mes;
        });
      }
    }, {
      key: 'applyPicture',


      /**
       * Apply the picture
       * @param {string} picture: the picture element that we are targeting
       */
      value: function applyPicture(picture) {

        // update picture source tags
        var pictureSources = picture.getElementsByTagName("SOURCE");
        for (var i = 0; i < pictureSources.length; i++) {
          var srcset = pictureSources[i].dataset.srcset || null;
          var sizes = pictureSources[i].dataset.sizes || this.pxTOvw(picture.parentElement.clientWidth);

          if (!srcset) {
            continue;
          }

          srcset && (pictureSources[i].srcset = srcset);
          srcset && pictureSources[i].removeAttribute('data-srcset');
          sizes && (pictureSources[i].sizes = sizes);
          sizes && pictureSources[i].removeAttribute('data-sizes');
        }
      }
    }, {
      key: 'loadItemsImmediately',


      /**
       * Load all of the items immediately
       * @param {NodeListOf<Element>} items
       * @param {boolean} preload
       */
      value: function loadItemsImmediately(items) {
        var preload = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

        // foreach() is not supported in IE
        for (var i = 0; i < items.length; i++) {
          switch (items[i].nodeName) {
            case 'IMG':
              if (preload === true) {
                this.preloadImage(items[i]);
              }
              this.applyImage(items[i]);
              break;

            default:
              // do nothing skip to next item;
              continue;
          }
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

        if (!this.itemList) return;

        this.itemsCount = this.itemList.length;

        if ("loading" in HTMLImageElement.prototype) {
          // Native lazy loading IS supported, so set src-data to src
          this.loadItemsImmediately(this.itemList, false);
        } else {
          // Native lazy loading NOT supported, so handle via javascript
          // If browser doesn't support intersection observer, load the items immediately
          if (!('IntersectionObserver' in window)) {
            this.loadItemsImmediately(this.itemList);
          } else {
            // It is supported, load the items
            this.observer = new IntersectionObserver(this.onIntersection, this.observerConfig);

            // foreach() is not supported in IE
            for (var i = 0; i < this.itemList.length; i++) {
              var item = this.itemList[i];
              if (item.classList.contains('dcf-lazy-loaded')) {
                continue;
              }

              this.observer.observe(item);
            }
          }
        }
      }
    }]);

    return LazyLoad;
  }();

  return LazyLoad;
});