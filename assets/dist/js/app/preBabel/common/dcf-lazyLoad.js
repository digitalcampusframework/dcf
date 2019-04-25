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
	 * @param {imagesList} nodelist of selected images
	 * @param {observerConfig} object of intersectionObserver configuration
	 * @param {classNames} array of classes applied
	 */
	constructor(imagesList, observerConfig, classNames) {
		this.imagesList = imagesList;
		this.observerConfig = observerConfig;
		this.classNames = classNames; // add onEnter, onEnterActive?
	}

	/**
	 * Apply the image: preloaded image is loaded but not applied to actual image element
	 * @param {string} image: the image element that we are targetting
	 */
	applyImage(image) {
		const src = image.dataset.src;
		const srcset = image.dataset.srcset || null;

		if (!src) {
			throw new Error('No image src attribute provided');
		}

		// Prevent this from being lazy loaded a second time.
		image.classList.add('dcf-lazy-img-loaded');

		src && (image.src = src);
		src && (image.removeAttribute('data-src'));
		srcset && (image.srcset = srcset);
		srcset && (image.removeAttribute('data-srcset'));
		this.classNames.length && this.classNames.forEach(className => image.classList.add(className));
	};

	/**
	 * Fetches the image for the given source
	 * @param {string} src
	 * @param {string} srcset, defaults to null if not provided
	 */
	fetchImage(src, srcset = null) {
		return new Promise((resolve, reject) => {
			const image = new Image();
			src && (image.src = src);
			srcset && (image.srcset = srcset);

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

		if (!src) {
			throw new Error('No image src attribute provided');
		}

		return this.fetchImage(src, srcset).catch(err => `Image failed to fetch ${err.mes}`);
	};

	/**
	 * Load all of the images immediately
	 * @param {NodeListOf<Element>} images
	 */
	loadImagesImmediately(images) {
		// foreach() is not supported in IE
		for (let i = 0; i < images.length; i++) {
			let image = images[i];
			this.preloadImage(image);
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

			if (entry.intersectionRatio > observer.thresholds[0] && entry.intersectionRatio < observer.thresholds[1]) {
				this.preloadImage(entry.target);
			} else if (entry.intersectionRatio > observer.thresholds[1]) {
				this.imageCount--;
				this.applyImage(entry.target);
				this.observer.unobserve(entry.target);
			}
		}
	};


	initialize() {
		if(!this.imagesList) return;

		// counter: keeps track of which images that hasn't been loaded
		this.imageCount = this.imagesList.length;

		// If browser doesn't support intersection observer, load the images immediately
		if (!('IntersectionObserver' in window)) {
			this.loadImagesImmediately(this.imagesList);
		} else {
			// It is supported, load the images
			this.observer = new IntersectionObserver(this.onIntersection, this.observerConfig);

			// foreach() is not supported in IE
			for (let i = 0; i < this.imageCount; i++) {
				let image = this.imagesList[i];
				if (image.classList.contains('dcf-lazy-img-loaded')) {
					continue;
				}

				this.observer.observe(image);
			}
		}
	}
}


return LazyLoad;
}));
