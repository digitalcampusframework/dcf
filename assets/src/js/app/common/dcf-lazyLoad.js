class LazyLoad {
	constructor(imagesList, observerConfig, classNames) {
		this.imagesList = imagesList;
		this.observerConfig = observerConfig;
		this.classNames = classNames; // add onEnter, onEnterActive?
	}

	/**
	 * Apply the image
	 * @param {object} img
	 * @param {string} src
	 */
	applyImage(img, src, srcset = null) {
		// Prevent this from being lazy loaded a second time.
		img.classList.add('dcf-lazy-img-handled');
		img.src = src;
		src && (img.removeAttribute('data-src'));
		srcset && (img.srcset = srcset);
		srcset && (img.removeAttribute('data-srcset'));
		this.classNames.length && this.classNames.forEach(className => img.classList.add(className));
		// img.classList.add('dcf-fade-up');
	};

	/**
	 * Fetches the image for the given URL
	 * @param {string} url
	 */
	fetchImage() {
		return new Promise((resolve, reject) => {
			const image = new Image();
			// image.src = url;
			arguments[0] && (image.src = arguments[0]);
			arguments[1] && (image.srcset = arguments[1]);

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
			return;
		}

		return this.fetchImage(src, srcset).then(() => {
			this.applyImage(image, src, srcset);
		}).catch(err => `Image failed to fetch ${err.mes}`);
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
	 * @param {array} entries
	 */
	onIntersection = (entries) => {
		// Disconnect if we've already loaded all of the images
		if (this.imageCount === 0) {
			this.observer.disconnect();
		}

		// Loop through the entries
		for (let i = 0; i < entries.length; i++) {
			let entry = entries[i];
			// Are we in viewport?
			if (entry.intersectionRatio > 0) {
				this.imageCount--;

				// Stop watching and load the image
				this.observer.unobserve(entry.target);
				this.preloadImage(entry.target);
			}
		}
	};


	initialize() {
		if(!this.imagesList) return;
		this.imageCount = this.imagesList.length;

		// If we don't have support for intersection observer, loads the images immediately
		if (!('IntersectionObserver' in window)) {
			this.loadImagesImmediately(this.imagesList);
		} else {
			// It is supported, load the images
			this.observer = new IntersectionObserver(this.onIntersection, this.observerConfig);

			// foreach() is not supported in IE
			for (let i = 0; i < this.imageCount; i++) {
				let image = this.imagesList[i];
				if (image.classList.contains('dcf-lazy-img-handled')) {
					continue;
				}

				this.observer.observe(image);
			}
		}
	}
}

