import { uuidv4 } from '../dcf-utility.js';
import DCFButtonToggles from './dcf-button-toggle.js';

export default class DCFPopup {
  // Create a random ID for the button
  uuid = uuidv4();
  popupElement = null;
  popupButton = null;
  popupContent = null;
  closeButtons = [];

  toggleButtonObj = null;

  popupClassList = [
    'dcf-relative',
  ];

  popupButtonClassList = [];

  popupContentClassList = [
    'dcf-absolute',
    'dcf-z-modal-fullscreen'
  ];

  // This is for when we our mouse leaves and comes back
  // This is helpful for the point option for the popup
  hoverTimeoutDuration = 250;

  // Set up the button
  constructor(popupElement, options = {}) {
    // Event intended for closing any open popups
    this.popupOpenEvent = new Event(DCFPopup.events('popupOpen'));

    // Events for controlling toggle button
    this.commandOpen = new Event(DCFButtonToggles.events('commandOpen'));
    this.commandClose = new Event(DCFButtonToggles.events('commandClose'));
    this.commandToggle = new Event(DCFButtonToggles.events('commandToggle'));

    this.positions = [ 'top', 'bottom', 'left', 'right' ];
    this.alignments = [ 'start', 'center', 'end' ];

    this.popupElement = popupElement;

    // Adds any classes to the popup
    if (this.popupClassList) {
      this.popupClassList.forEach((cssClass) => {
        this.popupElement.classList.add(cssClass);
      });
    }

    // Gets the button and validates it
    this.popupButton = this.popupElement.querySelector(':scope > .dcf-btn-toggle-popup, :scope > .dcf-btn-popup');
    if (this.popupButton === null || this.popupButton.tagName !== 'BUTTON') {
      throw new Error('Popup Button Is Missing Or Not A Button Tag');
    }

    // Gets the content and validates it
    this.popupContent = this.popupElement.querySelector(':scope > .dcf-popup-content');
    if (this.popupContent === null) {
      throw new Error('Popup Content Is Missing');
    }

    // We need do do some funky stuff to get the correct close button and not the nested one
    this.closeButtons = this.popupElement.querySelectorAll(
      ':scope > .dcf-popup-content > .dcf-btn-close-popup' +
      ', :scope > .dcf-popup-content > .dcf-btn-popup-close' +
      `, :scope > .dcf-popup-content .dcf-btn-close-popup[data-for="${this.popupElement.id}"]` +
      `, :scope > .dcf-popup-content .dcf-btn-popup-close[data-for="${this.popupElement.id}"]`
    );

    this.closeButtons.forEach((closeButton) => {
      if (closeButton !== null && closeButton.tagName !== 'BUTTON') {
        throw new Error('Close Button is Not a Button Tag');
      }
    });

    // Sets the IDs for the btn and content if they aren't already set
    if (this.popupElement.id === '') {
      this.popupElement.id = this.uuid.concat(`-popup`);
    }
    if (this.popupButton.id === '') {
      this.popupButton.id = this.uuid.concat(`-popup-btn`);
    }
    if (this.popupContent.id === '') {
      this.popupContent.id = this.uuid.concat(`-popup-content`);
    }

    // Adds any classes to the
    if (this.popupButtonClassList) {
      //TODO: use the spread operator
      this.popupButtonClassList.forEach((cssClass) => {
        this.popupButton.classList.add(cssClass);
      });
    }
    if (this.popupContentClassList) {
      this.popupContentClassList.forEach((cssClass) => {
        this.popupContent.classList.add(cssClass);
      });
    }

    // Sets up button-toggle related attributes
    this.popupButton.dataset.controls = this.popupContent.id;
    this.popupButton.dataset.startExpanded = 'false';

    // Sets up position classes
    this.#addPositionClasses();

    this.toggleButtonObj = new DCFButtonToggles(this.popupButton);

    // if there is a close button and its clicked close the popup
    this.closeButtons.forEach((closeButton) => {
      closeButton.addEventListener('click', () => {
        this.popupButton.dispatchEvent(this.commandClose);
      });
    });

    // When a popup is toggled open it will dispatch an event
    this.popupContent.addEventListener(DCFButtonToggles.events('toggleElementOn'), () => {
      this.popupElement.dispatchEvent(this.popupOpenEvent);
    });

    // If any popup on the document opens and it doesn't match we will close
    document.addEventListener(DCFPopup.events('popupOpen'), (event) => {
      // Check if event is coming from a child popup
      let eventIsFromTheInside = false;
      this.popupElement.querySelectorAll('.dcf-popup').forEach((innerPopup) => {
        if (innerPopup.id === event.target.id) {
          eventIsFromTheInside = true;
        }
      });

      // If it is not coming from child and it is not this popup then close the popup
      if (!eventIsFromTheInside && event.target.id !== this.popupElement.id) {
        this.popupElement.dispatchEvent(this.commandClose);
      }
    }, true);

    // If we click outside the popup close the popup
    // Event listener is on body since we want to check if we click anywhere but element
    document.body.addEventListener('click', (event) => {
      if (!this.popupElement.contains(event.target)) {
        this.popupButton.dispatchEvent(this.commandClose);
      }
    }, true);


    // if the popup has a data attribute hover it will set up the hover event listeners
    if (this.popupElement.dataset.hover === 'true') {
      // Set up the mouse leave event listener
      // (This will not fire when moving from one child to the next)
      this.popupElement.addEventListener('mouseleave', () => {
        // If there is a point it will have a gap so we want to make sure they are definitely gone
        // If they enter again it will cancel out this timeout
        // Stores the timeout value in the data attribute on the element since it is element specific
        this.popupElement.dataset.hoverTimeout = setTimeout(() => {
          this.popupElement.removeAttribute('data-hover-timeout');

          // This button is a toggle button secretly so we can control it via its event listeners
          this.popupButton.dispatchEvent(this.commandClose);
        }, this.hoverTimeoutDuration);
      });

      // Sets up the mouse enter event listener
      // this is more normal than the leave one
      this.popupElement.addEventListener('mouseenter', () => {
        // If we come back before the timeout is over then we can cancel it and remove it
        clearTimeout(this.popupElement.dataset.hoverTimeout);
        this.popupElement.removeAttribute('data-hover-timeout');

        // This button is a toggle button secretly so we can control it via its event listeners
        this.popupButton.dispatchEvent(this.commandOpen);
      });
    }

    if (this.popupElement.getAttribute('hidden') !== null) {
      this.popupElement.removeAttribute('hidden');
    }
  }

  // The names of the events to be used easily
  static events(name) {
    // Define any new events
    const events = {
      popupOpen: 'popupOpen',
    };
    Object.freeze(events);

    // Forward the events from the DCFButtonToggles
    if (DCFButtonToggles.events(name) !== undefined) {
      return DCFButtonToggles.events(name);
    }

    // Return the name of the event if it exists if not it will return undefined
    return name in events ? events[name] : undefined;
  }

  /**
   * Sets up the DCF classes for the popup content based on the popup data attributes
   */
  #addPositionClasses() {
    // Gets the position data attribute and checks it
    let position = this.popupElement.dataset.position;
    if (position === undefined) {
      position = 'bottom'; // Set default value
    } else if (!this.positions.includes(position)) {
      throw new Error('Invalid Position On Popup'); // error is if it is invalid
    }

    // Gets the alignment data attribute and checks it
    let alignment = this.popupElement.dataset.alignment;
    if (alignment === undefined) {
      alignment = 'center'; // Sets default value
    } else if (!this.alignments.includes(alignment)) {
      throw new Error('Invalid Alignment On Popup'); // Error if it is not set
    }

    // Set up position specific classes
    if (position === 'top') {
      this.popupContent.classList.add('dcf-bottom-100%');
    } else if (position === 'bottom') {
      this.popupContent.classList.add('dcf-top-100%');
    } else if (position === 'left') {
      this.popupContent.classList.add('dcf-right-100%');
    } else if (position === 'right') {
      this.popupContent.classList.add('dcf-left-100%');
    }

    // Set up alignment classes
    if (position === 'top' || position === 'bottom') {
      if (alignment === 'start') {
        this.popupContent.classList.add('dcf-left-0');
      } else if (alignment === 'end') {
        this.popupContent.classList.add('dcf-right-0');
      } else if (alignment === 'center') {
        this.popupContent.classList.add('dcf-left-50%');
      }
    } else if (position === 'left' || position === 'right') {
      if (alignment === 'start') {
        this.popupContent.classList.add('dcf-top-0');
      } else if (alignment === 'end') {
        this.popupContent.classList.add('dcf-bottom-0');
      } else if (alignment === 'center') {
        this.popupContent.classList.add('dcf-top-50%');
      }
    }
  }
}
