'use strict';

// https://github.com/deanhume/lazy-observer-load/blob/master/lazy-load.js

// Get all of the images that are marked up to lazy load
var images = document.querySelectorAll('.dcf-lazy-img');
var config = {
  // If the image gets within 50px in the Y axis, start the download.
  //   rootMargin: '0px 0px 50px 0px',
  rootMargin: '0px',
  //   threshold: 0.01
  threshold: 0.5
};

var imageCount = images.length;
var observer = void 0;

// If we don't have support for intersection observer, loads the images immediately
if (!('IntersectionObserver' in window)) {
  loadImagesImmediately(images);
} else {
  // It is supported, load the images
  observer = new IntersectionObserver(onIntersection, config);

  // foreach() is not supported in IE
  for (var i = 0; i < images.length; i++) {
    var image = images[i];
    if (image.classList.contains('dcf-lazy-img-handled')) {
      continue;
    }

    observer.observe(image);
  }
}

/**
 * Fetches the image for the given URL
 * @param {string} url
 */
function fetchImage(url) {
  return new Promise(function (resolve, reject) {
    var image = new Image();
    image.src = url;
    image.onload = resolve;
    image.onerror = reject;
  });
}

/**
 * Preloads the image
 * @param {object} image
 */
function preloadImage(image) {
  var src = image.dataset.src;
  if (!src) {
    return;
  }

  return fetchImage(src).then(function () {
    applyImage(image, src);
  });
}

/**
 * Load all of the images immediately
 * @param {NodeListOf<Element>} images
 */
function loadImagesImmediately(images) {
  // foreach() is not supported in IE
  for (var _i = 0; _i < images.length; _i++) {
    var _image = images[_i];
    preloadImage(_image);
  }
}

/**
 * Disconnect the observer
 */
function disconnect() {
  if (!observer) {
    return;
  }

  observer.disconnect();
}

/**
 * On intersection
 * @param {array} entries
 */
function onIntersection(entries) {
  // Disconnect if we've already loaded all of the images
  if (imageCount === 0) {
    observer.disconnect();
  }

  // Loop through the entries
  for (var _i2 = 0; _i2 < entries.length; _i2++) {
    var entry = entries[_i2];
    // Are we in viewport?
    if (entry.intersectionRatio > 0) {
      imageCount--;

      // Stop watching and load the image
      observer.unobserve(entry.target);
      preloadImage(entry.target);
    }
  }
}

/**
 * Apply the image
 * @param {object} img
 * @param {string} src
 */
function applyImage(img, src) {
  // Prevent this from being lazy loaded a second time.
  img.classList.add('dcf-lazy-img-handled');
  img.src = src;
  img.classList.add('dcf-fade-up');
}