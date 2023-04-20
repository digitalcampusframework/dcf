import { DCFUtility } from './dcf-utility';

export class DCFToggleButton {
  // Set up the button
  constructor(toggleButtons, options = {}) {
    // Create the events for toggling the button and element
    this.toggleButtonOn = new Event(DCFToggleButton.events('toggleButtonOn'));
    this.toggleButtonOff = new Event(DCFToggleButton.events('toggleButtonOff'));
    this.toggleElementOn = new Event(DCFToggleButton.events('toggleElementOn'));
    this.toggleElementOff = new Event(DCFToggleButton.events('toggleElementOff'));

    // Copy the Keys without copying the references
    // Objects plus their properties and arrays are pass by reference
    this.toggleKeys = [];
    if (Array.isArray(options.toggleKeys)) {
      this.toggleKeys = [ ...options.toggleKeys ];
    } else if (options.toggleKeys !== null && options.toggleKeys !== undefined && options.toggleKeys !== '') {
      this.toggleKeys.push(options.toggleKeys);
    }
    this.onKeys = [];
    if (Array.isArray(options.onKeys)) {
      this.onKeys = [ ...options.onKeys ];
    } else if (options.onKeys !== null && options.onKeys !== undefined && options.onKeys !== '') {
      this.onKeys.push(options.onKeys);
    }
    this.offKeys = [];
    if (Array.isArray(options.offKeys)) {
      this.offKeys = [ ...options.offKeys ];
    } else if (options.offKeys !== null && options.offKeys !== undefined && options.offKeys !== '') {
      this.offKeys.push(options.offKeys);
    }

    // These keys will always work
    if (!this.toggleKeys.includes('space')) {
      this.toggleKeys.push('space');
    }
    if (!this.offKeys.includes('escape')) {
      this.offKeys.push('escape');
    }

    // Create a random ID for the button
    this.uuid = DCFUtility.uuidv4();

    // Store the button inputted (always will be an array)
    this.toggleButtons = toggleButtons;
    if (NodeList.prototype.isPrototypeOf(this.toggleButtons)) {
      this.toggleButtons = Array.from(this.toggleButtons);
    } else if (!Array.isArray(this.toggleButtons)) {
      this.toggleButtons = [ this.toggleButtons ];
    }
  }

  // The names of the events to be used easily
  static events(name) {
    const events = {
      toggleButtonOn: 'toggleButtonOn',
      toggleButtonOff: 'toggleButtonOff',
      toggleElementOn: 'toggleElementOn',
      toggleElementOff: 'toggleElementOff',
      commandClose: 'commandClose',
      commandOpen: 'commandOpen',
      commandToggle: 'commandToggle',
    };
    Object.freeze(events);

    return name in events ? events[name] : undefined;
  }

  // Initialize the buttons that were inputted in the constructor
  initialize() {
    // loops through each one
    this.toggleButtons.forEach((toggleButton) => {
      // Gets the info for the thing the button is toggling
      const toggleElementId = toggleButton.dataset.controls;
      const toggleElement = document.getElementById(toggleElementId);
      if (toggleElement === null) {
        throw new Error('Missing Toggle Element');
      }

      // Gets the info for setting up the button
      let toggleButtonIdPostfix = toggleButton.dataset.postfix;
      if (toggleButtonIdPostfix === undefined) {
        toggleButtonIdPostfix = '';
      }
      let toggleButtonStartExpanded = toggleButton.dataset.startExpanded;
      if (toggleButtonStartExpanded === undefined) {
        toggleButtonStartExpanded = 'false';
      }

      // if it does not have an ID set it to a random one
      if (toggleButton.id === '') {
        toggleButton.id = this.uuid.concat('-button-', toggleButtonIdPostfix);
      }

      // set the attributes for the button
      toggleButton.setAttribute('aria-controls', toggleElementId);

      // set the attributes for the thing being toggled
      if (toggleElement.getAttribute('aria-labelledby') !== null &&
      toggleElement.getAttribute('aria-labelledby') !== toggleButton.id) {
        throw new Error('Toggle Element Already Has Toggle Button');
      }
      toggleElement.setAttribute('aria-labelledby', toggleButton.id);

      // ToggleSwitched will set many of the other attributes and styles
      const expandedState = toggleButtonStartExpanded === 'true' ? 'open' : 'close';
      this.toggleSwitched(toggleButton, toggleElement, expandedState);

      // set up the event listeners for the button and element
      this.eventListeners(toggleButton, toggleElement);
    });
  }

  // sets up the event listeners for the button
  eventListeners(toggleButton, toggleElement) {
    // Toggle the element when button is clicked
    toggleButton.addEventListener('click', (clickEvent) => {
      const switched = this.toggleSwitched(toggleButton, toggleElement);
      if (switched) {
        clickEvent.preventDefault();
      }
    }, false);

    // Show/hide element when the 'space' key is pressed
    // Hide element when the `escape` is pressed
    toggleButton.addEventListener('keydown', (keydownEvent) => {
      this.toggleKeys.forEach((key) => {
        if (DCFUtility.isKeyEvent(keydownEvent, DCFUtility.keyEvents(key))) {
          const switched = this.toggleSwitched(toggleButton, toggleElement);
          if (switched) {
            keydownEvent.preventDefault();
          }
        }
      });
      this.onKeys.forEach((key) => {
        if (DCFUtility.isKeyEvent(keydownEvent, DCFUtility.keyEvents(key))) {
          const switched = this.toggleSwitched(toggleButton, toggleElement, 'open');
          if (switched) {
            keydownEvent.preventDefault();
          }
        }
      });
      this.offKeys.forEach((key) => {
        if (DCFUtility.isKeyEvent(keydownEvent, DCFUtility.keyEvents(key))) {
          const switched = this.toggleSwitched(toggleButton, toggleElement, 'close');
          if (switched) {
            keydownEvent.preventDefault();
          }
        }
      });
    }, false);

    toggleButton.addEventListener(DCFToggleButton.events('commandOpen'), () => {
      this.toggleSwitched(toggleButton, toggleElement, 'open');
    });
    toggleButton.addEventListener(DCFToggleButton.events('commandClose'), () => {
      this.toggleSwitched(toggleButton, toggleElement, 'close');
    });
    toggleButton.addEventListener(DCFToggleButton.events('commandToggle'), () => {
      this.toggleSwitched(toggleButton, toggleElement);
    });

    toggleElement.addEventListener(DCFToggleButton.events('commandOpen'), () => {
      this.toggleSwitched(toggleButton, toggleElement, 'open');
    });
    toggleElement.addEventListener(DCFToggleButton.events('commandClose'), () => {
      this.toggleSwitched(toggleButton, toggleElement, 'close');
    });
    toggleElement.addEventListener(DCFToggleButton.events('commandToggle'), () => {
      this.toggleSwitched(toggleButton, toggleElement);
    });
  }

  // Handles the logic for the button
  // This will only call the animations
  toggleSwitched(toggleButton, toggleElement, state = '') {
    // Gets the labels for the button
    const toggleButtonLabelOn = toggleButton.dataset.labelOn;
    const toggleButtonLabelOff = toggleButton.dataset.labelOff;

    // Toggled On
    if ((toggleButton.getAttribute('aria-expanded') === 'false' ||
      toggleButton.getAttribute('aria-expanded') === null ||
      toggleButton.getAttribute('aria-expanded') === '') &&
      (state === 'open' || state === '')
    ) {
      toggleButton.setAttribute('aria-expanded', 'true');
      toggleButton.setAttribute('aria-label', toggleButtonLabelOff);
      toggleButton.dispatchEvent(this.toggleButtonOn);

      toggleElement.setAttribute('aria-hidden', 'false');
      toggleElement.classList.remove('dcf-opacity-0', 'dcf-pointer-events-none');
      toggleElement.classList.add('dcf-opacity-100', 'dcf-pointer-events-auto');
      toggleElement.dispatchEvent(this.toggleElementOn);
      toggleElement.focus();
      return true;

    // Toggle Off
    } else if ((toggleButton.getAttribute('aria-expanded') === 'true' ||
      toggleButton.getAttribute('aria-expanded') === null ||
      toggleButton.getAttribute('aria-expanded') === '') &&
      (state === 'close' || state === '')
    ) {
      toggleButton.setAttribute('aria-expanded', 'false');
      toggleButton.setAttribute('aria-label', toggleButtonLabelOn);
      toggleButton.dispatchEvent(this.toggleButtonOff);

      toggleElement.setAttribute('aria-hidden', 'true');
      toggleElement.classList.remove('dcf-opacity-100', 'dcf-pointer-events-auto');
      toggleElement.classList.add('dcf-pointer-events-none', 'dcf-opacity-0');
      toggleElement.dispatchEvent(this.toggleElementOff);
      return true;
    }

    return false;
  }
}
