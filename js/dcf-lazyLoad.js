class DCFLazyLoad {
  constructor(itemList, observerConfig, classNames) {
    this.itemList = itemList;
    this.observerConfig = observerConfig;
    this.classNames = classNames;
  }

  pxTOvw(value) {
    const zeroIndex = 0;
    const oneHundred = 100;
    const docElement = document.documentElement,
      docBody = document.getElementsByTagName('body')[zeroIndex],
      windowWidth = window.innerWidth || docElement.clientWidth || docBody.clientWidth;

    const result = oneHundred * value / windowWidth;
    return `${result }vw`;
  }

  /**
   * Apply the image: preloaded image is loaded but not applied to actual image element
   * @param {string} image: the image element that we are targetting
   */
  applyImage(image) {
    const src = image.dataset.src;
    const srcset = image.dataset.srcset || null;
    const sizes = image.dataset.sizes || this.pxTOvw(image.parentElement.clientWidth);

    if (!src) {
      return;
    }

    // Process parent picture lazy load if image is child of a picture
    if (image.parentNode.nodeName === 'PICTURE') {
      this.applyPicture(image.parentNode);
    }

    // Prevent this from being lazy loaded a second time.
    image.classList.add('dcf-lazy-loaded');
    image.classList.remove('dcf-lazy-load');

    if (src) {
      image.src = src;
      image.removeAttribute('data-src');
    }
    if (srcset) {
      image.srcset = srcset;
      image.removeAttribute('data-srcset');
    }
    if (sizes) {
      image.sizes = sizes;
      image.removeAttribute('data-sizes');
    }
    if (this.classNames.length) {
      this.classNames.forEach((className) => image.classList.add(className));
    }
  }

  /**
   * @param {string}  src     The src of image.
   * @param {string}  srcset  Defaults to null if not provided.
   * @param {integer} sizes   Defaults to null if not provided.
   *
   * @returns {Promise}
   */
  fetchImage(src, srcset = null, sizes = null) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      if (src) {
        image.src = src;
      }
      if (srcset) {
        image.srcset = srcset;
      }
      if (sizes) {
        image.sizes = sizes;
      }

      image.onload = resolve;
      image.onerror = reject;
    }).catch(() => {
      // do nothing
    });
  }

  /**
   * Preloads the image
   * @param {object} image   An image object.
   *
   * @returns {(object|void)} Returns a promise for fetchImage or void.
   */
  preloadImage(image) {
    const src = image.dataset.src;
    const srcset = image.dataset.srcset;
    const sizes = image.dataset.sizes || null;

    let fetchImagePromise = null;
    if (src) {
      try {
        fetchImagePromise = this.fetchImage(src, srcset, sizes);
      } catch (error) {
        // do nothing
      }
    }
    return fetchImagePromise;
  }

  /**
   * Apply the picture
   * @param {string} picture: the picture element that we are targeting
   */
  applyPicture(picture) {
    // update picture source tags
    let pictureSources = picture.getElementsByTagName('SOURCE');
    Array.from(pictureSources).forEach((pictureSource) => {
      const srcset = pictureSource.dataset.srcset || null;
      const sizes = pictureSource.dataset.sizes || this.pxTOvw(picture.parentElement.clientWidth);

      if (!srcset) {
        // skip this pictureSource
        return;
      }

      pictureSource.srcset = srcset;
      pictureSource.removeAttribute('data-srcset');

      if (sizes) {
        pictureSource.sizes = sizes;
        pictureSource.removeAttribute('data-sizes');
      }
    });
  }

  /**
   * Load all of the items immediately
   * @param {NodeListOf<Element>} items     List of node elements.
   * @param {boolean}             preload   Whether to preload or not.
   */
  loadItemsImmediately(items, preload = true) {
    items.forEach((item) => {
      switch (item.nodeName) {
      case 'IMG':
        if (preload === true) {
          this.preloadImage(item);
        }
        this.applyImage(item);
        break;

      default:
        // do nothing skip to next item;
        return;
      }
    });
  }

  /**
   * Disconnect the observer
   */
  disconnect() {
    if (!this.observer) {
      return;
    }

    this.observer.disconnect();
  }

  initialize() {
    // onIntersection callback function
    let onIntersection = (entries, observer) => {
      const zero = 0;
      const zeroIndex = 0;
      const oneIndex = 1;
      // Disconnect if we've already loaded all of the images
      if (this.itemsCount === zero) {
        this.observer.disconnect();
      }

      // Loop through the entries
      entries.forEach((entry) => {
        switch (entry.target.nodeName) {
        case 'IMG':
          if (entry.intersectionRatio > observer.thresholds[zeroIndex] &&
              entry.intersectionRatio < observer.thresholds[oneIndex]) {
            this.preloadImage(entry.target);
          } else if (entry.intersectionRatio > observer.thresholds[oneIndex]) {
            this.itemsCount--;
            this.applyImage(entry.target);
            this.observer.unobserve(entry.target);
          }
          break;

        default:
          // do nothing skip to next item;
          return;
        }
      });
    };

    if (!this.itemList) {
      return;
    }

    this.itemsCount = this.itemList.length;

    if ('loading' in HTMLImageElement.prototype) {
      // Native lazy loading IS supported, so set src-data to src
      this.loadItemsImmediately(this.itemList, false);
    } else {
      // Native lazy loading NOT supported, so handle via javascript
      // If browser doesn't support intersection observer, load the items immediately
      if (!('IntersectionObserver' in window)) {
        this.loadItemsImmediately(this.itemList);
      } else {
        // It is supported, load the items
        this.observer = new IntersectionObserver(onIntersection, this.observerConfig);

        this.itemList.forEach((item) => {
          if (item.classList.contains('dcf-lazy-loaded')) {
            // skip item
            return;
          }

          this.observer.observe(item);
        });
      }
    }
  }
}
