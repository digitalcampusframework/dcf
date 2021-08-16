import { DCFUtility } from './dcf-utility';

class SlideshowObj {
  constructor(slideshow, slideshowIndex, source) {
    this.slideshow = slideshow;
    this.slideshowIndex = slideshowIndex;
    this.source = source;
    this.theme = this.source.theme;
    this.scrollInterval = null;
    this.scrollRate = 3000;
    if (this.slideshow.dataset.rate) {
      this.scrollRate = this.slideshow.dataset.rate;
    }
    this.paused = true;
    this.userPaused = true;
    this.paused = true;
    this.slideDeck = this.slideshow.querySelector('ul');
    this.uuid = DCFUtility.uuidv4();
    this.slideTransition = this.slideshow.dataset.transition;
    this.slideshowName = `Slideshow ${this.slideshowIndex}`;
    this.slideAriaLabel = this.slideshow.getAttribute('aria-label');
    if (this.slideAriaLabel) {
      this.slideshowName = this.slideAriaLabel;
    }

    // Set a unique ID for each slideshow
    this.slideshow.setAttribute('id', this.uuid.concat('-slideshow'));

    // Set slideshow tabindex
    this.slideDeck.setAttribute('tabindex', '0');

    // Add classes to slideshow unordered lists
    this.slideDeck.classList.add('dcf-slide-deck');

    // Listeners
    const eventPause = () => {
      if (!this.paused) {
        this.pause();
      }
    };
    this.slideDeck.addEventListener('mouseover', eventPause.bind(this.slideDeck), false);

    const eventPlay = () => {
      if (this.paused && !this.userPaused) {
        this.play();
      }
    };
    this.slideDeck.addEventListener('mouseout', eventPlay.bind(this.slideDeck), false);

    this.slideDeck.addEventListener('keydown', (keydownEvent) => {
      const slideDeck = keydownEvent.target;
      if (DCFUtility.isKeyEvent(keydownEvent, DCFUtility.keyEvents('arrowDown')) ||
        DCFUtility.isKeyEvent(keydownEvent, DCFUtility.keyEvents('keyC'))) {
        const visibleSlide = slideDeck.querySelector('.dcf-visible');
        if (visibleSlide) {
          const captionBtn = visibleSlide.querySelector('figure button');
          if (captionBtn) {
            captionBtn.focus();
            if (DCFUtility.isKeyEvent(keydownEvent, DCFUtility.keyEvents('keyC'))) {
              captionBtn.click();
            }
            keydownEvent.preventDefault();
          }
        }
      } else if (DCFUtility.isKeyEvent(keydownEvent, DCFUtility.keyEvents('arrowLeft'))) {
        keydownEvent.preventDefault();
        this.showSlide('previous');
      } else if (DCFUtility.isKeyEvent(keydownEvent, DCFUtility.keyEvents('arrowRight'))) {
        keydownEvent.preventDefault();
        this.showSlide('next');
      }
    }, false);
  }

  pause() {
    this.paused = true;
    clearInterval(this.scrollInterval);
  }

  play() {
    this.paused = false;
    this.scrollInterval = setInterval(this.scroll.bind(this), this.scrollRate);
  }

  firstSlide() {
    return this.slides[DCFUtility.magicNumbers('int0')];
  }

  lastSlide() {
    const index = this.slides.length > DCFUtility.magicNumbers('int1') ?
      this.slides.length - DCFUtility.magicNumbers('int1') : DCFUtility.magicNumbers('int0');
    return this.slides[index];
  }

  scroll() {
    const visible = this.slideshow.querySelectorAll('.dcf-visible');
    if (visible[DCFUtility.magicNumbers('int0')].nextElementSibling) {
      this.showSlide('next');
    } else {
      // At end of slides, so show first
      if (this.slideTransition) {
        const currentSlide = visible[DCFUtility.magicNumbers('int0')];
        this.toggleSlideTransition(currentSlide, this.firstSlide());
      }
      this.scrollIt(this.firstSlide());
    }
  }

  shuffleSlides() {
    let currentIndex = this.slides.length;
    let slideContent = '';
    let randomIndex = DCFUtility.magicNumbers('int0');
    while (DCFUtility.magicNumbers('int0') !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex = currentIndex - DCFUtility.magicNumbers('int1');
      slideContent = this.slides[currentIndex].innerHTML;
      this.slides[currentIndex].innerHTML = this.slides[randomIndex].innerHTML;
      this.slides[randomIndex].innerHTML = slideContent;
    }
  }

  initTransitionPanel() {
    if (!this.slideTransition) {
      return;
    }
    this.panel = document.createElement('div');

    // Add classes to panel
    this.panel.classList.add('dcf-slideshow-transition-panel',
      'dcf-invisible',
      'dcf-absolute',
      'dcf-vh-100%',
      'dcf-vw-100%',
      'dcf-overflow-hidden');

    // Add role and aria-label to controls group
    this.panel.setAttribute('aria-hidden', 'true');
    this.panel.setAttribute('style', 'top: 0; left:0');

    this.theme.slideToggleTransition(this.panel);
    this.slideshow.appendChild(this.panel);
  }

  initControls() {
    // Create slideshow controls (previous/next slide buttons)
    let ctrls = document.createElement('ul');
    this.ctrlPrevious = document.createElement('li');
    this.ctrlNext = document.createElement('li');
    this.ctrlPreviousButton = document.createElement('button');
    this.ctrlNextButton = document.createElement('button');

    this.allowPlay = this.slideshow.hasAttribute('data-play') &&
      (this.slideshow.dataset.play.toLowerCase() === 'true' || this.slideshow.dataset.play.toLowerCase() === 'auto');
    if (this.allowPlay) {
      this.ctrlPlayToggle = document.createElement('li');
      this.ctrlPlayToggleButton = document.createElement('button');
      this.ctrlPlayToggleButton.classList.add('dcf-btn', 'dcf-btn-primary', 'dcf-btn-slide', 'dcf-btn-slide-prev');
      if (this.theme.slidePlayToggleBtnClassList) {
        this.ctrlPlayToggleButton.classList.add(...this.theme.slidePlayToggleBtnClassList);
      }
      if (this.theme.slideBtnClassList) {
        this.ctrlPlayToggleButton.classList.add(...this.theme.slideBtnClassList);
      }
      if (this.theme.slidePlayBtnInnerHTML) {
        this.ctrlPlayToggleButton.innerHTML = this.theme.slidePlayBtnInnerHTML;
      }
      this.ctrlPlayToggleButton.setAttribute('aria-label', `${this.slideshowName} play toggle`);

      this.ctrlPlayToggle.setAttribute('id', this.uuid.concat('-play-toggle'));
      this.ctrlPlayToggle.classList.add('dcf-li-slide-play-toggle');

      this.ctrlPlayToggle.appendChild(this.ctrlPlayToggleButton);

      this.ctrlPlayToggleButton.addEventListener('click', () => {
        if (!this.paused) {
          this.pause();
          this.userPaused = true;
        } else {
          this.play();
          this.userPaused = false;
        }
        this.ctrlPlayToggleButton.innerHTML = this.paused ? this.theme.slidePlayBtnInnerHTML : this.theme.slidePauseBtnInnerHTML;
      }, false);

      this.ctrlPlayToggleButton.addEventListener('keydown', (keydownEvent) => {
        if (DCFUtility.isKeyEvent(keydownEvent, DCFUtility.keyEvents('arrowUp'))) {
          keydownEvent.preventDefault();
          this.slideDeck.focus();
        }
      }, false);
    }

    // Add classes to slideshow controls group (Keep in DCF)
    ctrls.classList.add('dcf-slideshow-controls',
      'dcf-list-bare',
      'dcf-btn-group',
      'dcf-absolute',
      'dcf-pin-right',
      'dcf-pin-bottom',
      'dcf-z-1');

    // Add role and aria-label to controls group
    ctrls.setAttribute('aria-label', `${this.slideshowName} controls`);
    ctrls.setAttribute('role', 'list');

    this.ctrlPreviousButton.classList.add('dcf-btn', 'dcf-btn-primary', 'dcf-btn-slide', 'dcf-btn-slide-prev');
    if (this.theme.slidePrevBtnClassList) {
      this.ctrlPreviousButton.classList.add(...this.theme.slidePrevBtnClassList);
    }
    if (this.theme.slideBtnClassList) {
      this.ctrlPreviousButton.classList.add(...this.theme.slideBtnClassList);
    }
    if (this.theme.slidePrevBtnInnerHTML) {
      this.ctrlPreviousButton.innerHTML = this.theme.slidePrevBtnInnerHTML;
    }
    this.ctrlPreviousButton.setAttribute('aria-label', `${this.slideshowName} previous`);

    this.ctrlNextButton.classList.add('dcf-btn', 'dcf-btn-primary', 'dcf-btn-slide', 'dcf-btn-slide-next');
    if (this.theme.slideNextBtnClassList) {
      this.ctrlNextButton.classList.add(...this.theme.slideNextBtnClassList);
    }
    if (this.theme.slideBtnClassList) {
      this.ctrlNextButton.classList.add(...this.theme.slideBtnClassList);
    }
    if (this.theme.slideNextBtnInnerHTML) {
      this.ctrlNextButton.innerHTML = this.theme.slideNextBtnInnerHTML;
    }
    this.ctrlNextButton.setAttribute('aria-label', `${this.slideshowName} next`);

    this.ctrlPrevious.setAttribute('id', this.uuid.concat('-previous'));
    this.ctrlPrevious.classList.add('dcf-li-slide-prev');
    this.ctrlNext.setAttribute('id', this.uuid.concat('-next'));
    this.ctrlNext.classList.add('dcf-li-slide-next');

    // Add relative class for absolute positioning of slideshow controls
    this.slideshow.classList.add('dcf-relative');

    // Append controls (previous/next slide) to slideshow
    this.ctrlPrevious.appendChild(this.ctrlPreviousButton);
    this.ctrlNext.appendChild(this.ctrlNextButton);
    ctrls.appendChild(this.ctrlPrevious);
    if (this.allowPlay) {
      ctrls.appendChild(this.ctrlPlayToggle);
    }
    ctrls.appendChild(this.ctrlNext);
    this.slideshow.appendChild(ctrls);

    if (this.allowPlay && this.slideshow.dataset.play.toLowerCase() === 'auto') {
      this.ctrlPlayToggleButton.click();
    }

    this.ctrlPrevious.addEventListener('click', () => {
      this.showSlide('previous');
    }, false);

    this.ctrlPrevious.addEventListener('keydown', (keydownEvent) => {
      if (DCFUtility.isKeyEvent(keydownEvent, DCFUtility.keyEvents('arrowUp'))) {
        keydownEvent.preventDefault();
        this.slideDeck.focus();
      }
    }, false);

    this.ctrlNext.addEventListener('click', () => {
      this.showSlide('next');
    }, false);

    this.ctrlNext.addEventListener('keydown', (keydownEvent) => {
      if (DCFUtility.isKeyEvent(keydownEvent, DCFUtility.keyEvents('arrowUp'))) {
        keydownEvent.preventDefault();
        this.slideDeck.focus();
      }
    }, false);
  }

  initSlides() {
    Array.prototype.forEach.call(this.slides, (slide, slideIndex) => {
      slide.setAttribute('id', this.uuid.concat('-slide-', slideIndex));
      slide.classList.add('dcf-slide', 'dcf-relative');

      // Add Theme Events to slide
      if (this.theme.slideToggleTransition) {
        this.theme.slideToggleTransition(slide);
      }

      let figure = slide.querySelector('figure');
      if (figure) {
        let caption = figure.querySelector('figcaption');
        if (!(typeof caption == 'undefined')) {
          // Create button to show/hide caption
          let captionBtn = document.createElement('button');
          if (this.theme.figureCaptionBtnInnerHTML) {
            captionBtn.innerHTML = this.theme.figureCaptionBtnInnerHTML;
          }

          // Add classes to each caption toggle button
          captionBtn.classList.add('dcf-btn', 'dcf-btn-slide', 'dcf-btn-slide-caption');
          if (this.theme.slideBtnClassList) {
            captionBtn.classList.add(...this.theme.slideBtnClassList);
          }

          // Create a unique ID for each caption toggle button
          captionBtn.setAttribute('id', this.uuid.concat('-button-', slideIndex));
          captionBtn.setAttribute('tabindex', '-1');

          // Add ARIA attributes to each caption toggle button
          captionBtn.setAttribute('aria-controls', this.uuid.concat('-caption-', slideIndex));
          captionBtn.setAttribute('aria-label', `${this.slideshowName} Show caption`);
          captionBtn.setAttribute('aria-expanded', 'false');

          // Add class to each figure
          figure.classList.add('dcf-slide-figure');

          // Append caption toggle button to each figure
          figure.appendChild(captionBtn);

          // Add Events to caption toggle button
          this.captionBtnEvents(captionBtn);

          // Add Theme Events to caption toggle button
          if (this.theme.figureCaptionToggleTransition) {
            this.theme.figureCaptionToggleTransition(captionBtn);
          }

          // Style each caption
          // Might be something here!!!!!
          caption.classList.add('dcf-opacity-0',
            'dcf-pointer-events-none',
            'dcf-invisible',
            'dcf-slide-caption',
            'dcf-figcaption');

          // Create a unique ID for each caption
          caption.setAttribute('id', this.uuid.concat('-caption-', slideIndex));

          // Add ARIA attributes to each caption
          caption.setAttribute('aria-labelledby', this.uuid.concat('-button-', slideIndex));
          caption.setAttribute('aria-hidden', 'true');
        }
      }
    });
  }

  slideObserverInit() {
    // onIntersection callback function
    /* eslint func-style: ["error", "declaration", { "allowArrowFunctions": true }] */
    let onIntersection = (entries) => {
      Array.prototype.forEach.call(entries, (entry) => {
        if (!entry.intersectionRatio > DCFUtility.magicNumbers('int0')) {
          entry.target.classList.remove('dcf-visible');
          return;
        }
        let img = entry.target.querySelector('img');
        if (img) {
          this.lazyLoadImage(img);
        }
        entry.target.classList.add('dcf-visible');
      });
    };

    // set observer for slides
    const observerSettings = {
      root: this.slideshow,
      rootMargin: '-10px'
    };

    if ('IntersectionObserver' in window) {
      let observer = new IntersectionObserver(onIntersection, observerSettings);
      Array.prototype.forEach.call(this.slides, (elem) => {
        observer.observe(elem);
      });
    } else {
      Array.prototype.forEach.call(this.slides, (slide) => {
        let img = slide.querySelector('img');
        if (img) {
          this.lazyLoadImage(img);
        }
        slide.classList.add('dcf-visible');
      });
    }
  }

  // Caption visibility transition
  captionTransition(event) {
    // Remove event listener and toggle visibility after caption has closed
    event.removeEventListener('transitionend', this.captionTransition, true);
    // Check if caption is already visible
    if (!event.classList.contains('dcf-invisible')) {
      // Add class to hide caption
      event.classList.add('dcf-invisible');
    }
  }

  // Add classes to the caption & button
  captionClasses(button, caption) {
    // Check if caption is already visible
    if (!caption.classList.contains('dcf-invisible')) {
      // Hide content
      caption.addEventListener('transitionend', this.captionTransition(caption), true);
      // Update ARIA attributes
      button.setAttribute('aria-expanded', 'false');
      button.setAttribute('aria-label', 'Show caption');
      caption.setAttribute('aria-hidden', 'true');
      caption.classList.remove('dcf-opacity-1', 'dcf-pointer-events-auto');
      caption.classList.add('dcf-opacity-0', 'dcf-pointer-events-none', 'dcf-invisible');
      caption.dispatchEvent(this.source.openCaptionEvent);
    } else {
      // Remove class to show content
      caption.classList.remove('dcf-invisible');
      // Update ARIA attributes
      button.setAttribute('aria-expanded', 'true');
      button.setAttribute('aria-label', 'Hide caption');
      caption.setAttribute('aria-hidden', 'false');
      caption.classList.remove('dcf-invisible', 'dcf-opacity-0', 'dcf-pointer-events-none');
      caption.classList.add('dcf-opacity-1', 'dcf-pointer-events-auto');
      caption.dispatchEvent(this.source.closeCaptionEvent);
    }
  }

  captionBtnEvents(button) {
    const caption = button.previousElementSibling;
    // Handle Click
    button.addEventListener('click', (onClick) => {
      this.captionClasses(onClick.currentTarget, caption);
      onClick.preventDefault();
    }, false);

    // Show caption when the 'space' key is pressed
    button.addEventListener('keydown', (keydownEvent) => {
      if (DCFUtility.isKeyEvent(keydownEvent, DCFUtility.keyEvents('space'))) {
        keydownEvent.preventDefault();
        this.captionClasses(keydownEvent.currentTarget, caption);
      } else if (DCFUtility.isKeyEvent(keydownEvent, DCFUtility.keyEvents('arrowUp')) ||
        DCFUtility.isKeyEvent(keydownEvent, DCFUtility.keyEvents('tab'))) {
        keydownEvent.preventDefault();
        if (!caption.classList.contains('dcf-invisible')) {
          this.captionClasses(keydownEvent.currentTarget, caption);
        }
        this.slideDeck.focus();
      } else if (DCFUtility.isKeyEvent(keydownEvent, DCFUtility.keyEvents('arrowDown'))) {
        keydownEvent.preventDefault();
      } else if (DCFUtility.isKeyEvent(keydownEvent, DCFUtility.keyEvents('arrowLeft')) ||
        DCFUtility.isKeyEvent(keydownEvent, DCFUtility.keyEvents('arrowRight'))) {
        this.slideDeck.focus();
      }
    }, false);
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

  lazyLoadImage(image) {
    const src = image.dataset.src;
    const srcset = image.dataset.srcset || null;
    let sizes = null;

    if (!src) {
      return;
    }

    // Process parent picture lazy load if image is child of a picture
    if (image.parentNode.nodeName === 'PICTURE') {
      this.applyPicture(image.parentNode);
      sizes = image.dataset.sizes || this.pxTOvw(image.parentNode.parentElement.clientWidth);
    } else {
      sizes = image.dataset.sizes || this.pxTOvw(image.parentElement.clientWidth);
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
  }

  transitionPromise(hideSlide, showSlide) {
    return new Promise((resolve) => {
      this.panel.innerHTML = hideSlide.innerHTML;
      this.panel.classList.remove('dcf-invisible');
      this.scrollIt(showSlide);
      this.panel.dispatchEvent(this.source.hideSlideEvent);
      showSlide.dispatchEvent(this.source.showSlideEvent);
      setTimeout(() => {
        resolve();
      }, this.source.theme.slideToggleTransitionDuration);
    }).then(() => {
      this.panel.innerHTML = '';
      this.panel.classList.add('dcf-invisible');
    });
  }

  toggleSlideTransition(hideSlide, showSlide) {
    this.transitionPromise(hideSlide, showSlide);
  }

  scrollIt(slideToShow) {
    const scrollPos = Array.prototype.indexOf.call(this.slides, slideToShow) *
      (this.slideDeck.scrollWidth / this.slides.length);
    this.slideDeck.scrollLeft = scrollPos;
  }

  showSlide(dir) {
    const visible = this.slideshow.querySelectorAll('.dcf-visible');
    const index = dir === 'previous' ? DCFUtility.magicNumbers('int0') : DCFUtility.magicNumbers('int1');

    if (visible.length > DCFUtility.magicNumbers('int1')) {
      this.scrollIt(visible[index]);
    } else {
      const newSlide = index === DCFUtility.magicNumbers('int0') ?
        visible[DCFUtility.magicNumbers('int0')].previousElementSibling :
        visible[DCFUtility.magicNumbers('int0')].nextElementSibling;
      if (newSlide) {
        if (this.slideTransition) {
          const currentSlide = visible[DCFUtility.magicNumbers('int0')];
          this.toggleSlideTransition(currentSlide, newSlide);
        } else {
          this.scrollIt(newSlide);
        }
      }
    }
  }
}

export class DCFSlideshow {
  constructor(slideshows, theme) {
    this.slideshows = slideshows;
    if (theme instanceof DCFSlideshowTheme) {
      this.theme = theme;
    } else {
      this.theme = new DCFSlideshowTheme();
    }
    this.openCaptionEvent = new Event(DCFSlideshow.events('openCaption'));
    this.closeCaptionEvent = new Event(DCFSlideshow.events('closeCaption'));
    this.showSlideEvent = new Event(DCFSlideshow.events('showSlide'));
    this.hideSlideEvent = new Event(DCFSlideshow.events('hideSlide'));
  }

  static events(name) {
    const events = {
      openCaption: 'openCaption',
      closeCaption: 'closeCaption',
      showSlide: 'showSlide',
      hideSlide: 'hideSlide'
    };
    Object.freeze(events);

    return name in events ? events[name] : undefined;
  }

  initialize() {
    Array.prototype.forEach.call(this.slideshows, (slideshow, slideshowIndex) => {
      const slideShow = new SlideshowObj(slideshow, slideshowIndex, this);
      if (slideShow instanceof SlideshowObj) {
        slideShow.initTransitionPanel();
        slideShow.initControls();
        slideShow.slides = this.slideDeck.querySelectorAll('li');
        if (slideShow.slideshow.hasAttribute('data-shuffle') && this.slideshow.dataset.shuffle.toLowerCase() === 'true') {
          slideShow.shuffleSlides();
        }
        slideShow.slideObserverInit();
        slideShow.initSlides();
      }
    });
  }
}
