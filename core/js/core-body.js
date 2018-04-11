/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 333);
/******/ })
/************************************************************************/
/******/ ({

/***/ 333:
/*!************************************************!*\
  !*** ./core/js/loaders/core_body_js_loader.js ***!
  \************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

eval("// object-fit\nconst dcf_objectfit = __webpack_require__(/*! ../app/object-fit.js */ 334);\n\n\n// lazy load\nconst dcf_lazyload = __webpack_require__(/*! ../app/lazy-load.js */ 335);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMzMzLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vY29yZS9qcy9sb2FkZXJzL2NvcmVfYm9keV9qc19sb2FkZXIuanM/OGJlNyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBvYmplY3QtZml0XG5jb25zdCBkY2Zfb2JqZWN0Zml0ID0gcmVxdWlyZSgnLi4vYXBwL29iamVjdC1maXQuanMnKTtcblxuXG4vLyBsYXp5IGxvYWRcbmNvbnN0IGRjZl9sYXp5bG9hZCA9IHJlcXVpcmUoJy4uL2FwcC9sYXp5LWxvYWQuanMnKTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vY29yZS9qcy9sb2FkZXJzL2NvcmVfYm9keV9qc19sb2FkZXIuanNcbi8vIG1vZHVsZSBpZCA9IDMzM1xuLy8gbW9kdWxlIGNodW5rcyA9IDEiXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTsiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///333\n");

/***/ }),

/***/ 334:
/*!***********************************!*\
  !*** ./core/js/app/object-fit.js ***!
  \***********************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports) {

eval("// Based on https://www.bmorecreativeinc.com/edge-object-fit-fallback-without-polyfill-modernizr/\n\nvar results = document.querySelector( '.dcf-objfit-check' );\nvar objectfit = window.getComputedStyle( results, '::before' ).content;\nif( objectfit == 'none' ) {\n  // Edge fallback\n  // Javascript is nearly identical to the Medium article\n  $( '.dcf-objfit-cover' ).parent( 'div' ).addClass( 'dcf-objfit-cover-fallback' );\n  $( '.dcf-objfit-cover-fallback' ).each( function() {\n    var $container = $( this ),\n      imgUrl = $container.find( 'img' ).prop( 'src' );\n    if( imgUrl ) {\n      $container.css( 'backgroundImage', 'url(' + imgUrl + ')' );\n    }\n  });\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMzM0LmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vY29yZS9qcy9hcHAvb2JqZWN0LWZpdC5qcz9hMGNlIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIEJhc2VkIG9uIGh0dHBzOi8vd3d3LmJtb3JlY3JlYXRpdmVpbmMuY29tL2VkZ2Utb2JqZWN0LWZpdC1mYWxsYmFjay13aXRob3V0LXBvbHlmaWxsLW1vZGVybml6ci9cblxudmFyIHJlc3VsdHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCAnLmRjZi1vYmpmaXQtY2hlY2snICk7XG52YXIgb2JqZWN0Zml0ID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoIHJlc3VsdHMsICc6OmJlZm9yZScgKS5jb250ZW50O1xuaWYoIG9iamVjdGZpdCA9PSAnbm9uZScgKSB7XG4gIC8vIEVkZ2UgZmFsbGJhY2tcbiAgLy8gSmF2YXNjcmlwdCBpcyBuZWFybHkgaWRlbnRpY2FsIHRvIHRoZSBNZWRpdW0gYXJ0aWNsZVxuICAkKCAnLmRjZi1vYmpmaXQtY292ZXInICkucGFyZW50KCAnZGl2JyApLmFkZENsYXNzKCAnZGNmLW9iamZpdC1jb3Zlci1mYWxsYmFjaycgKTtcbiAgJCggJy5kY2Ytb2JqZml0LWNvdmVyLWZhbGxiYWNrJyApLmVhY2goIGZ1bmN0aW9uKCkge1xuICAgIHZhciAkY29udGFpbmVyID0gJCggdGhpcyApLFxuICAgICAgaW1nVXJsID0gJGNvbnRhaW5lci5maW5kKCAnaW1nJyApLnByb3AoICdzcmMnICk7XG4gICAgaWYoIGltZ1VybCApIHtcbiAgICAgICRjb250YWluZXIuY3NzKCAnYmFja2dyb3VuZEltYWdlJywgJ3VybCgnICsgaW1nVXJsICsgJyknICk7XG4gICAgfVxuICB9KTtcbn1cblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vY29yZS9qcy9hcHAvb2JqZWN0LWZpdC5qc1xuLy8gbW9kdWxlIGlkID0gMzM0XG4vLyBtb2R1bGUgY2h1bmtzID0gMSJdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Iiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///334\n");

/***/ }),

/***/ 335:
/*!**********************************!*\
  !*** ./core/js/app/lazy-load.js ***!
  \**********************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports) {

eval("// https://github.com/deanhume/lazy-observer-load/blob/master/lazy-load.js\n\n// Get all of the images that are marked up to lazy load\nconst images = document.querySelectorAll('.dcf-lazy-img');\nconst config = {\n  // If the image gets within 50px in the Y axis, start the download.\n//   rootMargin: '0px 0px 50px 0px',\n  rootMargin: '0px',\n//   threshold: 0.01\n  threshold: 0.5\n};\n\nlet imageCount = images.length;\nlet observer;\n\n// If we don't have support for intersection observer, loads the images immediately\nif (!('IntersectionObserver' in window)) {\n  loadImagesImmediately(images);\n} else {\n  // It is supported, load the images\n  observer = new IntersectionObserver(onIntersection, config);\n\n  // foreach() is not supported in IE\n  for (let i = 0; i < images.length; i++) {\n    let image = images[i];\n    if (image.classList.contains('dcf-lazy-img-handled')) {\n      continue;\n    }\n\n    observer.observe(image);\n  }\n}\n\n/**\n * Fetches the image for the given URL\n * @param {string} url\n */\nfunction fetchImage(url) {\n  return new Promise((resolve, reject) => {\n    const image = new Image();\n    image.src = url;\n    image.onload = resolve;\n    image.onerror = reject;\n  });\n}\n\n/**\n * Preloads the image\n * @param {object} image\n */\nfunction preloadImage(image) {\n  const src = image.dataset.src;\n  if (!src) {\n    return;\n  }\n\n  return fetchImage(src).then(() => { applyImage(image, src); });\n}\n\n/**\n * Load all of the images immediately\n * @param {NodeListOf<Element>} images\n */\nfunction loadImagesImmediately(images) {\n  // foreach() is not supported in IE\n  for (let i = 0; i < images.length; i++) {\n    let image = images[i];\n    preloadImage(image);\n  }\n}\n\n/**\n * Disconnect the observer\n */\nfunction disconnect() {\n  if (!observer) {\n    return;\n  }\n\n  observer.disconnect();\n}\n\n/**\n * On intersection\n * @param {array} entries\n */\nfunction onIntersection(entries) {\n  // Disconnect if we've already loaded all of the images\n  if (imageCount === 0) {\n    observer.disconnect();\n  }\n\n  // Loop through the entries\n  for (let i = 0; i < entries.length; i++) {\n    let entry = entries[i];\n    // Are we in viewport?\n    if (entry.intersectionRatio > 0) {\n      imageCount--;\n\n      // Stop watching and load the image\n      observer.unobserve(entry.target);\n      preloadImage(entry.target);\n    }\n  }\n}\n\n/**\n * Apply the image\n * @param {object} img\n * @param {string} src\n */\nfunction applyImage(img, src) {\n  // Prevent this from being lazy loaded a second time.\n  img.classList.add('dcf-lazy-img-handled');\n  img.src = src;\n  img.classList.add('dcf-fade-up');\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMzM1LmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vY29yZS9qcy9hcHAvbGF6eS1sb2FkLmpzP2QxYjMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gaHR0cHM6Ly9naXRodWIuY29tL2RlYW5odW1lL2xhenktb2JzZXJ2ZXItbG9hZC9ibG9iL21hc3Rlci9sYXp5LWxvYWQuanNcblxuLy8gR2V0IGFsbCBvZiB0aGUgaW1hZ2VzIHRoYXQgYXJlIG1hcmtlZCB1cCB0byBsYXp5IGxvYWRcbmNvbnN0IGltYWdlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5kY2YtbGF6eS1pbWcnKTtcbmNvbnN0IGNvbmZpZyA9IHtcbiAgLy8gSWYgdGhlIGltYWdlIGdldHMgd2l0aGluIDUwcHggaW4gdGhlIFkgYXhpcywgc3RhcnQgdGhlIGRvd25sb2FkLlxuLy8gICByb290TWFyZ2luOiAnMHB4IDBweCA1MHB4IDBweCcsXG4gIHJvb3RNYXJnaW46ICcwcHgnLFxuLy8gICB0aHJlc2hvbGQ6IDAuMDFcbiAgdGhyZXNob2xkOiAwLjVcbn07XG5cbmxldCBpbWFnZUNvdW50ID0gaW1hZ2VzLmxlbmd0aDtcbmxldCBvYnNlcnZlcjtcblxuLy8gSWYgd2UgZG9uJ3QgaGF2ZSBzdXBwb3J0IGZvciBpbnRlcnNlY3Rpb24gb2JzZXJ2ZXIsIGxvYWRzIHRoZSBpbWFnZXMgaW1tZWRpYXRlbHlcbmlmICghKCdJbnRlcnNlY3Rpb25PYnNlcnZlcicgaW4gd2luZG93KSkge1xuICBsb2FkSW1hZ2VzSW1tZWRpYXRlbHkoaW1hZ2VzKTtcbn0gZWxzZSB7XG4gIC8vIEl0IGlzIHN1cHBvcnRlZCwgbG9hZCB0aGUgaW1hZ2VzXG4gIG9ic2VydmVyID0gbmV3IEludGVyc2VjdGlvbk9ic2VydmVyKG9uSW50ZXJzZWN0aW9uLCBjb25maWcpO1xuXG4gIC8vIGZvcmVhY2goKSBpcyBub3Qgc3VwcG9ydGVkIGluIElFXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgaW1hZ2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgbGV0IGltYWdlID0gaW1hZ2VzW2ldO1xuICAgIGlmIChpbWFnZS5jbGFzc0xpc3QuY29udGFpbnMoJ2RjZi1sYXp5LWltZy1oYW5kbGVkJykpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIG9ic2VydmVyLm9ic2VydmUoaW1hZ2UpO1xuICB9XG59XG5cbi8qKlxuICogRmV0Y2hlcyB0aGUgaW1hZ2UgZm9yIHRoZSBnaXZlbiBVUkxcbiAqIEBwYXJhbSB7c3RyaW5nfSB1cmxcbiAqL1xuZnVuY3Rpb24gZmV0Y2hJbWFnZSh1cmwpIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICBjb25zdCBpbWFnZSA9IG5ldyBJbWFnZSgpO1xuICAgIGltYWdlLnNyYyA9IHVybDtcbiAgICBpbWFnZS5vbmxvYWQgPSByZXNvbHZlO1xuICAgIGltYWdlLm9uZXJyb3IgPSByZWplY3Q7XG4gIH0pO1xufVxuXG4vKipcbiAqIFByZWxvYWRzIHRoZSBpbWFnZVxuICogQHBhcmFtIHtvYmplY3R9IGltYWdlXG4gKi9cbmZ1bmN0aW9uIHByZWxvYWRJbWFnZShpbWFnZSkge1xuICBjb25zdCBzcmMgPSBpbWFnZS5kYXRhc2V0LnNyYztcbiAgaWYgKCFzcmMpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICByZXR1cm4gZmV0Y2hJbWFnZShzcmMpLnRoZW4oKCkgPT4geyBhcHBseUltYWdlKGltYWdlLCBzcmMpOyB9KTtcbn1cblxuLyoqXG4gKiBMb2FkIGFsbCBvZiB0aGUgaW1hZ2VzIGltbWVkaWF0ZWx5XG4gKiBAcGFyYW0ge05vZGVMaXN0T2Y8RWxlbWVudD59IGltYWdlc1xuICovXG5mdW5jdGlvbiBsb2FkSW1hZ2VzSW1tZWRpYXRlbHkoaW1hZ2VzKSB7XG4gIC8vIGZvcmVhY2goKSBpcyBub3Qgc3VwcG9ydGVkIGluIElFXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgaW1hZ2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgbGV0IGltYWdlID0gaW1hZ2VzW2ldO1xuICAgIHByZWxvYWRJbWFnZShpbWFnZSk7XG4gIH1cbn1cblxuLyoqXG4gKiBEaXNjb25uZWN0IHRoZSBvYnNlcnZlclxuICovXG5mdW5jdGlvbiBkaXNjb25uZWN0KCkge1xuICBpZiAoIW9ic2VydmVyKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgb2JzZXJ2ZXIuZGlzY29ubmVjdCgpO1xufVxuXG4vKipcbiAqIE9uIGludGVyc2VjdGlvblxuICogQHBhcmFtIHthcnJheX0gZW50cmllc1xuICovXG5mdW5jdGlvbiBvbkludGVyc2VjdGlvbihlbnRyaWVzKSB7XG4gIC8vIERpc2Nvbm5lY3QgaWYgd2UndmUgYWxyZWFkeSBsb2FkZWQgYWxsIG9mIHRoZSBpbWFnZXNcbiAgaWYgKGltYWdlQ291bnQgPT09IDApIHtcbiAgICBvYnNlcnZlci5kaXNjb25uZWN0KCk7XG4gIH1cblxuICAvLyBMb29wIHRocm91Z2ggdGhlIGVudHJpZXNcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBlbnRyaWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgbGV0IGVudHJ5ID0gZW50cmllc1tpXTtcbiAgICAvLyBBcmUgd2UgaW4gdmlld3BvcnQ/XG4gICAgaWYgKGVudHJ5LmludGVyc2VjdGlvblJhdGlvID4gMCkge1xuICAgICAgaW1hZ2VDb3VudC0tO1xuXG4gICAgICAvLyBTdG9wIHdhdGNoaW5nIGFuZCBsb2FkIHRoZSBpbWFnZVxuICAgICAgb2JzZXJ2ZXIudW5vYnNlcnZlKGVudHJ5LnRhcmdldCk7XG4gICAgICBwcmVsb2FkSW1hZ2UoZW50cnkudGFyZ2V0KTtcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBBcHBseSB0aGUgaW1hZ2VcbiAqIEBwYXJhbSB7b2JqZWN0fSBpbWdcbiAqIEBwYXJhbSB7c3RyaW5nfSBzcmNcbiAqL1xuZnVuY3Rpb24gYXBwbHlJbWFnZShpbWcsIHNyYykge1xuICAvLyBQcmV2ZW50IHRoaXMgZnJvbSBiZWluZyBsYXp5IGxvYWRlZCBhIHNlY29uZCB0aW1lLlxuICBpbWcuY2xhc3NMaXN0LmFkZCgnZGNmLWxhenktaW1nLWhhbmRsZWQnKTtcbiAgaW1nLnNyYyA9IHNyYztcbiAgaW1nLmNsYXNzTGlzdC5hZGQoJ2RjZi1mYWRlLXVwJyk7XG59XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2NvcmUvanMvYXBwL2xhenktbG9hZC5qc1xuLy8gbW9kdWxlIGlkID0gMzM1XG4vLyBtb2R1bGUgY2h1bmtzID0gMSJdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOyIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///335\n");

/***/ })

/******/ });