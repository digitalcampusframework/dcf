class DCFSlideshow {
  constructor(slideshows, uls, openCaption, closeCaption) {
    this.slideshows = slideshows;
    this.uls = uls;
    this.openCaptionEvent = openCaption;
    this.closeCaptionEvent = closeCaption;
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

      caption.dispatchEvent(this.openCaptionEvent);
    } else {
      // Remove class to show content
      caption.classList.remove('dcf-invisible');
      // Update ARIA attributes
      button.setAttribute('aria-expanded', 'true');
      button.setAttribute('aria-label', 'Hide caption');
      caption.setAttribute('aria-hidden', 'false');
      caption.classList.remove('dcf-invisible', 'dcf-opacity-0', 'dcf-pointer-events-none');
      caption.classList.add('dcf-opacity-1', 'dcf-pointer-events-auto');
      caption.dispatchEvent(this.closeCaptionEvent);
    }
  }

  // Functions for intersection observer.

  scrollIt(slideToShow, slides, slidedeck) {
    let scrollPos = Array.prototype.indexOf.call(slides, slideToShow) * (slidedeck.scrollWidth / slides.length);
    slidedeck.scrollLeft = scrollPos;
  }

  showSlide(dir, slideshow, slides, slidedeck) {
    let visible = slideshow.querySelectorAll('[aria-label = "slideshow"] .visible');
    let index = dir === 'previous' ? DCFUtility.magicNumbers('int0') : DCFUtility.magicNumbers('int1');

    if (visible.length > DCFUtility.magicNumbers('int1')) {
      this.scrollIt(visible[index], slides, slidedeck);
    } else {
      let newSlide = index === DCFUtility.magicNumbers('int0') ?
        visible[DCFUtility.magicNumbers('int0')].previousElementSibling :
        visible[DCFUtility.magicNumbers('int0')].nextElementSibling;
      if (newSlide) {
        this.scrollIt(newSlide, slides, slidedeck);
      }
    }
  }

  callback(slides) {
    Array.prototype.forEach.call(slides, (entry) => {
      entry.target.classList.remove('visible');
      let slide = entry.target.querySelector('div');
      slide.setAttribute('tabindex', '-1');
      if (!entry.intersectionRatio > DCFUtility.magicNumbers('int0')) {
        return;
      }
      let img = entry.target.querySelector('img');
      if (img.dataset.src) {
        img.setAttribute('src', img.dataset.src);
        img.removeAttribute('data-src');
      }
      entry.target.classList.add('visible');
      slide.removeAttribute('tabindex', '-1');
    });
  }

  initialize() {
    Array.prototype.forEach.call(this.slideshows, (slideshow, slideshowIndex) => {
      let slidedeck = this.uls[slideshowIndex];
      let slides = slideshow.querySelectorAll('.dcf-slideshow li');
      let figures = slideshow.querySelectorAll('dcf-slideshow figure');
      let captions = slideshow.querySelectorAll('dcf-slideshow figcaption');
      let uuid = DCFUtility.uuidv4();

      // Set a unique ID for each slideshow
      slideshow.setAttribute('id', uuid.concat('-slideshow'));

      // Add classes to slideshow unordered lists
      slidedeck.classList.add('dcf-slide-deck');

      // Create slideshow controls (previous/next slide buttons)
      let ctrls = document.createElement('ul');
      let ctrlPrevious = document.createElement('li');
      let ctrlNext = document.createElement('li');
      let ctrlPreviousButton = document.createElement('button');
      let ctrlNextButton = document.createElement('button');

      // Add classes to slideshow controls group (Keep in DCF)
      ctrls.classList.add('dcf-list-bare', 'dcf-btn-group', 'dcf-absolute', 'dcf-pin-right', 'dcf-pin-bottom', 'dcf-z-1');

      // Add role and aria-label to controls group
      ctrls.setAttribute('role', 'group');
      ctrls.setAttribute('aria-label', 'slideshow controls');

      ctrlPreviousButton.classList.add('dcf-btn', 'dcf-btn-primary', 'dcf-button-slide', 'dcf-btn-slide-prev');
      ctrlPreviousButton.setAttribute('aria-label', 'previous');

      ctrlNextButton.classList.add('dcf-btn', 'dcf-btn-primary', 'dcf-btn-slide', 'dcf-btn-slide-next');
      ctrlNextButton.setAttribute('aria-label', 'next');

      ctrlPrevious.setAttribute('id', 'previous');
      ctrlNext.setAttribute('id', 'next');
      // Add relative class for absolute positioning of slideshow controls
      slideshow.classList.add('dcf-relative');
      // Append controls (previous/next slide) to slideshow
      ctrlPrevious.appendChild(ctrlPreviousButton);
      ctrlNext.appendChild(ctrlNextButton);
      ctrls.appendChild(ctrlPrevious);
      ctrls.appendChild(ctrlNext);
      slideshow.appendChild(ctrls);

      // Slides
      Array.prototype.forEach.call(slides, (slide, slideIndex) => {
        // Set unique ID for each slide
        slide.setAttribute('id', uuid.concat('-slide-', slideIndex));
        // Add classes to each slide
        slide.classList.add('dcf-slide', 'dcf-relative');
        slide.querySelector('div').setAttribute('tabindex', '-1');
      });

      Array.prototype.forEach.call(figures, (figure, figureIndex) => {
        let caption = captions[figureIndex];

        if (!(typeof caption == 'undefined')) {
          // Create button to show/hide caption
          let captionBtn = document.createElement('button');
          // Add classes to each caption toggle button
          captionBtn.classList.add('dcf-btn', 'dcf-btn-slide', 'dcf-btn-slide-caption');
          // Create a unique ID for each caption toggle button
          captionBtn.setAttribute('id', uuid.concat('-button-', figureIndex));
          // Add ARIA attributes to each caption toggle button
          captionBtn.setAttribute('aria-controls', uuid.concat('-caption-', figureIndex));
          captionBtn.setAttribute('aria-label', 'Show caption');
          captionBtn.setAttribute('aria-expanded', 'false');
          // Add class to each figure
          figure.classList.add('dcf-slide-figure');
          // Append caption toggle button to each figure
          figure.appendChild(captionBtn);
          // Style each caption
          // Might be something here!!!!!
          caption.classList.add('dcf-opacity-0', 'dcf-pointer-events-none', 'dcf-invisible', 'dcf-slide-caption', 'dcf-figcaption');
          // Create a unique ID for each caption
          caption.setAttribute('id', uuid.concat('-caption-', figureIndex));
          // Add ARIA attributes to each caption
          caption.setAttribute('aria-labelledby', uuid.concat('-button-', figureIndex));
          caption.setAttribute('aria-hidden', 'true');
        }
      });

      // WIP for Content slider:  https://codepen.io/heydon/pen/xPWOLp?editors=0010

      let observerSettings = {
        root: slideshow,
        rootMargin: '-10px'
      };
      if ('IntersectionObserver' in window) {
        let observer = new IntersectionObserver(this.callback, observerSettings);
        Array.prototype.forEach.call(slides, (elem) => {
          return observer.observe(elem);
        });
        ctrlPrevious.addEventListener('click', () => {
          this.showSlide(ctrlPrevious.getAttribute('id'), slideshow, slides, slidedeck);
        });

        ctrlNext.addEventListener('click', () => {
          this.showSlide(ctrlNext.getAttribute('id'), slideshow, slides, slidedeck);
        });
      } else {
        Array.prototype.forEach.call(slides, (slide) => {
          let img = slide.querySelector('img');
          img.setAttribute('src', img.getAttribute('data-src'));
        });
      }
    });

    // Caption toggle buttons
    let buttons = document.querySelectorAll('.dcf-btn-slide-caption');
    [].forEach.call(buttons, (button) => {
      let caption = button.previousElementSibling;
      // Handle Click
      button.addEventListener('click', (onClick) => {
        this.captionClasses(onClick.currentTarget, caption);
        return false;
      }, false);

      // Show caption when the 'space' key is pressed
      button.addEventListener('keydown', (onSpace) => {
        // Handle 'space' key
        if (onSpace.which === DCFUtility.magicNumbers('spaceKeyCode')) {
          onSpace.preventDefault();
          this.captionClasses(onSpace.currentTarget, caption);
        }
      }, false);
    });
  }
}
