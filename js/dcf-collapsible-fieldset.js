import { DCFUtility } from './dcf-utility';
import { DCFToggleButton } from './dcf-button-toggle';

export class DCFFieldsetCollapsibleTheme {
  // Sets up the theme
  constructor() {
    this.legendButtonClassList = [
      'dcf-btn',
      'dcf-btn-tertiary',
      'dcf-d-inline-block',
      'dcf-pt-0',
      'dcf-pb-0',
      'dcf-pl-1',
      'dcf-pr-1',
      'dcf-mr-2',
    ];

    this.legendButtonInnerHTMLOn = '-';
    this.legendButtonInnerHTMLOff = '+';

    this.fieldsetContentsClassList = [];

    this.fieldsetContentsClassListOn = [
      'dcf-h-auto',
    ];

    this.fieldsetContentsClassListOff = [
      'dcf-h-0',
      'dcf-overflow-y-hidden',
      'dcf-overflow-x-hidden',
    ];

    this.fieldsetClassList = [];

    this.fieldsetClassListOn = [];

    this.fieldsetClassListOff = [];

    this.animationBlockClassList = [ 'dcf-motion-none' ];
  }

  // Allows us to set the theme variables if they are defined and we match the types
  setThemeVariable(themeVariableName, value) {
    if (themeVariableName in this && typeof value == typeof this[themeVariableName]) {
      this[themeVariableName] = value;
    }
  }
}

export class DCFFieldsetCollapsible {
  // Set up the button
  constructor(fieldsets, theme, options = {}) {
    if (theme instanceof DCFFieldsetCollapsibleTheme) {
      this.theme = theme;
    } else {
      this.theme = new DCFFieldsetCollapsibleTheme();
    }

    this.fieldsetReadyEvent = new Event(DCFFieldsetCollapsible.events('fieldsetReady'));
    this.commandToggle = new Event(DCFToggleButton.events('commandToggle'));

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

    // Create a random ID for the button
    this.uuid = DCFUtility.uuidv4();

    // Store the button inputted (always will be an array )
    this.fieldsets = fieldsets;
    if (NodeList.prototype.isPrototypeOf(this.fieldsets)) {
      this.fieldsets = Array.from(this.fieldsets);
    } else if (!Array.isArray(this.fieldsets)) {
      this.fieldsets = [ this.fieldsets ];
    }
  }

  // The names of the events to be used easily
  static events(name) {
    // Define any new events
    const events = {
      fieldsetReady: 'ready',
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
    this.fieldsets.forEach((fieldset, index) => {
      // We want to put everything inside the fieldset into a div
      // That div is what will toggle and not the fieldset
      // If we toggle the fieldset then we will also toggle the legend which holds the button

      // Gets value for if it starts expanded or not
      let fieldsetStartExpanded = fieldset.dataset.startExpanded;
      if (fieldsetStartExpanded === undefined) {
        fieldsetStartExpanded = 'true';
      }

      // Checks for legend
      const legend = fieldset.querySelector('legend');
      if (legend === null) {
        throw new Error('Missing Legend In Fieldset');
      }

      // Removed the legend and saves it
      const legendCopy = legend.cloneNode(true);
      legend.remove();
      legendCopy.style.cursor = 'pointer';

      // Creates a new div and we copy everything left in the fieldset into it
      const newGuts = document.createElement('div');
      newGuts.id = this.uuid.concat('-collapsible-fieldset-contents-', index);
      newGuts.innerHTML = fieldset.innerHTML;
      // We will also add any styles
      this.theme.fieldsetContentsClassList.forEach((divClass) => {
        newGuts.classList.add(divClass);
      });
      if (fieldsetStartExpanded === 'true') {
        this.theme.fieldsetContentsClassListOn.forEach((divClass) => {
          newGuts.classList.add(divClass);
        });
      } else {
        this.theme.fieldsetContentsClassListOff.forEach((divClass) => {
          newGuts.classList.add(divClass);
        });
      }

      // We can then add the new div and legend back into the fieldset
      fieldset.innerHTML = '';
      fieldset.append(legendCopy);
      fieldset.append(newGuts);

      // Block any animations from running on load
      // These get removed during first event listener
      this.theme.animationBlockClassList.forEach((fieldsetClass) => {
        fieldset.classList.add(fieldsetClass);
      });

      // We can also add any styles
      this.theme.fieldsetClassList.forEach((fieldsetClass) => {
        fieldset.classList.add(fieldsetClass);
      });
      if (fieldsetStartExpanded === 'true') {
        this.theme.fieldsetClassListOn.forEach((fieldsetClass) => {
          fieldset.classList.add(fieldsetClass);
        });
      } else {
        this.theme.fieldsetClassListOff.forEach((fieldsetClass) => {
          fieldset.classList.add(fieldsetClass);
        });
      }

      // We then make the button to be put into the legend
      const button = document.createElement('button');
      this.theme.legendButtonClassList.forEach((btnClass) => {
        button.classList.add(btnClass);
      });
      button.innerHTML = this.theme.legendButtonInnerHTMLOn;
      button.setAttribute('type', 'button');

      // We set up the toggle button values
      button.dataset.controls = newGuts.id;
      button.dataset.labelOn = 'Expand Fieldset';
      button.dataset.labelOff = 'Collapse Fieldset';
      button.dataset.postfix = index;
      button.dataset.startExpanded = fieldsetStartExpanded;

      // Append the button and initialize it
      legendCopy.prepend(button);

      // We can then add the event listeners
      // We want to do this before the toggle button is initialized
      // Since we have to change the styles for if it starts expanded or not
      this.eventListeners(fieldset, newGuts, button, legendCopy);

      // Initialize the toggle button
      const toggleButtonObj = new DCFToggleButton(button, {
        toggleKeys: this.toggleKeys,
        onKeys:     this.onKeys,
        offKeys:    this.offKeys,
      });
      toggleButtonObj.initialize();

      // This lets any outside js that needs to interact with elements inside the fieldset
      // to know that its safe to create references to these elements
      fieldset.dispatchEvent(this.fieldsetReadyEvent);

      if (fieldset.getAttribute('hidden') !== null) {
        fieldset.removeAttribute('hidden');
      }

      // Remove the classes related to block any animation
      let removeAnimationBlock = () => {
        this.theme.animationBlockClassList.forEach((fieldsetClass) => {
          fieldset.classList.remove(fieldsetClass);
        });
        fieldset.removeEventListener('transitionend', removeAnimationBlock);
      };

      // We want to wait for the css classes to finish changing before removing the classes
      fieldset.addEventListener('transitionend', removeAnimationBlock);
    });
  }

  /**
   * This function will update the styles and HTML for the fieldset, fieldset contents, and the button
   * These events we are listening for come from the DCFToggleButton
   * @param {HTMLElement} fieldset Fieldset that holds the button and toggle element
   * @param {HTMLElement} toggleElement The new div that was made inside the fieldset
   * @param {HTMLElement} button The button that was added to the legend
   * @param {HTMLElement} legend The legend that holds the button
   */
  eventListeners(fieldset, toggleElement, button, legend) {
    // If we click the legend and not the button we want to toggle the fieldset
    legend.addEventListener('click', (event) => {
      // If the legend does not contain it then we clicked the SVG and the SVG has changed
      // If e.target is the button we do not want to toggle
      // If the button contains e.target then we do not want to toggle
      if (legend.contains(event.target) && !button.isEqualNode(event.target) && !button.contains(event.target)) {
        button.dispatchEvent(this.commandToggle);
      }
    });

    // We listen for when the toggle element is turned on
    toggleElement.addEventListener(DCFFieldsetCollapsible.events('toggleElementOn'), () => {
      // When it is we will remove the off styles and add the on styles
      this.theme.fieldsetContentsClassListOff.forEach((toggleElementClass) => {
        toggleElement.classList.remove(toggleElementClass);
      });
      this.theme.fieldsetContentsClassListOn.forEach((toggleElementClass) => {
        toggleElement.classList.add(toggleElementClass);
      });

      // When it is we will remove the off styles and add the on styles
      this.theme.fieldsetClassListOff.forEach((fieldsetClass) => {
        fieldset.classList.remove(fieldsetClass);
      });
      this.theme.fieldsetClassListOn.forEach((fieldsetClass) => {
        fieldset.classList.add(fieldsetClass);
      });
    });

    // We listen for when the toggle element is turned off
    toggleElement.addEventListener(DCFFieldsetCollapsible.events('toggleElementOff'), () => {
      // When it is we will remove the on styles and add the off styles
      this.theme.fieldsetContentsClassListOn.forEach((toggleElementClass) => {
        toggleElement.classList.remove(toggleElementClass);
      });
      this.theme.fieldsetContentsClassListOff.forEach((toggleElementClass) => {
        toggleElement.classList.add(toggleElementClass);
      });

      // When it is we will remove the on styles and add the off styles
      this.theme.fieldsetClassListOn.forEach((fieldsetClass) => {
        fieldset.classList.remove(fieldsetClass);
      });
      this.theme.fieldsetClassListOff.forEach((fieldsetClass) => {
        fieldset.classList.add(fieldsetClass);
      });
    });

    // We listen for when the toggle button is turned on and update the HTML
    button.addEventListener(DCFFieldsetCollapsible.events('toggleButtonOn'), () => {
      button.innerHTML = this.theme.legendButtonInnerHTMLOn;
    });

    // We listen for when the toggle button is turned off and update the HTML
    button.addEventListener(DCFFieldsetCollapsible.events('toggleButtonOff'), () => {
      button.innerHTML = this.theme.legendButtonInnerHTMLOff;
    });
  }
}
