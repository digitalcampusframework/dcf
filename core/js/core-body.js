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
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/*!************************************************!*\
  !*** ./core/js/loaders/core_body_js_loader.js ***!
  \************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

eval("// lazy load\nconst dcf_lazyload = __webpack_require__(/*! ../app/lazy-load.js */ 1);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMC5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL2NvcmUvanMvbG9hZGVycy9jb3JlX2JvZHlfanNfbG9hZGVyLmpzPzhiZTciXSwic291cmNlc0NvbnRlbnQiOlsiLy8gbGF6eSBsb2FkXG5jb25zdCBkY2ZfbGF6eWxvYWQgPSByZXF1aXJlKCcuLi9hcHAvbGF6eS1sb2FkLmpzJyk7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2NvcmUvanMvbG9hZGVycy9jb3JlX2JvZHlfanNfbG9hZGVyLmpzXG4vLyBtb2R1bGUgaWQgPSAwXG4vLyBtb2R1bGUgY2h1bmtzID0gMSJdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTsiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///0\n");

/***/ }),
/* 1 */
/*!**********************************!*\
  !*** ./core/js/app/lazy-load.js ***!
  \**********************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports) {

eval("// https://github.com/deanhume/lazy-observer-load/blob/master/lazy-load.js\n\n// Get all of the images that are marked up to lazy load\nconst images = document.querySelectorAll('.dcf-js-lazy-img');\nconst config = {\n  // If the image gets within 50px in the Y axis, start the download.\n//   rootMargin: '0px 0px 50px 0px',\n  rootMargin: '0px',\n//   threshold: 0.01\n  threshold: 0.5\n};\n\nlet imageCount = images.length;\nlet observer;\n\n// If we don't have support for intersection observer, loads the images immediately\nif (!('IntersectionObserver' in window)) {\n  loadImagesImmediately(images);\n} else {\n  // It is supported, load the images\n  observer = new IntersectionObserver(onIntersection, config);\n\n  // foreach() is not supported in IE\n  for (let i = 0; i < images.length; i++) {\n    let image = images[i];\n    if (image.classList.contains('dcf-js-lazy-img--handled')) {\n      continue;\n    }\n\n    observer.observe(image);\n  }\n}\n\n/**\n * Fetches the image for the given URL\n * @param {string} url\n */\nfunction fetchImage(url) {\n  return new Promise((resolve, reject) => {\n    const image = new Image();\n    image.src = url;\n    image.onload = resolve;\n    image.onerror = reject;\n  });\n}\n\n/**\n * Preloads the image\n * @param {object} image\n */\nfunction preloadImage(image) {\n  const src = image.dataset.src;\n  if (!src) {\n    return;\n  }\n\n  return fetchImage(src).then(() => { applyImage(image, src); });\n}\n\n/**\n * Load all of the images immediately\n * @param {NodeListOf<Element>} images\n */\nfunction loadImagesImmediately(images) {\n  // foreach() is not supported in IE\n  for (let i = 0; i < images.length; i++) {\n    let image = images[i];\n    preloadImage(image);\n  }\n}\n\n/**\n * Disconnect the observer\n */\nfunction disconnect() {\n  if (!observer) {\n    return;\n  }\n\n  observer.disconnect();\n}\n\n/**\n * On intersection\n * @param {array} entries\n */\nfunction onIntersection(entries) {\n  // Disconnect if we've already loaded all of the images\n  if (imageCount === 0) {\n    observer.disconnect();\n  }\n\n  // Loop through the entries\n  for (let i = 0; i < entries.length; i++) {\n    let entry = entries[i];\n    // Are we in viewport?\n    if (entry.intersectionRatio > 0) {\n      imageCount--;\n\n      // Stop watching and load the image\n      observer.unobserve(entry.target);\n      preloadImage(entry.target);\n    }\n  }\n}\n\n/**\n * Apply the image\n * @param {object} img\n * @param {string} src\n */\nfunction applyImage(img, src) {\n  // Prevent this from being lazy loaded a second time.\n  img.classList.add('dcf-js-lazy-img--handled');\n  img.src = src;\n  img.classList.add('dcf-js-fade-up');\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMS5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL2NvcmUvanMvYXBwL2xhenktbG9hZC5qcz9kMWIzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9kZWFuaHVtZS9sYXp5LW9ic2VydmVyLWxvYWQvYmxvYi9tYXN0ZXIvbGF6eS1sb2FkLmpzXG5cbi8vIEdldCBhbGwgb2YgdGhlIGltYWdlcyB0aGF0IGFyZSBtYXJrZWQgdXAgdG8gbGF6eSBsb2FkXG5jb25zdCBpbWFnZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuZGNmLWpzLWxhenktaW1nJyk7XG5jb25zdCBjb25maWcgPSB7XG4gIC8vIElmIHRoZSBpbWFnZSBnZXRzIHdpdGhpbiA1MHB4IGluIHRoZSBZIGF4aXMsIHN0YXJ0IHRoZSBkb3dubG9hZC5cbi8vICAgcm9vdE1hcmdpbjogJzBweCAwcHggNTBweCAwcHgnLFxuICByb290TWFyZ2luOiAnMHB4Jyxcbi8vICAgdGhyZXNob2xkOiAwLjAxXG4gIHRocmVzaG9sZDogMC41XG59O1xuXG5sZXQgaW1hZ2VDb3VudCA9IGltYWdlcy5sZW5ndGg7XG5sZXQgb2JzZXJ2ZXI7XG5cbi8vIElmIHdlIGRvbid0IGhhdmUgc3VwcG9ydCBmb3IgaW50ZXJzZWN0aW9uIG9ic2VydmVyLCBsb2FkcyB0aGUgaW1hZ2VzIGltbWVkaWF0ZWx5XG5pZiAoISgnSW50ZXJzZWN0aW9uT2JzZXJ2ZXInIGluIHdpbmRvdykpIHtcbiAgbG9hZEltYWdlc0ltbWVkaWF0ZWx5KGltYWdlcyk7XG59IGVsc2Uge1xuICAvLyBJdCBpcyBzdXBwb3J0ZWQsIGxvYWQgdGhlIGltYWdlc1xuICBvYnNlcnZlciA9IG5ldyBJbnRlcnNlY3Rpb25PYnNlcnZlcihvbkludGVyc2VjdGlvbiwgY29uZmlnKTtcblxuICAvLyBmb3JlYWNoKCkgaXMgbm90IHN1cHBvcnRlZCBpbiBJRVxuICBmb3IgKGxldCBpID0gMDsgaSA8IGltYWdlcy5sZW5ndGg7IGkrKykge1xuICAgIGxldCBpbWFnZSA9IGltYWdlc1tpXTtcbiAgICBpZiAoaW1hZ2UuY2xhc3NMaXN0LmNvbnRhaW5zKCdkY2YtanMtbGF6eS1pbWctLWhhbmRsZWQnKSkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgb2JzZXJ2ZXIub2JzZXJ2ZShpbWFnZSk7XG4gIH1cbn1cblxuLyoqXG4gKiBGZXRjaGVzIHRoZSBpbWFnZSBmb3IgdGhlIGdpdmVuIFVSTFxuICogQHBhcmFtIHtzdHJpbmd9IHVybFxuICovXG5mdW5jdGlvbiBmZXRjaEltYWdlKHVybCkge1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIGNvbnN0IGltYWdlID0gbmV3IEltYWdlKCk7XG4gICAgaW1hZ2Uuc3JjID0gdXJsO1xuICAgIGltYWdlLm9ubG9hZCA9IHJlc29sdmU7XG4gICAgaW1hZ2Uub25lcnJvciA9IHJlamVjdDtcbiAgfSk7XG59XG5cbi8qKlxuICogUHJlbG9hZHMgdGhlIGltYWdlXG4gKiBAcGFyYW0ge29iamVjdH0gaW1hZ2VcbiAqL1xuZnVuY3Rpb24gcHJlbG9hZEltYWdlKGltYWdlKSB7XG4gIGNvbnN0IHNyYyA9IGltYWdlLmRhdGFzZXQuc3JjO1xuICBpZiAoIXNyYykge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHJldHVybiBmZXRjaEltYWdlKHNyYykudGhlbigoKSA9PiB7IGFwcGx5SW1hZ2UoaW1hZ2UsIHNyYyk7IH0pO1xufVxuXG4vKipcbiAqIExvYWQgYWxsIG9mIHRoZSBpbWFnZXMgaW1tZWRpYXRlbHlcbiAqIEBwYXJhbSB7Tm9kZUxpc3RPZjxFbGVtZW50Pn0gaW1hZ2VzXG4gKi9cbmZ1bmN0aW9uIGxvYWRJbWFnZXNJbW1lZGlhdGVseShpbWFnZXMpIHtcbiAgLy8gZm9yZWFjaCgpIGlzIG5vdCBzdXBwb3J0ZWQgaW4gSUVcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBpbWFnZXMubGVuZ3RoOyBpKyspIHtcbiAgICBsZXQgaW1hZ2UgPSBpbWFnZXNbaV07XG4gICAgcHJlbG9hZEltYWdlKGltYWdlKTtcbiAgfVxufVxuXG4vKipcbiAqIERpc2Nvbm5lY3QgdGhlIG9ic2VydmVyXG4gKi9cbmZ1bmN0aW9uIGRpc2Nvbm5lY3QoKSB7XG4gIGlmICghb2JzZXJ2ZXIpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBvYnNlcnZlci5kaXNjb25uZWN0KCk7XG59XG5cbi8qKlxuICogT24gaW50ZXJzZWN0aW9uXG4gKiBAcGFyYW0ge2FycmF5fSBlbnRyaWVzXG4gKi9cbmZ1bmN0aW9uIG9uSW50ZXJzZWN0aW9uKGVudHJpZXMpIHtcbiAgLy8gRGlzY29ubmVjdCBpZiB3ZSd2ZSBhbHJlYWR5IGxvYWRlZCBhbGwgb2YgdGhlIGltYWdlc1xuICBpZiAoaW1hZ2VDb3VudCA9PT0gMCkge1xuICAgIG9ic2VydmVyLmRpc2Nvbm5lY3QoKTtcbiAgfVxuXG4gIC8vIExvb3AgdGhyb3VnaCB0aGUgZW50cmllc1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGVudHJpZXMubGVuZ3RoOyBpKyspIHtcbiAgICBsZXQgZW50cnkgPSBlbnRyaWVzW2ldO1xuICAgIC8vIEFyZSB3ZSBpbiB2aWV3cG9ydD9cbiAgICBpZiAoZW50cnkuaW50ZXJzZWN0aW9uUmF0aW8gPiAwKSB7XG4gICAgICBpbWFnZUNvdW50LS07XG5cbiAgICAgIC8vIFN0b3Agd2F0Y2hpbmcgYW5kIGxvYWQgdGhlIGltYWdlXG4gICAgICBvYnNlcnZlci51bm9ic2VydmUoZW50cnkudGFyZ2V0KTtcbiAgICAgIHByZWxvYWRJbWFnZShlbnRyeS50YXJnZXQpO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIEFwcGx5IHRoZSBpbWFnZVxuICogQHBhcmFtIHtvYmplY3R9IGltZ1xuICogQHBhcmFtIHtzdHJpbmd9IHNyY1xuICovXG5mdW5jdGlvbiBhcHBseUltYWdlKGltZywgc3JjKSB7XG4gIC8vIFByZXZlbnQgdGhpcyBmcm9tIGJlaW5nIGxhenkgbG9hZGVkIGEgc2Vjb25kIHRpbWUuXG4gIGltZy5jbGFzc0xpc3QuYWRkKCdkY2YtanMtbGF6eS1pbWctLWhhbmRsZWQnKTtcbiAgaW1nLnNyYyA9IHNyYztcbiAgaW1nLmNsYXNzTGlzdC5hZGQoJ2RjZi1qcy1mYWRlLXVwJyk7XG59XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2NvcmUvanMvYXBwL2xhenktbG9hZC5qc1xuLy8gbW9kdWxlIGlkID0gMVxuLy8gbW9kdWxlIGNodW5rcyA9IDEiXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTsiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///1\n");

/***/ })
/******/ ]);