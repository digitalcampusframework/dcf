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
   * Apply the image
   * @param {imagesList} nodelist of selected images
   * @param {observerConfig} object of intersectionObserver configuration
   * @param {classNames} array of classes applied
   */
		function LazyLoad(imagesList, observerConfig, classNames) {
			var _this = this;

			_classCallCheck(this, LazyLoad);

			this.onIntersection = function (entries) {
				// Disconnect if we've already loaded all of the images
				if (_this.imageCount === 0) {
					_this.observer.disconnect();
				}

				// Loop through the entries
				for (var i = 0; i < entries.length; i++) {
					var entry = entries[i];
					// Are we in viewport?
					if (entry.intersectionRatio > 0) {
						_this.imageCount--;

						// Stop watching and load the image
						_this.observer.unobserve(entry.target);
						_this.preloadImage(entry.target);
					}
				}
			};

			this.imagesList = imagesList;
			this.observerConfig = observerConfig;
			this.classNames = classNames; // add onEnter, onEnterActive?
		}

		/**
   * Apply the image
   * @param {object} img
   * @param {string} src
   */


		_createClass(LazyLoad, [{
			key: 'applyImage',
			value: function applyImage(img, src) {
				var srcset = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

				// Prevent this from being lazy loaded a second time.
				img.classList.add('dcf-lazy-img-handled');
				img.src = src;
				src && img.removeAttribute('data-src');
				srcset && (img.srcset = srcset);
				srcset && img.removeAttribute('data-srcset');
				this.classNames.length && this.classNames.forEach(function (className) {
					return img.classList.add(className);
				});
				// img.classList.add('dcf-fade-up');
			}
		}, {
			key: 'fetchImage',


			/**
    * Fetches the image for the given URL
    * @param {string} url
    */
			value: function fetchImage() {
				var _arguments = arguments;

				return new Promise(function (resolve, reject) {
					var image = new Image();
					// image.src = url;
					_arguments[0] && (image.src = _arguments[0]);
					_arguments[1] && (image.srcset = _arguments[1]);

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
				var _this2 = this;

				var src = image.dataset.src;
				var srcset = image.dataset.srcset;

				if (!src) {
					return;
				}

				return this.fetchImage(src, srcset).then(function () {
					_this2.applyImage(image, src, srcset);
				}).catch(function (err) {
					return 'Image failed to fetch ' + err.mes;
				});
			}
		}, {
			key: 'loadImagesImmediately',


			/**
    * Load all of the images immediately
    * @param {NodeListOf<Element>} images
    */
			value: function loadImagesImmediately(images) {
				// foreach() is not supported in IE
				for (var i = 0; i < images.length; i++) {
					var image = images[i];
					this.preloadImage(image);
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
    * @param {array} entries
    */

		}, {
			key: 'initialize',
			value: function initialize() {
				if (!this.imagesList) return;
				this.imageCount = this.imagesList.length;

				// If we don't have support for intersection observer, loads the images immediately
				if (!('IntersectionObserver' in window)) {
					this.loadImagesImmediately(this.imagesList);
				} else {
					// It is supported, load the images
					this.observer = new IntersectionObserver(this.onIntersection, this.observerConfig);

					// foreach() is not supported in IE
					for (var i = 0; i < this.imageCount; i++) {
						var image = this.imagesList[i];
						if (image.classList.contains('dcf-lazy-img-loaded')) {
							continue;
						}

						this.observer.observe(image);
					}
				}
			}
		}]);

		return LazyLoad;
	}();

	return LazyLoad;
});