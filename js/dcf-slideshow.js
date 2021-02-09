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
        const visibleSlide = slideDeck.querySelector('.visible');
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
      }
    });

    this.initControls();
    this.slides = this.slideDeck.querySelectorAll('li');
    if (this.slideshow.hasAttribute('data-shuffle') && this.slideshow.dataset.shuffle.toLowerCase() === 'true') {
      this.shuffleSlides();
    }
    this.initSlides();
  }

  pause() {
    this.paused = true;
    clearInterval(this.scrollInterval);
  }

  play() {
    this.paused = false;
    this.scrollInterval = setInterval(this.scroll.bind(this), this.scrollRate);
  }

  scroll() {
    if (this.currentSlide.nextElementSibling) {
      this.showSlide('next');
    } else {
      this.slideDeck.scrollLeft = DCFUtility.magicNumbers('int0');
      this.currentSlide = this.slides[DCFUtility.magicNumbers('int0')];
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

  initControls() {
    // Create slideshow controls (previous/next slide buttons)
    let ctrls = document.createElement('ul');
    this.ctrlPrevious = document.createElement('li');
    this.ctrlNext = document.createElement('li');
    this.ctrlPreviousButton = document.createElement('button');
    this.ctrlNextButton = document.createElement('button');

    this.allowPlay = this.slideshow.hasAttribute('data-shuffle') && this.slideshow.dataset.shuffle.toLowerCase() === 'true';
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
      });
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
      ctrls.appendChild(this.ctrlPlayToggleButton);
    }
    ctrls.appendChild(this.ctrlNext);
    this.slideshow.appendChild(ctrls);

    this.ctrlPrevious.addEventListener('click', () => {
      this.showSlide('previous');
    });

    this.ctrlNext.addEventListener('click', () => {
      this.showSlide('next');
    });
  }

  initSlides() {
    Array.prototype.forEach.call(this.slides, (slide, slideIndex) => {
      if (slideIndex === DCFUtility.magicNumbers('int0')) {
        this.currentSlide = slide;
      }
      slide.setAttribute('id', this.uuid.concat('-slide-', slideIndex));
      slide.classList.add('dcf-slide', 'dcf-relative');

      switch (this.slideTransition) {
      case 'fade':
        slide.classList.add('dcf-fade-in');
        break;
      default:
        // do nothing
        break;
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

    // set observer for slides
    const observerSettings = {
      root: this.slideshow,
      rootMargin: '-10px'
    };
    if ('IntersectionObserver' in window) {
      let observer = new IntersectionObserver(this.observerCallback, observerSettings);
      Array.prototype.forEach.call(this.slides, (elem) => {
        observer.observe(elem);
      });
    } else {
      Array.prototype.forEach.call(this.slides, (slide) => {
        const img = slide.querySelector('img');
        img.setAttribute('src', img.getAttribute('data-src'));
      });
    }
  }

  observerCallback(slides) {
    Array.prototype.forEach.call(slides, (entry) => {
      entry.target.classList.remove('visible', 'dcf-animated');
      if (!entry.intersectionRatio > DCFUtility.magicNumbers('int0')) {
        return;
      }
      let img = entry.target.querySelector('img');
      if (img && img.dataset.src) {
        img.setAttribute('src', img.dataset.src);
        img.removeAttribute('data-src');
      }
      entry.target.classList.add('visible', 'dcf-animated');
    });
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

  scrollIt(slideToShow) {
    const scrollPos = Array.prototype.indexOf.call(this.slides, slideToShow) *
      (this.slideDeck.scrollWidth / this.slides.length);
    this.slideDeck.scrollLeft = scrollPos;
  }

  showSlide(dir) {
    const visible = this.slideshow.querySelectorAll('.visible');
    const index = dir === 'previous' ? DCFUtility.magicNumbers('int0') : DCFUtility.magicNumbers('int1');

    if (visible.length > DCFUtility.magicNumbers('int1')) {
      this.scrollIt(visible[index]);
    } else {
      const newSlide = index === DCFUtility.magicNumbers('int0') ?
        visible[DCFUtility.magicNumbers('int0')].previousElementSibling :
        visible[DCFUtility.magicNumbers('int0')].nextElementSibling;
      if (newSlide) {
        this.scrollIt(newSlide);
        this.currentSlide = newSlide;
      }
    }
  }
}

class DCFSlideshowTheme {
  constructor() {
    // Defaults
    this.slideBtnClassList = [ 'dcf-d-flex', 'dcf-ai-center', 'dcf-pt-4', 'dcf-pb-4', 'dcf-white' ];

    this.slidePrevBtnClassList = [ 'dcf-d-flex', 'dcf-ai-center', 'dcf-pt-4', 'dcf-pb-4', 'dcf-inverse' ];
    this.slidePrevBtnInnerHTML = `<svg class="dcf-h-4 dcf-w-4 dcf-fill-current" width="24" height="24"
viewBox="0 0 24 24" aria-hidden="true">
    <path d="M21.746.064a.504.504 0 0 0-.504.008l-19 11.5a.499.499
    0 0 0-.001.856l19 11.5A.501.501 0 0 0 22 23.5V.5a.5.5 0 0 0-.254-.436z"></path>
 </svg>`;

    this.slideNextBtnClassList = [ 'dcf-d-flex', 'dcf-ai-center', 'dcf-pt-4', 'dcf-pb-4', 'dcf-inverse' ];
    this.slideNextBtnInnerHTML = `<svg class="dcf-h-4 dcf-w-4 dcf-fill-current"
width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M21.759 11.577L2.786.077a.499.499 0 0 0-.759.428v23a.498.498
      0 0 0 .5.5c.09 0 .18-.024.259-.072l18.973-11.5a.5.5 0 0 0 0-.856z"></path>
</svg>`;

    this.slidePlayToggleBtnClassList = [ 'dcf-d-flex', 'dcf-ai-center', 'dcf-pt-4', 'dcf-pb-4', 'dcf-inverse' ];
    this.slidePlayBtnInnerHTML = '&#9658;';
    this.slidePauseBtnInnerHTML = '&#10073;&#10073;';

    this.figureCaptionBtnInnerHTML = `<svg class="dcf-h-4 dcf-w-4 dcf-fill-current"
      width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
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
      'd="M1,23h15c0.6,0,1-0.4,1-1c0-0.6-0.4-1-1-1H1c-0.6,0-1,0.4-1,1C0,22.6,0.4,23,1,23z"/>
</svg>`;

    this.figureCaptionToggleTransition = (button) => {
      const keyframesClose1 = [
        {
          transform: 'rotate(45deg)',
          transformOrigin: '50% 50%'
        },
        {
          transform: 'rotate(0deg)',
          transformOrigin: '50% 50%'
        }
      ];

      const keyframesClose2 = [
        {
          transform: 'rotate(-45deg)',
          transformOrigin: '50% 50%'
        },
        {
          transform: 'rotate(0deg)',
          transformOrigin: '50% 50%'
        }
      ];

      const keyframesOpen1 = [
        {
          transform: 'rotate(0deg)',
          transformOrigin: '50% 50%'
        },
        {
          transform: 'rotate(45deg)',
          transformOrigin: '50% 50%'
        }
      ];

      const keyframesOpen2 = [
        {
          transform: 'rotate(0deg)',
          transformOrigin: '50% 50%'
        },
        {
          transform: 'rotate(-45deg)',
          transformOrigin: '50% 50%'
        }
      ];

      const options = {
        duration: 250,
        fill: 'forwards'
      };

      let caption = button.previousElementSibling;
      let close1 = button.querySelector('.theme-icon-slide-caption-close-1');
      let close2 = button.querySelector('.theme-icon-slide-caption-close-2');

      caption.addEventListener('openCaption', () => {
        close1.animate(keyframesClose1, options);
        close2.animate(keyframesClose2, options);
      }, false);

      caption.addEventListener('closeCaption', () => {
        close1.animate(keyframesOpen1, options);
        close2.animate(keyframesOpen2, options);
      }, false);
    };
  }

  setThemeVariable(themeVariableName, value) {
    switch (themeVariableName) {
    case 'slideBtnClassList':
      if (Array.isArray(value)) {
        this.slideBtnClassList = value;
      }
      break;

    case 'slidePrevBtnClassList':
      if (Array.isArray(value)) {
        this.slidePrevBtnClassList = value;
      }
      break;

    case 'slidePrevBtnInnerHTML':
      if (typeof value === 'string') {
        this.slidePrevBtnInnerHTML = value;
      }
      break;

    case 'slideNextBtnClassList':
      if (Array.isArray(value)) {
        this.slideNextBtnClassList = value;
      }
      break;

    case 'slideNextBtnInnerHTML':
      if (typeof value === 'string') {
        this.slideNextBtnInnerHTML = value;
      }
      break;

    case 'slidePlayToggleBtnInnerHTML':
      if (typeof value === 'string') {
        this.slidePlayToggleBtnInnerHTML = value;
      }
      break;

    case 'figureCaptionToggleTransition':
      if (typeof value === 'function') {
        this.figureCaptionToggleTransition = value;
      }
      break;

    default:
      // Invalid variable so ignore
      break;
    }
  }
}

class DCFSlideshow {
  constructor(slideshows, theme) {
    this.slideshows = slideshows;
    if (theme instanceof DCFSlideshowTheme) {
      this.theme = theme;
    } else {
      this.theme = new DCFSlideshowTheme();
    }
    this.openCaptionEvent = new Event(DCFSlideshow.events('openCaption'));
    this.closeCaptionEvent = new Event(DCFSlideshow.events('closeCaption'));
  }

  static events(name) {
    const events = {
      openCaption: 'openCaption',
      closeCaption: 'closeCaption'
    };
    Object.freeze(events);

    return name in events ? events[name] : undefined;
  }

  initialize() {
    Array.prototype.forEach.call(this.slideshows, (slideshow, slideshowIndex) => {
      const slide = new SlideshowObj(slideshow, slideshowIndex, this);
    });
  }
}
