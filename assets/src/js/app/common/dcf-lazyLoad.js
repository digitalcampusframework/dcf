class LazyLoad {
  /**
   * class constructor
   * @param {itemList} nodelist of selected images and pictures
   * @param {observerConfig} object of intersectionObserver configuration
   * @param {classNames} array of classes applied
   */
  constructor(itemList, observerConfig, classNames) {
    this.itemList = itemList;
    this.observerConfig = observerConfig;
    this.classNames = classNames;
  }

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
    const sizes = image.dataset.sizes || this.pxTOvw(image.parentElement.clientWidth);

    if (!src) {
      return;
    }

    // Prevent this from being lazy loaded a second time.
    image.classList.add('dcf-lazy-loaded');
    src && (image.src = src);
    src && (image.removeAttribute('data-src'));
    srcset && (image.srcset = srcset);
    srcset && (image.removeAttribute('data-srcset'));
    sizes && (image.sizes = sizes);
    sizes && (image.removeAttribute('data-sizes'));
    this.classNames.length && this.classNames.forEach(className => image.classList.add(className));
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
    }

    return this.fetchImage(src, srcset, sizes).catch(err => `Image failed to fetch ${err.mes}`);
  };

  /**
   * Apply the picture
   * @param {string} picture: the picture element that we are targeting
   */
  applyPicture(picture) {
    // Prevent this from being lazy loaded a second time.
    picture.classList.add('dcf-lazy-loaded');

    // update picture source tags
    let pictureSources = picture.getElementsByTagName("SOURCE");
    for (let i = 0; i < pictureSources.length; i++) {
      const srcset = pictureSources[i].dataset.srcset || null;
      const sizes = pictureSources[i].dataset.sizes || this.pxTOvw(picture.parentElement.clientWidth);

      if (!srcset) {
        continue;
      }

      srcset && (pictureSources[i].srcset = srcset);
      srcset && (pictureSources[i].removeAttribute('data-srcset'));
      sizes && (pictureSources[i].sizes = sizes);
      sizes && (pictureSources[i].removeAttribute('data-sizes'));
      this.classNames.length && this.classNames.forEach(className => picture.classList.add(className));
    }
  };

  /**
   * Load all of the items immediately
   * @param {NodeListOf<Element>} items
   * @param {boolean} preload
   */
  loadItemsImmediately(items, preload = true) {
    // foreach() is not supported in IE
    for (let i = 0; i < items.length; i++) {
      switch(items[i].nodeName) {
        case 'IMG':
          if (preload === true) {
            this.preloadImage(items[i]);
          }
          this.applyImage(items[i]);
          break;

        case 'PICTURE':
          this.applyPicture(items[i]);
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
    if (this.observerEntryCount === 0) {
      this.observer.disconnect();
    }

    // Loop through the entries
    for (let i = 0; i < entries.length; i++) {
      let entry = entries[i];

      if (entry.target.nodeName == 'IMG') {
        if (entry.intersectionRatio > observer.thresholds[0] && entry.intersectionRatio < observer.thresholds[1]) {
          this.preloadImage(entry.target);
        } else if (entry.intersectionRatio > observer.thresholds[1]) {
          this.observerEntryCount--;
          this.applyImage(entry.target);
          this.observer.unobserve(entry.target);
        }
      } else if (entry.target.nodeName == 'PICTURE') {
        if (entry.intersectionRatio > observer.thresholds[1]) {
          this.observerEntryCount--;
          this.applyPicture(entry.target);
          this.observer.unobserve(entry.target);
        }
      }
    }
  };

  initialize() {

    if(!this.itemList) return;

    this.itemsCount = this.itemList.length;

    if (false && "loading" in HTMLImageElement.prototype) {
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
        for (let i = 0; i < this.itemList.length; i++) {
          let item = this.itemList[i];
          if (item.classList.contains('dcf-lazy-loaded')) {
            continue;
          }

          this.observer.observe(item);
        }
      }
    }
  }
}
