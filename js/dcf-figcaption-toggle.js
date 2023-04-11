import { DCFUtility } from './dcf-utility';
import { DCFToggleButton } from './dcf-button-toggle';

export class DCFFigcaptionToggleTheme {
  // Sets up the theme
  constructor() {
    this.toggleButtonInnerHTML = `<svg class="dcf-h-4 dcf-w-4 dcf-fill-current"
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

    this.toggleButtonClassList = [
      'dcf-btn',
      'dcf-btn-inverse-tertiary',
      'dcf-absolute',
      'dcf-z-1',
      'dcf-d-flex',
      'dcf-ai-center',
      'dcf-pt-4',
      'dcf-pb-4',
      'dcf-white',
      'dcf-btn-toggle-figcaption'
    ];

    this.figcaptionClassList = [
      'dcf-absolute',
      'dcf-left-0',
      'dcf-top-0',
      'dcf-h-100%',
      'dcf-w-100%',
      'dcf-z-1',
      'dcf-figcaption-toggle'
    ];
  }

  // Allows us to set the theme variables if they are defined and we match the types
  setThemeVariable(themeVariableName, value) {
    if (themeVariableName in this && typeof value == typeof this[themeVariableName]) {
      this[themeVariableName] = value;
    }
  }
}

export class DCFFigcaptionToggle {
  // Set up the button
  constructor(figcaptions, theme, options = {}) {
    if (theme instanceof DCFFigcaptionToggleTheme) {
      this.theme = theme;
    } else {
      this.theme = new DCFFigcaptionToggleTheme();
    }

    this.toggleKeys = options.toggleKeys;
    if (this.toggleKeys === undefined) {
      this.toggleKeys = [];
    }
    this.onKeys = options.onKeys;
    if (this.onKeys === undefined) {
      this.onKeys = [];
    }
    this.offKeys = options.offKeys;
    if (this.offKeys === undefined) {
      this.offKeys = [];
    }

    // Create a random ID for the button
    this.uuid = DCFUtility.uuidv4();

    // Store the button inputted (always will be an array )
    this.figcaptions = figcaptions;
    if (NodeList.prototype.isPrototypeOf(this.figcaptions)) {
      this.figcaptions = Array.from(this.figcaptions);
    } else if (!Array.isArray(this.figcaptions)) {
      this.figcaptions = [ this.figcaptions ];
    }
  }

  // The names of the events to be used easily
  static events(name) {
    // Define any new events
    const events = {
    };
    Object.freeze(events);

    // Forward the events from the DCFToggleButton
    if (DCFToggleButton.events(name) !== undefined) {
      return DCFToggleButton.events(name);
    }

    // Return the name of the event if it exists if not it will return undefined
    return name in events ? events[name] : undefined;
  }

  // Initialize the buttons that were inputted in the constructor
  initialize() {
    // Loops through each one
    this.figcaptions.forEach((figcaption, index) => {
      // Get figure and validate it
      const figure = figcaption.parentElement;
      if (figure !== null && figure.tagName !== 'FIGURE') {
        throw new Error('Figcaption-Toggle Missing Figure Tag Parent');
      }

      // Set figure classes/styles
      figure.classList.add('dcf-relative');

      if (figcaption.id === '') {
        figcaption.id = this.uuid.concat('-figcaption-toggle-', index);
      }
      if (this.theme.figcaptionClassList) {
        this.theme.figcaptionClassList.forEach((cssClass) => {
          figcaption.classList.add(cssClass);
        });
      }

      // Set up the caption button
      let toggleButton = document.createElement('button');
      toggleButton.dataset.controls = figcaption.id;
      toggleButton.dataset.labelOn = 'Show caption';
      toggleButton.dataset.labelOff = 'Hide caption';
      toggleButton.dataset.postfix = index;
      toggleButton.dataset.startExpanded = 'false';
      toggleButton.innerHTML = this.theme.toggleButtonInnerHTML;

      // Sets the toggleButton classes
      if (this.theme.toggleButtonClassList) {
        this.theme.toggleButtonClassList.forEach((cssClass) => {
          toggleButton.classList.add(cssClass);
        });
      }

      // Append the button and initialize it
      figure.appendChild(toggleButton);
      const toggleButtonObj = new DCFToggleButton(toggleButton, {
        toggleKeys: this.toggleKeys,
        onKeys:     this.onKeys,
        offKeys:    this.offKeys,
      });
      toggleButtonObj.initialize();
    });
  }
}
