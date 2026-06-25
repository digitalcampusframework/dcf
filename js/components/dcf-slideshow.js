import { uuidv4 } from '../dcf-utility.js';
import { easingInOutCubic, lerp } from '../dcf-animation.js';
import DCFFigcaptionToggles from './dcf-figcaption-toggle.js';

export default class DCFSlideshow {
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

    layout = 'default';

    multiViewButtonPosition = 'center';

    multiViewSlidePosition = 'center';

    scrollingId = null;

    infiniteSlideOriginalLength = 0;

    slideContainerClassList = [
        'dcf-relative',
    ];

    slideContainerMultiViewClassList = [
        'dcf-relative',
        'dcf-overflow-x-hidden',
    ];

    slideDeckClassList = [
        'dcf-d-grid',
        'dcf-grid-cols-1',
        'dcf-ai-center',
        'dcf-jc-center',
        'dcf-mb-0',
        'dcf-w-100%',
        'dcf-h-100%',
    ];

    slideDeckMultiViewClassList = [
        'dcf-d-flex',
        'dcf-flex-row',
        'dcf-flex-nowrap',
        'dcf-relative',
        'dcf-m-0',
        'dcf-pt-0',
        'dcf-pb-0',
    ];

    slideButtonContainerClassList = [
        'dcf-btn-group',
        'dcf-absolute',
        'dcf-right-0',
        'dcf-top-0',
    ];

    slideButtonContainerMultiViewClassList = [
        'dcf-absolute',
        'dcf-d-flex',
        'dcf-jc-between',
        'dcf-left-50%',
        'dcf-z-1',
    ];

    slideButtonContainerMultiViewUnderClassList = [
        'dcf-d-flex',
        'dcf-jc-start',
        'dcf-ai-center',
        'dcf-mt-4',
    ];

    slideClassList = [
        'dcf-mb-0',
    ];

    slideMultiViewClassList = [
        'dcf-relative',
        'dcf-overflow-hidden',
        'dcf-mt-0',
        'dcf-mb-0',
        'dcf-p-0',
        'dcf-flex-shrink-0',
        'dcf-h-100%',
    ];

    slideBtnClassList = [
        'dcf-d-flex',
        'dcf-ai-center',
        'dcf-pt-4',
        'dcf-pb-4',
        'dcf-white',
    ];

    slideBtnMultiViewClassList = [
        'dcf-circle',
    ];

    slidePrevBtnClassList = [
        'dcf-d-flex',
        'dcf-ai-center',
        'dcf-pt-4',
        'dcf-pb-4',
        'dcf-inverse',
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
        'dcf-inverse',
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
        'dcf-inverse',
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
        if ('slideContainerMultiViewClassList' in options && Array.isArray(options.slideContainerMultiViewClassList)) {
            this.slideContainerMultiViewClassList = options.slideContainerMultiViewClassList;
        }
        if ('slideDeckClassList' in options && Array.isArray(options.slideDeckClassList)) {
            this.slideDeckClassList = options.slideDeckClassList;
        }
        if ('slideDeckMultiViewClassList' in options && Array.isArray(options.slideDeckMultiViewClassList)) {
            this.slideDeckMultiViewClassList = options.slideDeckMultiViewClassList;
        }
        if ('slideButtonContainerClassList' in options && Array.isArray(options.slideButtonContainerClassList)) {
            this.slideButtonContainerClassList = options.slideButtonContainerClassList;
        }
        if ('slideButtonContainerMultiViewClassList' in options && Array.isArray(options.slideButtonContainerMultiViewClassList)) {
            this.slideButtonContainerMultiViewClassList = options.slideButtonContainerMultiViewClassList;
        }
        if ('slideButtonContainerMultiViewUnderClassList' in options && Array.isArray(options.slideButtonContainerMultiViewUnderClassList)) {
            this.slideButtonContainerMultiViewUnderClassList = options.slideButtonContainerMultiViewUnderClassList;
        }
        if ('slideClassList' in options && Array.isArray(options.slideClassList)) {
            this.slideClassList = options.slideClassList;
        }
        if ('slideMultiViewClassList' in options && Array.isArray(options.slideMultiViewClassList)) {
            this.slideMultiViewClassList = options.slideMultiViewClassList;
        }
        if ('slideBtnClassList' in options && Array.isArray(options.slideBtnClassList)) {
            this.slideBtnClassList = options.slideBtnClassList;
        }
        if ('slideBtnMultiViewClassList' in options && Array.isArray(options.slideBtnMultiViewClassList)) {
            this.slideBtnMultiViewClassList = options.slideBtnMultiViewClassList;
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
        if (this.slideshowContainer.dataset.layout === 'multi-view') {
            this.layout = this.slideshowContainer.dataset.layout;
        }

        if (this.slideshowContainer.tagName !== 'SECTION') {
            this.slideshowContainer.setAttribute('role', 'region');
        }
        this.slideshowContainer.setAttribute('aria-roledescription', 'carousel');
        if (this.layout === 'multi-view') {
            this.slideshowContainer.classList.add(...this.slideContainerMultiViewClassList);
        } else {
            this.slideshowContainer.classList.add(...this.slideContainerClassList);
        }

        if (
            this.slideshowContainer.dataset.buttonPosition === 'top' ||
            this.slideshowContainer.dataset.buttonPosition === 'bottom' ||
            this.slideshowContainer.dataset.buttonPosition === 'under'
        ) {
            this.multiViewButtonPosition = this.slideshowContainer.dataset.buttonPosition;
        }

        if (
            this.slideshowContainer.dataset.snap === 'left' ||
            this.slideshowContainer.dataset.snap === 'right'
        ) {
            this.multiViewSlidePosition = this.slideshowContainer.dataset.snap;
        }

        // If the tabGroup has no ID then it will set it
        if (this.slideshowContainer.getAttribute('id') === '' || this.slideshowContainer.getAttribute('id') === null) {
            this.slideshowContainer.setAttribute('id', this.uuid.concat('-slideshow'));
        }

        // Set up slide show deck
        this.slideDeck = this.slideshowContainer.querySelector(':scope > ul');
        this.slideDeck.setAttribute('tabindex', '0');
        this.slideDeck.classList.add('dcf-slide-deck');
        this.slideDeck.setAttribute('aria-live', 'polite');
        if (this.slideDeck.getAttribute('id') === '' || this.slideDeck.getAttribute('id') === null) {
            this.slideDeck.setAttribute('id', this.uuid.concat('-slide-deck'));
        }
        if (this.layout === 'multi-view') {
            this.slideDeck.classList.add(...this.slideDeckMultiViewClassList);
        } else {
            this.slideDeck.classList.add(...this.slideDeckClassList);
        }

        // Select all the slides
        this.slides = Array.from(this.slideDeck.children);
        this.currentSlide = 0;

        // Check if we allow play
        this.allowPlay = this.slideshowContainer.hasAttribute('data-play') && (
            this.slideshowContainer.dataset.play.toLowerCase() === 'true' ||
            this.slideshowContainer.dataset.play.toLowerCase() === 'auto'
        );
        if (this.allowPlay) {
            if (this.slideshowContainer.dataset.rate) {
                this.intervalMS = parseInt(this.slideshowContainer.dataset.rate, 10);
                if (isNaN(this.intervalMS) || this.intervalMS < 0) {
                    throw new Error(`Bad auto slide advance rate: ${this.slideshowContainer.dataset.rate}`);
                }
            }
            this.slideshowContainer.addEventListener('mouseover', () => {
                this.mouseOver = true;
            });
            this.slideshowContainer.addEventListener('mouseout', () => {
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
        if (
            this.slideshowContainer.hasAttribute('data-infinite') &&
            this.slideshowContainer.dataset.infinite.toLowerCase() === 'true'
        ) {
            this.#setupInfiniteScroll();
        }
        this.#initSlides();
        this.#initControls();

        if (this.layout === 'multi-view') {
            // If we resize then the active slide might not be in the middle
            // so we will need to re-scroll to it
            window.addEventListener('resize', () => {
                this.#multiViewSwapSlides(this.currentSlide, true);
            });

            // Add swipe gestures for mobile
            const mouseStatus = {
                down: false,
                xPos: 0,
                yPos: 0,
            };
            this.slideshowContainer.addEventListener('pointerdown', (event) => {
                if (event.target.closest('.dcf-btn-slide') !== null) {
                    return;
                }
                if (event.pointerType === 'mouse') {
                    return;
                }
                mouseStatus.down = true;
                mouseStatus.xPos = event.clientX;
                mouseStatus.yPos = event.clientY;
            });
            this.slideshowContainer.addEventListener('pointermove', (event) => {
                if (mouseStatus.down === false) {
                    return;
                }
                event.preventDefault();
                if (event.clientX - mouseStatus.xPos > 100) {
                    this.previousSlide();
                    mouseStatus.down = false;
                }
                if (event.clientX - mouseStatus.xPos < -100) {
                    this.nextSlide();
                    mouseStatus.down = false;
                }
            });
            this.slideshowContainer.addEventListener('pointerup', () => {
                mouseStatus.down = false;
            });
            this.slideshowContainer.addEventListener('pointerleave', () => {
                mouseStatus.down = false;
            });
        }

        // This needs to go after init controls so we can change the state of the toggle button
        if (this.allowPlay) {
            if (!(window.matchMedia('(prefers-reduced-motion: reduce)').matches)) {
                const startPlaying = this.slideshowContainer.hasAttribute('data-start-playing') && (
                    this.slideshowContainer.dataset.startPlaying.toLowerCase() === 'true'
                );
                if (startPlaying) {
                    this.play();
                }
            }
        }

        this.slideshowContainer.classList.add('dcf-slideshow-initialized');
        this.slideshowContainer.removeAttribute('hidden');

        this.slideshowContainer.dispatchEvent(new CustomEvent(DCFSlideshow.events('slideshowReady'), {
            detail: {
                classInstance: this,
            },
        }));
    }

    /**
     * Validates and returns standardized name of events for tabs
     * @static
     * @param { string } name - Name of the event to be returned
     * @returns { string } Standard name of the event
     */
    static events(name) {
        const events = {
            slideshowReady: 'slideshowReady',
        };
        Object.freeze(events);

        return name in events ? events[name] : undefined;
    }

    /**
     * Shuffles the slide order
     */
    #shuffleSlides() {
        // Randomize order
        for (let index = this.slides.length - 1; index >= 0; index--) {
            const randomSlideIndex = Math.floor(Math.random() * (index + 1));
            const temp = this.slides[index];
            this.slides[index] = this.slides[randomSlideIndex];
            this.slides[randomSlideIndex] = temp;
        }

        // Delete all the current content
        this.slideDeck.innerHTML = '';

        // Insert the slides back in in the new order
        this.slides.forEach((listItem) => {
            this.slideDeck.append(listItem);
        });
    }

    #setupInfiniteScroll() {
        this.infiniteSlideOriginalLength = this.slides.length;
        const numCopies = 5;

        for (let copyCount = 0; copyCount < numCopies; copyCount++) {
            const prevList = [];
            this.slides.forEach((slide) => {
                slide.dataset.original = true;
                const newSlidePrev = slide.cloneNode(true);
                newSlidePrev.removeAttribute('data-original');
                const newSlideNext = slide.cloneNode(true);
                newSlideNext.removeAttribute('data-original');
                prevList.push(newSlidePrev);
                this.slideDeck.append(newSlideNext);
            });
            prevList.reverse().forEach((newSlidePrev) => {
                this.slideDeck.prepend(newSlidePrev);
            });
        }

        this.slides = Array.from(this.slideDeck.children);
        this.currentSlide = numCopies * this.infiniteSlideOriginalLength;
    }

    /**
     * Initializes the slides
     */
    #initSlides() {
        this.slides.forEach((slide, slideIndex) => {
            // Set up slide
            slide.setAttribute('id', this.uuid.concat('-slide-', slideIndex));
            slide.classList.add('dcf-slide');
            if (this.layout === 'multi-view') {
                slide.classList.add(...this.slideMultiViewClassList);
            } else {
                slide.classList.add(...this.slideClassList);
            }

            slide.setAttribute('aria-roledescription', 'slide');
            if (this.infiniteSlideOriginalLength !== 0) {
                const originalSlideIndex = (slideIndex % this.infiniteSlideOriginalLength) + 1;
                slide.setAttribute('aria-label', `${originalSlideIndex} of ${this.infiniteSlideOriginalLength}`);
            } else {
                slide.setAttribute('aria-label', `${slideIndex + 1} of ${this.slides.length}`);
            }

            // Multi view layout will let us see all the slides so if we click on one then jump to it
            if (slideIndex !== this.currentSlide && this.layout === 'multi-view') {
                slide.addEventListener('click', () => {
                    this.#multiViewSwapSlides(slideIndex);
                });
            } else if (this.layout === 'multi-view') {
                slide.addEventListener('click', () => {
                    this.#multiViewSwapSlides(slideIndex);
                });

                // This is the selected slide so go to it
                this.#multiViewSwapSlides(slideIndex);
            } else if (slideIndex !== this.currentSlide) {

                // If we are not the current slide then hide it
                slide.classList.add('dcf-d-none');
                slide.classList.add('dcf-z-0');
            } else {
                slide.classList.add('dcf-z-1');
            }

            // Figure out if we need to do figcaption toggles
            const figure = slide.querySelector('figure');
            if (figure === null) { return; }
            const caption = figure.querySelector('figcaption');
            if (caption === null) { return; }
            if (this.slideshowContainer.getAttribute('data-toggle-caption') === 'false') { return; }

            // Set the caption id
            if (caption.getAttribute('id') === null) {
                caption.setAttribute('id', this.uuid.concat('-caption-', slideIndex));
            }

            // Set up figcaption toggles
            new DCFFigcaptionToggles(caption, {
                offKeys: ['arrowUp', 'tab'],
                toggleButtonInnerHTML: this.toggleButtonInnerHTML,
            });

            // Add class to each figure
            figure.classList.add('dcf-slide-figure');
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

        // Set up previous button
        this.prevButton.classList.add('dcf-btn', 'dcf-btn-primary', 'dcf-btn-slide', 'dcf-btn-slide-prev');
        this.prevButton.innerHTML = this.slidePrevBtnInnerHTML;
        this.prevButton.setAttribute('id', this.uuid.concat('-previous'));
        this.prevButton.setAttribute('aria-label', 'Previous slide');
        this.prevButton.setAttribute('aria-controls', this.slideDeck.getAttribute('id'));
        this.prevButton.addEventListener('click', () => {
            this.previousSlide();
        });

        // Set up next button
        this.nextButton.classList.add('dcf-btn', 'dcf-btn-primary', 'dcf-btn-slide', 'dcf-btn-slide-next');
        this.nextButton.innerHTML = this.slideNextBtnInnerHTML;
        this.nextButton.setAttribute('id', this.uuid.concat('-next'));
        this.nextButton.setAttribute('aria-label', 'Next slide');
        this.nextButton.setAttribute('aria-controls', this.slideDeck.getAttribute('id'));
        this.nextButton.addEventListener('click', () => {
            this.nextSlide();
        });

        // Set multi view specific classes
        if (this.layout === 'multi-view') {

            // Set the classes for the button container
            if (this.multiViewButtonPosition === 'top') {
                this.controlsContainer.classList.add(...this.slideButtonContainerMultiViewClassList);
                this.controlsContainer.classList.add('dcf-slideshow-controls-top');
            } else if (this.multiViewButtonPosition === 'under') {
                this.controlsContainer.classList.add(...this.slideButtonContainerMultiViewUnderClassList);
                this.controlsContainer.classList.add('dcf-slideshow-controls-under');
            } else if (this.multiViewButtonPosition === 'bottom') {
                this.controlsContainer.classList.add(...this.slideButtonContainerMultiViewClassList);
                this.controlsContainer.classList.add('dcf-slideshow-controls-bottom');
            } else {
                this.controlsContainer.classList.add(...this.slideButtonContainerMultiViewClassList);
                this.controlsContainer.classList.add('dcf-top-50%');
                this.controlsContainer.classList.add('dcf-slideshow-controls-center');
            }

            // Set the classes for the prev and next buttons
            this.prevButton.classList.add(...this.slideBtnMultiViewClassList);
            this.nextButton.classList.add(...this.slideBtnMultiViewClassList);

        } else {

            // Set the classes for the button container
            this.controlsContainer.classList.add(...this.slideButtonContainerClassList);

            // Set the classes for the prev and next buttons
            this.prevButton.classList.add(...this.slidePrevBtnClassList);
            this.prevButton.classList.add(...this.slideBtnClassList);
            this.nextButton.classList.add(...this.slideNextBtnClassList);
            this.nextButton.classList.add(...this.slideBtnClassList);

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
        }

        // Add relative class for absolute positioning of slideshow controls
        this.slideshowContainer.classList.add('dcf-relative');

        // Append controls (previous/next slide) to slideshow
        this.controlsContainer.appendChild(this.prevButton);
        if (this.allowPlay) {
            this.controlsContainer.appendChild(this.playToggleButton);
        }
        this.controlsContainer.appendChild(this.nextButton);

        if (this.layout === 'multi-view') {
            this.slideshowContainer.append(this.controlsContainer);
        } else {
            this.slideshowContainer.prepend(this.controlsContainer);
        }
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
     * In multi view layout adjust the left position of the slide deck to "scroll" to image
     * @param { Number } newCurrentSlideIndex The new slide which to scroll to
     * @param { Boolean } jump Do the animation to scroll, or jump right to it and avoid animation
     */
    #multiViewSwapSlides(newCurrentSlideIndex, jump = false) {
        this.currentSlide = newCurrentSlideIndex;

        // Remove the active class from all the other slides
        this.slides.forEach((slideToRemoveClass) => {
            slideToRemoveClass.classList.remove('dcf-slideshow-active');
            slideToRemoveClass.classList.add('dcf-slideshow-inactive');
        });

        // Add the active class to start that transition
        this.slides[newCurrentSlideIndex].classList.remove('dcf-slideshow-active');
        this.slides[newCurrentSlideIndex].classList.add('dcf-slideshow-active');

        // "Scroll" to the the new item
        if (jump) {
            this.#jumpScrollToItem(this.slides[newCurrentSlideIndex]);
        } else if (this.scrollingId !== this.slides[newCurrentSlideIndex].id) {
            this.scrollingId = this.slides[newCurrentSlideIndex].id;
            this.#smoothScrollToItem( this.slides[newCurrentSlideIndex], this.slides[newCurrentSlideIndex].id);
        }
    }

    /**
     * We calculate the new left position of the slide deck and we jump right to it
     * @param { HTMLElement } slideToJumpTo The slide to jump to
     */
    #jumpScrollToItem(slideToJumpTo) {
        const newLeft = this.#calculateSlideDeckOffset(slideToJumpTo);
        this.slideDeck.style.left = `${newLeft}px`;
    }

    /**
     * We calculate the new left position of the slide deck and we smoothly animate to it
     * we also recalculate the scroll position in case it changes like the widths of the slides change
     * @param { HTMLElement } slideToScrollTo The slide to scroll to
     * @param { String } thisScrollsId The id of this scroll, this is to cancel the animation if needed
     */
    #smoothScrollToItem(slideToScrollTo, thisScrollsId) {
        //!IMPORTANT: This needs to be a little longer than the transition to grow the item
        let scrollDurationMs = parseFloat(window.getComputedStyle(this.slideshowContainer).getPropertyValue('--transition-time'));
        if (Number.isNaN(scrollDurationMs)) {
            scrollDurationMs = 500;
        } else if (scrollDurationMs < 100) {
            scrollDurationMs = scrollDurationMs * 1000;
        }
        let scrollProgressMs = 0;

        // Get the starting point for the animation
        let oldLeft = parseFloat(this.slideDeck.style.getPropertyValue('left'));
        if (Number.isNaN(oldLeft)) {
            oldLeft = 0;
        }

        // We use this to determine how much time between animation frames we had
        let previousLoopTime = Date.now();
        const animationLoop = () => {
            // If we started a new animation then cancel this one
            if (this.scrollingId !== thisScrollsId) {
                return;
            }

            // Calculate how long between loops we were and increment the progress time
            const startLoopTime = Date.now();
            const deltaTime = startLoopTime - previousLoopTime;
            scrollProgressMs += deltaTime;

            // Figure out where we need to scroll to
            const newLeft = this.#calculateSlideDeckOffset(slideToScrollTo);

            // If we are still in the animation
            if (scrollProgressMs < scrollDurationMs) {

                // Use the easing function to do a nicer animation
                const easedPercent = easingInOutCubic(scrollProgressMs / scrollDurationMs);

                // Based on the end, start, and how far into the animation we are
                // determine where we need to set the left value to
                const lerpLeft = lerp(oldLeft, newLeft, easedPercent);

                // Set the left style to simulate a scroll
                this.slideDeck.style.left = `${lerpLeft}px`;

                // Request the next animation frame for the next loop
                window.requestAnimationFrame(animationLoop);

            // If the animation has finished
            } else {

                // Once the animation set the left to what the target endpoint it
                // this is in case the scrollProgressMs makes the animation percent not 100%
                this.slideDeck.style.left = `${newLeft}px`;
                this.scrollingId = null;
            }
            previousLoopTime = startLoopTime;
        };

        // Start the animation loop
        window.requestAnimationFrame(animationLoop);
    }

    /**
     * Determine where the slide deck's left style needs to be to have the slide in the middle of the container
     * @param { HTMLElement } targetSlide Slide we are calculating for
     * @returns { Number } The px that the left style of the slide deck should be set to
     */
    #calculateSlideDeckOffset(targetSlide) {
        const slideMidPoint = targetSlide.offsetWidth / 2;
        const slideOffsetToList = targetSlide.offsetLeft;
        const wrapperMidPoint = this.slideshowContainer.offsetWidth / 2;

        const getMidItemToLeftEdge = (-1 * ( slideOffsetToList + slideMidPoint));

        // If we are in multi-view then images snap to edge
        if (this.multiViewSlidePosition === 'left') {

            // Determine the width (in px) the css var --gap is
            const dummy = document.createElement('div');
            dummy.style.position = 'absolute';
            dummy.style.visibility = 'hidden';
            dummy.style.width = 'var(--gap, 1rem)';
            this.slideshowContainer.appendChild(dummy);
            const gapPx = dummy.getBoundingClientRect().width;
            this.slideshowContainer.removeChild(dummy);

            return getMidItemToLeftEdge + slideMidPoint + gapPx;
        } else if (this.multiViewSlidePosition === 'right') {

            // Determine the width (in px) the css var --gap is
            const dummy = document.createElement('div');
            dummy.style.position = 'absolute';
            dummy.style.visibility = 'hidden';
            dummy.style.width = 'var(--gap, 1rem)';
            this.slideshowContainer.appendChild(dummy);
            const gapPx = dummy.getBoundingClientRect().width;
            this.slideshowContainer.removeChild(dummy);

            return getMidItemToLeftEdge + (wrapperMidPoint * 2) - slideMidPoint - gapPx;
        }

        return getMidItemToLeftEdge + wrapperMidPoint;
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

        if (this.layout === 'multi-view') {
            this.#multiViewSwapSlides(newCurrentSlideIndex);
        } else if (this.transition === 'fade') {
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

        if (this.layout === 'multi-view') {
            this.#multiViewSwapSlides(newCurrentSlideIndex);
        } else if (this.transition === 'fade') {
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
            throw new Error('This slideshow needs attribute `data-play` to be able to use this method');
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
            throw new Error('This slideshow needs attribute `data-play` to be able to use this method');
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
            throw new Error('This slideshow needs attribute `data-play` to be able to use this method');
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

        if (this.layout === 'multi-view') {
            this.#multiViewSwapSlides(index);
        } else {
            this.#swapSlides(index);
        }
    }
}
