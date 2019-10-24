;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.dcfLazyLoad = factory();
  }
}(this, function() {
class LazyLoad {
  /**
   * class constructor
   */
  constructor() {

    // Elements to be lazy loaded
    this.imagesList = document.querySelectorAll('[loading=lazy], .dcf-lazy-load');

    // Configure Intersection Observer
    this.observerConfig = {
    	rootMargin: '0px 0px 50px 0px', // 50px from bottom of browser viewport
    	threshold: [0]
    };
  }

  /**
   * Convert pixels to viewport-width units
   * @param {integer} value: pixel value of element
   */
  pxTOvw(value) {
    var w = window,
      d = document,
      e = d.documentElement,
      g = d.getElementsByTagName('body')[0],
      x = w.innerWidth || e.clientWidth || g.clientWidth;

    var result = (100*value)/x;
    return result + 'vw';
  };

  /**
   * Apply the image: preloaded image is loaded but not applied to actual image element
   * @param {string} image: the image element that we are targetting
   */
  applyImage(image) {
    const src = image.dataset.src;
    const srcset = image.dataset.srcset || null;
    const sizes = image.sizes || 'auto';

    if (!src) {
      return;
      //throw new Error('No image src attribute provided');
    }

    // Prevent this from being lazy loaded a second time.
    image.classList.add('dcf-lazy-loaded');
    image.classList.remove('dcf-lazy-load');
    src && (image.src = src);
    src && (image.removeAttribute('data-src'));
    srcset && (image.srcset = srcset);
    srcset && (image.removeAttribute('data-srcset'));
    if (sizes == 'auto') {
      image.sizes = this.pxTOvw(image.parentElement.clientWidth);
    }
  };

  /**
   * Fetches the image for the given source
   * @param {string} src
   * @param {string} srcset, defaults to null if not provided
   */
  fetchImage(src, srcset = null, sizes = null) {
    return new Promise((resolve, reject) => {
      const image = new Image();
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
  preloadImage(image) {
    const src = image.dataset.src;
    const srcset = image.dataset.srcset;
    const sizes = image.dataset.sizes || null;

    if (!src) {
      return;
      //throw new Error('No image src attribute provided');
    }

    return this.fetchImage(src, srcset, sizes).catch(err => `Image failed to fetch ${err.mes}`);
  };

  /**
   * Load all of the images immediately
   * @param {NodeListOf<Element>} preload
   * @param {boolean} images
   */
  loadImagesImmediately(images, preload = true) {
    // foreach() is not supported in IE
    for (let i = 0; i < images.length; i++) {
      let image = images[i];
      if (preload === true) {
        this.preloadImage(image);
      }
      this.applyImage(image);
    }
  }

  /**
   * Disconnect the observer
   */
  disconnect() {
    if (!this.observer) {
      return;
    }

    this.observer.disconnect();
  };

  /**
   * On intersection
   * @param {array} intersection entries
   * @param {object} intersection observer
   */
  onIntersection = (entries, observer) => {

    // Disconnect if we've already loaded all of the images
    if (this.imageCount === 0) {
      this.observer.disconnect();
    }

    // Loop through the entries
    for (let i = 0; i < entries.length; i++) {
      let entry = entries[i];

      // Are we in viewport?
      // console.log(entry.intersectionRatio);

      if (entry.intersectionRatio > 0) {
        this.imageCount--;
        this.preloadImage(entry.target);
        this.applyImage(entry.target);
        this.observer.unobserve(entry.target);
      }
    }
  };

  initialize() {
    if(!this.imagesList) return;

    // Counter: keeps track of which images haven't been loaded
    this.imageCount = this.imagesList.length;

    if ('loading' in HTMLImageElement.prototype) {
      // Native lazy loading IS supported, so set src-data to src
      this.loadImagesImmediately(this.imagesList, false);
    } else {
      // Native lazy loading is NOT supported, so handle via JavaScript
      // If browser doesn't support intersection observer, load the images immediately
      if (!('IntersectionObserver' in window)) {
        this.loadImagesImmediately(this.imagesList);
      } else {
        // It is supported, load the images
        this.observer = new IntersectionObserver(this.onIntersection, this.observerConfig);

        // foreach() is not supported in IE
        for (let i = 0; i < this.imageCount; i++) {
          let image = this.imagesList[i];
          if (image.classList.contains('dcf-lazy-loaded')) {
            continue;
          }

          this.observer.observe(image);
        }
      }
    }
  }
}

return LazyLoad;
}));
