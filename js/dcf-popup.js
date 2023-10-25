import { DCFUtility } from './dcf-utility';
import { DCFToggleButton } from './dcf-button-toggle';

export class DCFPopupTheme {
  // Sets up the theme
  constructor() {
    this.popupClassList = [
      'dcf-relative',
    ];

    this.popupButtonClassList = [
    ];

    this.popupContentClassList = [
      'dcf-absolute',
      'dcf-z-modal-fullscreen'
    ];

    // This is for when we our mouse leaves and comes back
    // This is helpful for the point option for the popup
    this.hoverTimeoutDuration = 250;
  }

  // Allows us to set the theme variables if they are defined and we match the types
  setThemeVariable(themeVariableName, value) {
    if (themeVariableName in this && typeof value == typeof this[themeVariableName]) {
      this[themeVariableName] = value;
    }
  }
}

export class DCFPopup {
  // Set up the button
  constructor(popups, theme) {
    if (theme instanceof DCFPopupTheme) {
      this.theme = theme;
    } else {
      this.theme = new DCFPopupTheme();
    }

    // Event intended for closing any open popups
    this.popupOpenEvent = new Event(DCFPopup.events('popupOpen'));

    // Events for controlling toggle button
    this.commandOpen = new Event(DCFToggleButton.events('commandOpen'));
    this.commandClose = new Event(DCFToggleButton.events('commandClose'));
    this.commandToggle = new Event(DCFToggleButton.events('commandToggle'));

    this.positions = [ 'top', 'bottom', 'left', 'right' ];
    this.alignments = [ 'start', 'center', 'end' ];

    // Create a random ID for the button
    this.uuid = DCFUtility.uuidv4();

    // Store the button inputted (always will be an array )
    this.popups = popups;
    if (NodeList.prototype.isPrototypeOf(this.popups)) {
      this.popups = Array.from(this.popups);
    } else if (!Array.isArray(this.popups)) {
      this.popups = [ this.popups ];
    }
  }

  // The names of the events to be used easily
  static events(name) {
    // Define any new events
    const events = {
      popupOpen: 'popupOpen',
    };
    Object.freeze(events);

    // Forward the events from the DCFToggleButton
    if (DCFToggleButton.events(name) !== undefined) {
      return DCFToggleButton.events(name);
    }

    // Return the name of the event if it exists if not it will return undefined
    return name in events ? events[name] : undefined;
  }

  // Initialize the popup that were inputted in the constructor
  initialize() {
    // Loops through each one
    this.popups.forEach((popup, index) => {
      // Adds any classes from the theme to the popup
      if (this.theme.popupClassList) {
        this.theme.popupClassList.forEach((cssClass) => {
          popup.classList.add(cssClass);
        });
      }

      // Gets the button and validates it
      const popupBtn = popup.querySelector(':scope > .dcf-btn-toggle-popup, :scope > .dcf-btn-popup');
      if (popupBtn === null || popupBtn.tagName !== 'BUTTON') {
        throw new Error('Popup Button Is Missing Or Not A Button Tag');
      }

      // Gets the content and validates it
      const popupContent = popup.querySelector(':scope > .dcf-popup-content');
      if (popupContent === null) {
        throw new Error('Popup Content Is Missing');
      }

      // We need do do some funky stuff to get the correct close button and not the nested one
      const closeButton = popup.querySelector(
        ':scope > .dcf-popup-content > .dcf-btn-close-popup, :scope > .dcf-popup-content > .dcf-btn-popup-close'
      );
      if (closeButton !== null && closeButton.tagName !== 'BUTTON') {
        throw new Error('Close Button is Not a Button Tag');
      }

      // Sets the IDs for the btn and content if they aren't already set
      if (popup.id === '') {
        popup.id = this.uuid.concat(`-popup-${index}`);
      }
      if (popupBtn.id === '') {
        popupBtn.id = this.uuid.concat(`-popup-btn-${index}`);
      }
      if (popupContent.id === '') {
        popupContent.id = this.uuid.concat(`-popup-content-${index}`);
      }

      // Adds any classes to the theme
      if (this.theme.popupButtonClassList) {
        this.theme.popupButtonClassList.forEach((cssClass) => {
          popupBtn.classList.add(cssClass);
        });
      }
      if (this.theme.popupContentClassList) {
        this.theme.popupContentClassList.forEach((cssClass) => {
          popupContent.classList.add(cssClass);
        });
      }

      // Sets up button-toggle related attributes
      popupBtn.dataset.controls = popupContent.id;
      popupBtn.dataset.startExpanded = 'false';

      // Sets up position classes
      this.addPositionClasses(popup, popupContent);

      // Initializes the toggle button
      const toggleButtonObj = new DCFToggleButton(popupBtn);
      toggleButtonObj.initialize();

      // if there is a close button and its clicked close the popup
      if (closeButton !== null) {
        closeButton.addEventListener('click', () => {
          popupBtn.dispatchEvent(this.commandClose);
        });
      }

      // When a popup is toggled open it will dispatch an event
      popupContent.addEventListener(DCFToggleButton.events('toggleElementOn'), () => {
        popup.dispatchEvent(this.popupOpenEvent);
      });

      // If any popup on the document opens and it doesn't match we will close
      document.addEventListener(DCFPopup.events('popupOpen'), (event) => {
        // Check if event is coming from a child popup
        let eventIsFromTheInside = false;
        popup.querySelectorAll('.dcf-popup').forEach((innerPopup) => {
          if (innerPopup.id === event.target.id) {
            eventIsFromTheInside = true;
          }
        });

        // If it is not coming from child and it is not this popup then close the popup
        if (!eventIsFromTheInside && event.target.id !== popup.id) {
          popupBtn.dispatchEvent(this.commandClose);
        }
      }, true);

      // If we click outside the popup close the popup
      // Event listener is on body since we want to check if we click anywhere but element
      document.body.addEventListener('click', (event) => {
        if (!popup.contains(event.target)) {
          popupBtn.dispatchEvent(this.commandClose);
        }
      }, true);


      // if the popup has a data attribute hover it will set up the hover event listeners
      if (popup.dataset.hover === 'true') {
        // Set up the mouse leave event listener
        // (This will not fire when moving from one child to the next)
        popup.addEventListener('mouseleave', () => {
          // If there is a point it will have a gap so we want to make sure they are definitely gone
          // If they enter again it will cancel out this timeout
          // Stores the timeout value in the data attribute on the element since it is element specific
          popup.dataset.hoverTimeout = setTimeout(() => {
            popup.removeAttribute('data-hover-timeout');

            // This button is a toggle button secretly so we can control it via its event listeners
            popupBtn.dispatchEvent(this.commandClose);
          }, this.theme.hoverTimeoutDuration);
        });

        // Sets up the mouse enter event listener
        // this is more normal than the leave one
        popup.addEventListener('mouseenter', () => {
          // If we come back before the timeout is over then we can cancel it and remove it
          clearTimeout(popup.dataset.hoverTimeout);
          popup.removeAttribute('data-hover-timeout');

          // This button is a toggle button secretly so we can control it via its event listeners
          popupBtn.dispatchEvent(this.commandOpen);
        });
      }

      if (popup.getAttribute('hidden') !== null) {
        popup.removeAttribute('hidden');
      }
    });
  }

  /**
   * Sets up the DCF classes for the popup content based on the popup data attributes
   * @param {HTMLDivElement} popup Popup Div
   * @param {HTMLDivElement} popupContent Popups content Div
   */
  addPositionClasses(popup, popupContent) {
    // Gets the position data attribute and checks it
    let position = popup.dataset.position;
    if (position === undefined) {
      position = 'bottom'; // Set default value
    } else if (!this.positions.includes(position)) {
      throw new Error('Invalid Position On Popup'); // error is if it is invalid
    }

    // Gets the alignment data attribute and checks it
    let alignment = popup.dataset.alignment;
    if (alignment === undefined) {
      alignment = 'center'; // Sets default value
    } else if (!this.alignments.includes(alignment)) {
      throw new Error('Invalid Alignment On Popup'); // Error if it is not set
    }

    // Set up position specific classes
    if (position === 'top') {
      popupContent.classList.add('dcf-bottom-100%');
    } else if (position === 'bottom') {
      popupContent.classList.add('dcf-top-100%');
    } else if (position === 'left') {
      popupContent.classList.add('dcf-right-100%');
    } else if (position === 'right') {
      popupContent.classList.add('dcf-left-100%');
    }

    // Set up alignment classes
    if (position === 'top' || position === 'bottom') {
      if (alignment === 'start') {
        popupContent.classList.add('dcf-left-0');
      } else if (alignment === 'end') {
        popupContent.classList.add('dcf-right-0');
      } else if (alignment === 'center') {
        popupContent.classList.add('dcf-left-50%');
      }
    } else if (position === 'left' || position === 'right') {
      if (alignment === 'start') {
        popupContent.classList.add('dcf-top-0');
      } else if (alignment === 'end') {
        popupContent.classList.add('dcf-bottom-0');
      } else if (alignment === 'center') {
        popupContent.classList.add('dcf-top-50%');
      }
    }
  }
}
