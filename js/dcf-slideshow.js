import { DCFUtility } from './dcf-utility';
import { DCFFigcaptionToggleTheme, DCFFigcaptionToggle } from './dcf-figcaption-toggle';

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
    this.slideTransition = null; // disable transitions for now
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
    let ctrls = document.createElement('div');
    this.ctrlPrevBtn = document.createElement('button');
    this.ctrlNextBtn = document.createElement('button');

    this.allowPlay = this.slideshow.hasAttribute('data-play') &&
      (this.slideshow.dataset.play.toLowerCase() === 'true' || this.slideshow.dataset.play.toLowerCase() === 'auto');
    if (this.allowPlay) {
      this.ctrlPlayToggleBtn = document.createElement('button');
      this.ctrlPlayToggleBtn.classList.add('dcf-btn', 'dcf-btn-primary', 'dcf-btn-slide', 'dcf-btn-slide-prev');
      if (this.theme.slidePlayToggleBtnClassList) {
        this.ctrlPlayToggleBtn.classList.add(...this.theme.slidePlayToggleBtnClassList);
      }
      if (this.theme.slideBtnClassList) {
        this.ctrlPlayToggleBtn.classList.add(...this.theme.slideBtnClassList);
      }
      if (this.theme.slidePlayBtnInnerHTML) {
        this.ctrlPlayToggleBtn.innerHTML = this.theme.slidePlayBtnInnerHTML;
      }
      this.ctrlPlayToggleBtn.setAttribute('aria-label', `${this.slideshowName} play toggle`);

      this.ctrlPlayToggleBtn.setAttribute('id', this.uuid.concat('-play-toggle'));

      this.ctrlPlayToggleBtn.addEventListener('click', () => {
        if (!this.paused) {
          this.pause();
          this.userPaused = true;
        } else {
          this.play();
          this.userPaused = false;
        }
        this.ctrlPlayToggleBtn.innerHTML = this.paused ? this.theme.slidePlayBtnInnerHTML : this.theme.slidePauseBtnInnerHTML;
      }, false);

      this.ctrlPlayToggleBtn.addEventListener('keydown', (keydownEvent) => {
        if (DCFUtility.isKeyEvent(keydownEvent, DCFUtility.keyEvents('arrowUp'))) {
          keydownEvent.preventDefault();
          this.slideDeck.focus();
        }
      }, false);
    }

    // Add classes to slideshow controls group (Keep in DCF)
    ctrls.classList.add('dcf-slideshow-controls',
      'dcf-btn-group',
      'dcf-absolute',
      'dcf-right-0',
      'dcf-z-1');

    // If data-toggle-caption is false then move it to the top
    if (this.slideshow.getAttribute('data-toggle-caption') === 'false') {
      ctrls.classList.add('dcf-top-0');
    } else {
      ctrls.classList.add('dcf-bottom-0');
    }

    // Add role and aria-label to controls group
    ctrls.setAttribute('aria-label', `${this.slideshowName} controls`);
    ctrls.setAttribute('role', 'group');

    this.ctrlPrevBtn.classList.add('dcf-btn', 'dcf-btn-primary', 'dcf-btn-slide', 'dcf-btn-slide-prev');
    if (this.theme.slidePrevBtnClassList) {
      this.ctrlPrevBtn.classList.add(...this.theme.slidePrevBtnClassList);
    }
    if (this.theme.slideBtnClassList) {
      this.ctrlPrevBtn.classList.add(...this.theme.slideBtnClassList);
    }
    if (this.theme.slidePrevBtnInnerHTML) {
      this.ctrlPrevBtn.innerHTML = this.theme.slidePrevBtnInnerHTML;
    }
    this.ctrlPrevBtn.setAttribute('id', this.uuid.concat('-previous'));
    this.ctrlPrevBtn.setAttribute('aria-label', `${this.slideshowName} previous`);

    this.ctrlNextBtn.classList.add('dcf-btn', 'dcf-btn-primary', 'dcf-btn-slide', 'dcf-btn-slide-next');
    if (this.theme.slideNextBtnClassList) {
      this.ctrlNextBtn.classList.add(...this.theme.slideNextBtnClassList);
    }
    if (this.theme.slideBtnClassList) {
      this.ctrlNextBtn.classList.add(...this.theme.slideBtnClassList);
    }
    if (this.theme.slideNextBtnInnerHTML) {
      this.ctrlNextBtn.innerHTML = this.theme.slideNextBtnInnerHTML;
    }
    this.ctrlNextBtn.setAttribute('id', this.uuid.concat('-next'));
    this.ctrlNextBtn.setAttribute('aria-label', `${this.slideshowName} next`);

    // Add relative class for absolute positioning of slideshow controls
    this.slideshow.classList.add('dcf-relative');

    // Append controls (previous/next slide) to slideshow
    ctrls.appendChild(this.ctrlPrevBtn);
    if (this.allowPlay) {
      ctrls.appendChild(this.ctrlPlayToggleBtn);
    }
    ctrls.appendChild(this.ctrlNextBtn);
    this.slideshow.appendChild(ctrls);

    if (this.allowPlay && this.slideshow.dataset.play.toLowerCase() === 'auto') {
      this.ctrlPlayToggleBtn.click();
    }

    this.ctrlPrevBtn.addEventListener('click', () => {
      this.showSlide('previous');
    }, false);

    this.ctrlPrevBtn.addEventListener('keydown', (keydownEvent) => {
      if (DCFUtility.isKeyEvent(keydownEvent, DCFUtility.keyEvents('arrowUp'))) {
        keydownEvent.preventDefault();
        this.slideDeck.focus();
      }
    }, false);

    this.ctrlNextBtn.addEventListener('click', () => {
      this.showSlide('next');
    }, false);

    this.ctrlNextBtn.addEventListener('keydown', (keydownEvent) => {
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

      let figure = slide.querySelector('figure');
      if (figure) {
        let caption = figure.querySelector('figcaption');
        if (!(typeof caption == 'undefined')) {
          // Create button to show/hide caption if data-toggle-caption is true
          if (!(this.slideshow.getAttribute('data-toggle-caption') === 'false')) {
            // Set caption id
            caption.setAttribute('id', this.uuid.concat('-caption-', slideIndex));

            // Create an customize theme
            const figcaptionToggleTheme = new DCFFigcaptionToggleTheme();
            figcaptionToggleTheme.setThemeVariable('toggleButtonInnerHTML', this.theme.figureCaptionBtnInnerHTML);
            figcaptionToggleTheme.setThemeVariable('toggleButtonClassList', this.theme.figureCaptionBtnClassList);
            figcaptionToggleTheme.setThemeVariable('figcaptionClassList', this.theme.captionClassList);

            // Initialize figcaption
            const figcaptionToggleObj = new DCFFigcaptionToggle(caption, figcaptionToggleTheme, {
              offKeys: [ 'arrowUp', 'tab' ]
            });
            figcaptionToggleObj.initialize();

            // Add class to each figure
            figure.classList.add('dcf-slide-figure');

            // Get the toggle button and add events to it
            const captionBtn = figure.querySelector('.dcf-btn-slide-caption');
            captionBtn.setAttribute('tabindex', '-1');
            if (captionBtn === null) {
              throw new Error('Error Initializing Toggle Caption, Missing Button');
            }
            this.captionBtnEvents(captionBtn);
          }
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
        // Fetch
        // img.setAttribute('fetchpriority', 'low');
        if (img) {
          this.lazyLoadImage(img);
        }
        slide.classList.add('dcf-visible');
      });
    }
  }

  captionBtnEvents(button) {
    button.addEventListener('keydown', (keydownEvent) => {
      if (DCFUtility.isKeyEvent(keydownEvent, DCFUtility.keyEvents('arrowDown'))) {
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

export class DCFSlideshowTheme {
  constructor() {
    // Defaults
    this.slideBtnClassList = [ 'dcf-d-flex', 'dcf-ai-center', 'dcf-pt-4', 'dcf-pb-4', 'dcf-white' ];

    this.slidePrevBtnClassList = [ 'dcf-d-flex', 'dcf-ai-center', 'dcf-pt-4', 'dcf-pb-4', 'dcf-inverse' ];
    this.slidePrevBtnInnerHTML = `<svg class="dcf-h-4 dcf-w-4 dcf-fill-current" width="24"
height="24" viewBox="0 0 24 24" focusable="false" aria-hidden="true">
    <path d="M23.509
    9.856c-.38-.55-.928-.852-1.542-.852H9.74l4.311-4.151c.995-.994.961-2.646-.074-3.682-1.001-1-2.722-1.033-3.68-.077L.148
    11.144a.5.5 0 00-.003.707l9.978 10.079a2.445 2.445 0 001.737.705c.707 0 1.407-.294 1.92-.806a2.737 2.737 0 00.807-1.923
    2.431 2.431 0
    00-.708-1.733l-4.156-4.16h12.276c.618 0 1.161-.302 1.53-.851.304-.451.471-1.041.471-1.658 0-.596-.179-1.196-.491-1.648z"></path>
</svg>`;

    this.slideNextBtnClassList = [ 'dcf-d-flex', 'dcf-ai-center', 'dcf-pt-4', 'dcf-pb-4', 'dcf-inverse' ];
    this.slideNextBtnInnerHTML = `<svg class="dcf-h-4 dcf-w-4 dcf-fill-current" width="24"
height="24" viewBox="0 0 24 24" focusable="false" aria-hidden="true">
    <path d="M23.852 11.144L13.703 1.096c-.96-.96-2.678-.924-3.68.075-1.036 1.035-1.07 2.687-.069 3.69l4.321
    4.143H2.03c-1.27 0-2.03 1.272-2.03 2.5 0 .617.168 1.207.472 1.659.369.549.913.851 1.53.851h12.276l-4.156 4.16a2.425
    2.425 0 00-.708 1.734c0 .708.293 1.409.807 1.922a2.738 2.738 0 001.919.806c.664 0 1.28-.251
    1.739-.708l9.977-10.076a.502.502 0 00-.004-.708z"></path>
</svg>`;

    this.slidePlayToggleBtnClassList = [ 'dcf-d-flex', 'dcf-ai-center', 'dcf-pt-4', 'dcf-pb-4', 'dcf-inverse' ];
    this.slidePlayBtnInnerHTML = `<svg class="dcf-h-4 dcf-w-4 dcf-fill-current" width="24"
height="24" viewBox="0 0 24 24" focusable="false" aria-hidden="true">
    <path d="M21.759 11.577L2.786.077a.499.499 0 0 0-.759.428v23a.498.498
      0 0 0 .5.5c.09 0 .18-.024.259-.072l18.973-11.5a.5.5 0 0 0 0-.856z"></path>
</svg>`;
    this.slidePauseBtnInnerHTML = `<svg class="dcf-h-4 dcf-w-4 dcf-fill-current" width="24" height="24"
viewBox="0 0 24 24" focusable="false" aria-hidden="true">
    <path d="M10.5 0h-5C5.224 0 5 .224 5 .5v23C5 23.776 5.224 24 5.5 24h5c.276 0 .5-.224.5-.5v-23C11 .224 10.776 0 10.5
    0zM18.5 0h-5C13.224 0 13 .224 13 .5v23c0 .276.224.5.5.5h5c.276 0 .5-.224.5-.5v-23C19 .224 18.776 0 18.5 0z"></path>
</svg>`;

    this.captionClassList = [
      'dcf-absolute',
      'dcf-left-0',
      'dcf-top-0',
      'dcf-h-100%',
      'dcf-w-100%',
      'dcf-z-1',
      'dcf-slide-caption'
    ];

    this.figureCaptionBtnClassList = [
      'dcf-btn',
      'dcf-btn-inverse-tertiary',
      'dcf-absolute',
      'dcf-z-1',
      'dcf-d-flex',
      'dcf-ai-center',
      'dcf-pt-4',
      'dcf-pb-4',
      'dcf-white',
      'dcf-btn-slide',
      'dcf-btn-slide-caption'
    ];

    this.figureCaptionBtnInnerHTML = `<svg class="dcf-h-4 dcf-w-4 dcf-fill-current"
        width="24" height="24" viewBox="0 0 24 24" focusable="false" aria-hidden="true">
      <path class="theme-icon-slide-caption-open"
        d="M1,3h19c0.6,0,1-0.4,1-1c0-0.6-0.4-1-1-1H1C0.4,1,0,1.4,0,2C0,2.6,0.4,3,1,3z"/>
        '<path class="theme-icon-slide-caption-open"
        d="M1,8h15c0.6,0,1-0.4,1-1c0-0.6-0.4-1-1-1H1C0.4,6,0,6.4,0,7C0,7.6,0.4,8,1,8z"/>
      <path class="theme-icon-slide-caption-close-1"
        d="M1,13h22c0.6,0,1-0.4,1-1c0-0.6-0.4-1-1-1H1c-0.6,0-1,0.4-1,1C0,12.6,0.4,13,1,13z"/>
      <path class="theme-icon-slide-caption-close-2"
        d="M1,13h22c0.6,0,1-0.4,1-1c0-0.6-0.4-1-1-1H1c-0.6,0-1,0.4-1,1C0,12.6,0.4,13,1,13z"/>
      <path class="theme-icon-slide-caption-open"
        d="M1,18h18c0.6,0,1-0.4,1-1c0-0.6-0.4-1-1-1H1c-0.6,0-1,0.4-1,1C0,17.6,0.4,18,1,18z"/>
      <path class="theme-icon-slide-caption-open"
        d="M1,23h15c0.6,0,1-0.4,1-1c0-0.6-0.4-1-1-1H1c-0.6,0-1,0.4-1,1C0,22.6,0.4,23,1,23z"/>
      </svg>`;
  }

  setThemeVariable(themeVariableName, value) {
    if (themeVariableName in this && typeof value == typeof this[themeVariableName]) {
      this[themeVariableName] = value;
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
  }

  static events(name) {
    const events = {

    };
    Object.freeze(events);

    if (DCFFigcaptionToggle.events(name) !== undefined) {
      return DCFFigcaptionToggle.events(name);
    }

    return name in events ? events[name] : undefined;
  }

  initialize() {
    Array.prototype.forEach.call(this.slideshows, (slideshow, slideshowIndex) => {
      const slideShow = new SlideshowObj(slideshow, slideshowIndex, this);
      if (slideShow instanceof SlideshowObj) {
        slideShow.initTransitionPanel();
        slideShow.initControls();
        slideShow.slides = slideShow.slideDeck.querySelectorAll('li');
        if (slideShow.slideshow.hasAttribute('data-shuffle') && slideShow.slideshow.dataset.shuffle.toLowerCase() === 'true') {
          slideShow.shuffleSlides();
        }
        slideShow.slideObserverInit();
        slideShow.initSlides();
      }
    });
  }
}
