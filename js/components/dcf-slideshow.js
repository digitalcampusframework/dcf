import { uuidv4 } from '../dcf-utility.js';
import DCFFigcaptionToggles from "./dcf-figcaption-toggle.js";

export default class DCFSlideshow
{
  uuid = uuidv4();

  slideshowContainer = null;
  slideDeck = null;
  slides = [];
  controlsContainer = null;
  prevButton = null;
  nextButton = null;
  playToggleButton = null;
  currentSlide = -1;

  transition = 'swap';
  transitionLock = false;

  allowPlay = false;
  autoInterval = null;
  intervalMS = 8000;
  playing = false;
  mouseOver = false;

  slideContainerClassList = [
    'dcf-relative'
  ];

  slideDeckClassList = [
    'dcf-d-grid',
    'dcf-ai-center',
    'dcf-jc-center',
    'dcf-mb-0',
    'dcf-w-100%',
    'dcf-h-100%'
  ];

  slideButtonContainerClassList = [
    'dcf-btn-group',
    'dcf-absolute',
    'dcf-right-0',
    'dcf-top-0'
  ];

  slideClassList = [
    'dcf-mb-0',
  ];

  slideBtnClassList = [
    'dcf-d-flex',
    'dcf-ai-center',
    'dcf-pt-4',
    'dcf-pb-4',
    'dcf-white'
  ];

  slidePrevBtnClassList = [
    'dcf-d-flex',
    'dcf-ai-center',
    'dcf-pt-4',
    'dcf-pb-4',
    'dcf-inverse'
  ];
  slidePrevBtnInnerHTML = `<svg class="dcf-h-4 dcf-w-4 dcf-fill-current" width="24"
height="24" viewBox="0 0 24 24" focusable="false" aria-hidden="true">
    <path d="M23.509
    9.856c-.38-.55-.928-.852-1.542-.852H9.74l4.311-4.151c.995-.994.961-2.646-.074-3.682-1.001-1-2.722-1.033-3.68-.077L.148
    11.144a.5.5 0 00-.003.707l9.978 10.079a2.445 2.445 0 001.737.705c.707 0 1.407-.294 1.92-.806a2.737 2.737 0 00.807-1.923
    2.431 2.431 0
    00-.708-1.733l-4.156-4.16h12.276c.618 0 1.161-.302 1.53-.851.304-.451.471-1.041.471-1.658 0-.596-.179-1.196-.491-1.648z"></path>
</svg>`;

  slideNextBtnClassList = [
    'dcf-d-flex',
    'dcf-ai-center',
    'dcf-pt-4',
    'dcf-pb-4',
    'dcf-inverse'
  ];
  slideNextBtnInnerHTML = `<svg class="dcf-h-4 dcf-w-4 dcf-fill-current" width="24"
height="24" viewBox="0 0 24 24" focusable="false" aria-hidden="true">
    <path d="M23.852 11.144L13.703 1.096c-.96-.96-2.678-.924-3.68.075-1.036 1.035-1.07 2.687-.069 3.69l4.321
    4.143H2.03c-1.27 0-2.03 1.272-2.03 2.5 0 .617.168 1.207.472 1.659.369.549.913.851 1.53.851h12.276l-4.156 4.16a2.425
    2.425 0 00-.708 1.734c0 .708.293 1.409.807 1.922a2.738 2.738 0 001.919.806c.664 0 1.28-.251
    1.739-.708l9.977-10.076a.502.502 0 00-.004-.708z"></path>
</svg>`;

  slidePlayToggleBtnClassList = [
    'dcf-d-flex',
    'dcf-ai-center',
    'dcf-pt-4',
    'dcf-pb-4',
    'dcf-inverse'
  ];
  slidePlayBtnInnerHTML = `<svg class="dcf-h-4 dcf-w-4 dcf-fill-current" width="24"
height="24" viewBox="0 0 24 24" focusable="false" aria-hidden="true">
    <path d="M21.759 11.577L2.786.077a.499.499 0 0 0-.759.428v23a.498.498
      0 0 0 .5.5c.09 0 .18-.024.259-.072l18.973-11.5a.5.5 0 0 0 0-.856z"></path>
</svg>`;
  slidePauseBtnInnerHTML = `<svg class="dcf-h-4 dcf-w-4 dcf-fill-current" width="24" height="24"
viewBox="0 0 24 24" focusable="false" aria-hidden="true">
    <path d="M10.5 0h-5C5.224 0 5 .224 5 .5v23C5 23.776 5.224 24 5.5 24h5c.276 0 .5-.224.5-.5v-23C11 .224 10.776 0 10.5
    0zM18.5 0h-5C13.224 0 13 .224 13 .5v23c0 .276.224.5.5.5h5c.276 0 .5-.224.5-.5v-23C19 .224 18.776 0 18.5 0z"></path>
</svg>`;

  toggleButtonInnerHTML = `<svg class="dcf-h-4 dcf-w-4 dcf-fill-current"
width="24" height="24" viewBox="0 0 24 24" focusable="false" aria-hidden="true">
  <path class="dcf-btn-toggle-figcaption-icon-open"
  d="M1,3h19c0.6,0,1-0.4,1-1c0-0.6-0.4-1-1-1H1C0.4,1,0,1.4,0,2C0,2.6,0.4,3,1,3z"/>
  '<path class="dcf-btn-toggle-figcaption-icon-open"
  d="M1,8h15c0.6,0,1-0.4,1-1c0-0.6-0.4-1-1-1H1C0.4,6,0,6.4,0,7C0,7.6,0.4,8,1,8z"/>
  <path class="dcf-btn-toggle-figcaption-icon-close-1"
  d="M1,13h22c0.6,0,1-0.4,1-1c0-0.6-0.4-1-1-1H1c-0.6,0-1,0.4-1,1C0,12.6,0.4,13,1,13z"/>
  <path class="dcf-btn-toggle-figcaption-icon-close-2"
  d="M1,13h22c0.6,0,1-0.4,1-1c0-0.6-0.4-1-1-1H1c-0.6,0-1,0.4-1,1C0,12.6,0.4,13,1,13z"/>
  <path class="dcf-btn-toggle-figcaption-icon-open"
  d="M1,18h18c0.6,0,1-0.4,1-1c0-0.6-0.4-1-1-1H1c-0.6,0-1,0.4-1,1C0,17.6,0.4,18,1,18z"/>
  <path class="dcf-btn-toggle-figcaption-icon-open"
  d="M1,23h15c0.6,0,1-0.4,1-1c0-0.6-0.4-1-1-1H1c-0.6,0-1,0.4-1,1C0,22.6,0.4,23,1,23z"/>
</svg>`;

  constructor(slideshowContainer, options = {}) {

    // Option overrides
    if ('slideContainerClassList' in options && Array.isArray(options.slideContainerClassList)) {
      this.slideContainerClassList = options.slideContainerClassList;
    }
    if ('slideDeckClassList' in options && Array.isArray(options.slideDeckClassList)) {
      this.slideDeckClassList = options.slideDeckClassList;
    }
    if ('slideButtonContainerClassList' in options && Array.isArray(options.slideButtonContainerClassList)) {
      this.slideButtonContainerClassList = options.slideButtonContainerClassList;
    }
    if ('slideClassList' in options && Array.isArray(options.slideClassList)) {
      this.slideClassList = options.slideClassList;
    }
    if ('slideBtnClassList' in options && Array.isArray(options.slideBtnClassList)) {
      this.slideBtnClassList = options.slideBtnClassList;
    }
    if ('slidePrevBtnClassList' in options && Array.isArray(options.slidePrevBtnClassList)) {
      this.slidePrevBtnClassList = options.slidePrevBtnClassList;
    }
    if ('slidePrevBtnInnerHTML' in options && typeof options.slidePrevBtnInnerHTML === 'string') {
      this.slidePrevBtnInnerHTML = options.slidePrevBtnInnerHTML;
    }
    if ('slideNextBtnClassList' in options && Array.isArray(options.slideNextBtnClassList)) {
      this.slideNextBtnClassList = options.slideNextBtnClassList;
    }
    if ('slideNextBtnInnerHTML' in options && typeof options.slideNextBtnInnerHTML === 'string') {
      this.slideNextBtnInnerHTML = options.slideNextBtnInnerHTML;
    }
    if ('slidePlayToggleBtnClassList' in options && Array.isArray(options.slidePlayToggleBtnClassList)) {
      this.slidePlayToggleBtnClassList = options.slidePlayToggleBtnClassList;
    }
    if ('slidePlayBtnInnerHTML' in options && typeof options.slidePlayBtnInnerHTML === 'string') {
      this.slidePlayBtnInnerHTML = options.slidePlayBtnInnerHTML;
    }
    if ('slidePauseBtnInnerHTML' in options && typeof options.slidePauseBtnInnerHTML === 'string') {
      this.slidePauseBtnInnerHTML = options.slidePauseBtnInnerHTML;
    }
    if ('toggleButtonInnerHTML' in options && typeof options.toggleButtonInnerHTML === 'string') {
      this.toggleButtonInnerHTML = options.toggleButtonInnerHTML;
    }

    // Set up slide show container
    this.slideshowContainer = slideshowContainer;
    if (this.slideshowContainer.tagName !== 'SECTION') {
      this.slideshowContainer.setAttribute('aria-role', 'region');
    }
    this.slideshowContainer.setAttribute('aria-roledescription', 'carousel');
    this.slideshowContainer.classList.add('dcf-slideshow-initialized');
    this.slideshowContainer.classList.add(...this.slideContainerClassList);
    // If the tabGroup has no ID then it will set it
    if (this.slideshowContainer.getAttribute('id') === null) {
      this.slideshowContainer.setAttribute('id', this.uuid.concat('-slideshow'));
    }

    // Set up slide show deck
    this.slideDeck = this.slideshowContainer.querySelector('ul');
    this.slideDeck.setAttribute('tabindex', '0');
    this.slideDeck.classList.add('dcf-slide-deck');
    this.slideDeck.setAttribute('aria-live', 'polite');
    if (this.slideDeck.getAttribute('id') === null) {
      this.slideDeck.setAttribute('id', this.uuid.concat('-slide-deck'));
    }
    this.slideDeck.classList.add(...this.slideDeckClassList);

    // Select all the slides
    this.slides = Array.from(this.slideshowContainer.querySelectorAll('li'));
    this.currentSlide = 0;

    // Check if we allow play
    this.allowPlay = this.slideshowContainer.hasAttribute('data-play') && (
      this.slideshowContainer.dataset.play.toLowerCase() === 'true' ||
      this.slideshowContainer.dataset.play.toLowerCase() === 'auto'
    );
    if (this.allowPlay) {
      if (this.slideshowContainer.dataset.rate) {
        this.intervalMS = parseInt(this.slideshowContainer.dataset.rate);
        if (isNaN(index) || this.intervalMS < 0) {
          throw new Error(`Bad auto slide advance rate: ${this.slideshowContainer.dataset.rate}`);
        }
      }
      this.slideDeck.addEventListener('mouseOver', () => {
        this.mouseOver = true;
      });
      this.slideDeck.addEventListener('mouseOut', () => {
        this.mouseOver = false;
      });
    }

    if (
      this.slideshowContainer.hasAttribute('data-transition') &&
      this.slideshowContainer.dataset.transition.toLowerCase() === 'fade'
    ) {
      this.transition = 'fade';
    }

    // Check if we need to shuffle the slides
    if (
      this.slideshowContainer.hasAttribute('data-shuffle') &&
      this.slideshowContainer.dataset.shuffle.toLowerCase() === 'true'
    ) {
      this.#shuffleSlides();
    }
    this.#initSlides();
    this.#initControls();
  }

  /**
   * Shuffles the slide order
   */
  #shuffleSlides() {
    // Randomize order
    for (var i = this.slides.length - 1; i >= 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = this.slides[i];
      this.slides[i] = this.slides[j];
      this.slides[j] = temp;
    }

    // Delete all the current content
    this.slideDeck.innerHTML = "";

    // Insert the slides back in in the new order
    this.slides.forEach((list_item) => {
      this.slideDeck.append(list_item);
    });
  }

  /**
   * Initializes the slides
   */
  #initSlides() {
    this.slides.forEach((slide, slideIndex) => {
      // Set up slide
      slide.setAttribute('id', this.uuid.concat('-slide-', slideIndex));
      slide.classList.add('dcf-slide');
      slide.classList.add(...this.slideClassList);
      slide.setAttribute('aria-role', 'group');
      slide.setAttribute('aria-roledescription', 'slide');
      slide.setAttribute('aria-label', `${slideIndex + 1} of ${this.slides.length}`);

      // If we are not the current slide then hide it
      if (slideIndex !== this.currentSlide) {
        slide.classList.add('dcf-d-none');
        slide.classList.add('dcf-z-0');
      } else {
        slide.classList.add('dcf-z-1');
      }

      // Figure out if we need to do figcaption toggles
      let figure = slide.querySelector('figure');
      if (figure === null) { return; }
      let caption = figure.querySelector('figcaption');
      if (caption === null) { return; }
      if (this.slideshowContainer.getAttribute('data-toggle-caption') === 'false') { return; }

      // Set the caption id
      if (caption.getAttribute('id') === null) {
        caption.setAttribute('id', this.uuid.concat('-caption-', slideIndex));
      }

      // Set up figcaption toggles
      new DCFFigcaptionToggles(caption, {
        offKeys: [ 'arrowUp', 'tab' ],
        toggleButtonInnerHTML: this.toggleButtonInnerHTML,
      });

      // Add class to each figure
      figure.classList.add('dcf-slide-figure');
    });

    // Images default to display inline which causes a weird gap below image
    // This class will remove that gap
    this.slideshowContainer.querySelectorAll('img').forEach((image) => {
      image.classList.add('dcf-d-block');
    });
  }

  /**
   * Initialized the slideshow controls
   */
  #initControls() {
    // Create slideshow controls (previous/next slide buttons)
    this.controlsContainer = document.createElement('div');
    this.prevButton = document.createElement('button');
    this.nextButton = document.createElement('button');

    // Set up controls container
    this.controlsContainer.classList.add('dcf-slideshow-controls');
    this.controlsContainer.classList.add(...this.slideButtonContainerClassList);

    // Set up previous button
    this.prevButton.classList.add('dcf-btn', 'dcf-btn-primary', 'dcf-btn-slide', 'dcf-btn-slide-prev');
    this.prevButton.classList.add(...this.slidePrevBtnClassList);
    this.prevButton.classList.add(...this.slideBtnClassList);
    this.prevButton.innerHTML = this.slidePrevBtnInnerHTML;
    this.prevButton.setAttribute('id', this.uuid.concat('-previous'));
    this.prevButton.setAttribute('aria-label', 'Previous slide');
    this.prevButton.setAttribute('aria-controls', this.slideDeck.getAttribute('id'));
    this.prevButton.addEventListener('click', () => {
      this.previousSlide();
    });

    // Set up next button
    this.nextButton.classList.add('dcf-btn', 'dcf-btn-primary', 'dcf-btn-slide', 'dcf-btn-slide-next');
    this.nextButton.classList.add(...this.slideNextBtnClassList);
    this.nextButton.classList.add(...this.slideBtnClassList);
    this.nextButton.innerHTML = this.slideNextBtnInnerHTML;
    this.nextButton.setAttribute('id', this.uuid.concat('-next'));
    this.nextButton.setAttribute('aria-label', 'Next slide');
    this.nextButton.setAttribute('aria-controls', this.slideDeck.getAttribute('id'));
    this.nextButton.addEventListener('click', () => {
      this.nextSlide();
    });

    // If we allow play then set up the play button
    if (this.allowPlay) {
      this.playToggleButton = document.createElement('button');
      this.playToggleButton.classList.add('dcf-btn', 'dcf-btn-primary', 'dcf-btn-slide', 'dcf-btn-slide-prev');
      this.playToggleButton.classList.add(...this.slidePlayToggleBtnClassList);
      this.playToggleButton.classList.add(...this.slideBtnClassList);
      this.playToggleButton.innerHTML = this.slidePlayBtnInnerHTML;
      this.playToggleButton.setAttribute('aria-label', 'Start automatic slideshow');
      this.playToggleButton.setAttribute('id', this.uuid.concat('-play-toggle'));
      this.playToggleButton.setAttribute('aria-controls', this.slideDeck.getAttribute('id'));
      this.playToggleButton.addEventListener('click', () => {
        this.togglePlayState();
      });
    }

    // Add relative class for absolute positioning of slideshow controls
    this.slideshowContainer.classList.add('dcf-relative');

    // Append controls (previous/next slide) to slideshow
    this.controlsContainer.appendChild(this.prevButton);
    if (this.allowPlay) {
      this.controlsContainer.appendChild(this.playToggleButton);
    }
    this.controlsContainer.appendChild(this.nextButton);
    this.slideshowContainer.prepend(this.controlsContainer);
  }

  /**
   * Check if we can advance to the next slide, if we can then we will
   * @returns void
   */
  #automaticSlider() {
    if (this.slideDeck.contains(document.activeElement) || this.mouseOver) {
      return;
    }
    this.nextSlide();
  }

  /**
   * Just swap the slides, no transitions
   * @param {number} newCurrentSlideIndex
   */
  #swapSlides(newCurrentSlideIndex) {
    this.slides.forEach((slide) => {
      slide.classList.add('dcf-d-none', 'dcf-z-0');
      slide.classList.remove('dcf-z-1');
      const captionToggleButton = slide.querySelector('.dcf-btn-toggle-figcaption');
      if (captionToggleButton !== null) {
        const closeEvent = new Event(DCFFigcaptionToggles.events('commandClose'));
        captionToggleButton.dispatchEvent(closeEvent);
      }
    });

    this.currentSlide = newCurrentSlideIndex;
    this.slides[this.currentSlide].classList.remove('dcf-d-none', 'dcf-z-0');
    this.slides[this.currentSlide].classList.add('dcf-z-1');
  }

  /**
   * Fade between the two slides
   * @param {number} newCurrentSlideIndex
   */
  #fadeSlides(newCurrentSlideIndex) {
    this.transitionLock = true;

    this.slides[this.currentSlide].addEventListener('animationend', () => {
      this.slides[newCurrentSlideIndex].classList.remove('dcf-z-0');
      this.slides[newCurrentSlideIndex].classList.add('dcf-z-1');

      this.slides.forEach((slide, slideIndex) => {
        if (slideIndex === newCurrentSlideIndex) { return; }
        slide.classList.add('dcf-d-none', 'dcf-z-0');
        slide.classList.remove('dcf-z-1', 'dcf-slideshow-fade-out');
        const captionToggleButton = slide.querySelector('.dcf-btn-toggle-figcaption');
        if (captionToggleButton !== null) {
          const closeEvent = new Event(DCFFigcaptionToggles.events('commandClose'));
          captionToggleButton.dispatchEvent(closeEvent);
        }
      });

      this.transitionLock = false;
    }, {
      once: true,
    });

    this.slides[newCurrentSlideIndex].classList.remove('dcf-d-none');
    this.slides[this.currentSlide].classList.add('dcf-slideshow-fade-out');
    this.currentSlide = newCurrentSlideIndex;
  }

  /**
   * Switches to the previous slide, will loop to end
   * @returns void
   */
  previousSlide() {
    if (this.transitionLock) {
      return;
    }

    let newCurrentSlideIndex = this.currentSlide - 1;
    if (newCurrentSlideIndex < 0) {
      newCurrentSlideIndex = this.slides.length - 1;
    }

    if (this.transition === 'fade') {
      this.#fadeSlides(newCurrentSlideIndex);
    } else {
      this.#swapSlides(newCurrentSlideIndex);
    }
  }

  /**
   * Switches to the next slide, will loop to beginning
   * @returns void
   */
  nextSlide() {
    if (this.transitionLock) {
      return;
    }

    let newCurrentSlideIndex = this.currentSlide + 1;
    if (newCurrentSlideIndex >= this.slides.length) {
      newCurrentSlideIndex = 0;
    }

    if (this.transition === 'fade') {
      this.#fadeSlides(newCurrentSlideIndex);
    } else {
      this.#swapSlides(newCurrentSlideIndex);
    }
  }

  /**
   * Starts auto playing
   * @throws Error if allow play is false
   * @returns void
   */
  play() {
    if (!this.allowPlay) {
      throw new Error('This slideshow needs attribute `data-play` to be able to use this method')
    }
    if (this.playing === true) { return; }

    this.playing = true;

    this.slideDeck.setAttribute('aria-live', 'off');
    this.playToggleButton.setAttribute('aria-label', 'Stop automatic slideshow');
    this.playToggleButton.innerHTML = this.slidePauseBtnInnerHTML;

    this.autoInterval = setInterval(() => {
      this.#automaticSlider();
    }, this.intervalMS);
  }

  /**
   * Stops auto playing
   * @throws Error if allow play is false
   * @returns void
   */
  pause() {
    if (!this.allowPlay) {
      throw new Error('This slideshow needs attribute `data-play` to be able to use this method')
    }
    if (this.playing === false) { return; }

    this.playing = false;

    this.slideDeck.setAttribute('aria-live', 'polite');
    this.playToggleButton.setAttribute('aria-label', 'Start automatic slideshow');
    this.playToggleButton.innerHTML = this.slidePlayBtnInnerHTML;

    clearInterval(this.autoInterval);
  }

  /**
   * Toggles auto playing
   * @throws Error if allow play is false
   * @returns void
   */
  togglePlayState() {
    if (!this.allowPlay) {
      throw new Error('This slideshow needs attribute `data-play` to be able to use this method')
    }

    if (this.playing) {
      this.pause();
    } else {
      this.play();
    }
  }

  /**
   * Switched to the slide index
   * @param {Number} index slide's index
   * @returns void
   */
  jumpToSlide(index) {
    if (typeof index !== 'number' || isNaN(index)) {
      throw new Error(`${index} is not a valid slide index`);
    }
    if (index > this.slides.length - 1 || index < 0) {
      throw new Error(`Slide ${index} does not exist`);
    }

    this.#swapSlides(index);
  }
}