import { DCFUtility } from './dcf-utility';
import { DCFToggleButton } from './dcf-button-toggle';

export class DCFFieldsetCollapsibleTheme {
  // Sets up the theme
  constructor() {
    this.legendButtonClassList = [
      'dcf-btn',
      'dcf-btn-tertiary',
      'dcf-pt-0',
      'dcf-pb-0',
      'dcf-pl-1',
      'dcf-pr-1',
      'dcf-mr-4',
    ];

    this.legendButtonInnerHTMLOn = '-';
    this.legendButtonInnerHTMLOff = '+';

    this.fieldsetContentsClassList = [
      'dcf-overflow-y-hidden',
    ];

    this.fieldsetContentsClassListOn = [
      'dcf-h-auto',
    ];

    this.fieldsetContentsClassListOff = [
      'dcf-h-0',
    ];

    this.fieldsetClassList = [];

    this.fieldsetClassListOn = [];

    this.fieldsetClassListOff = [];
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

      const legend = fieldset.querySelector('legend');
      if (legend === null) {
        throw new Error('Missing Legend In Fieldset');
      }

      const legendCopy = legend.cloneNode(true);
      legend.remove();

      const newGuts = document.createElement('div');
      newGuts.id = this.uuid.concat('-collapsible-fieldset-contents-', index);
      newGuts.innerHTML = fieldset.innerHTML;
      this.theme.fieldsetContentsClassList.forEach((divClass) => {
        newGuts.classList.add(divClass);
      });
      this.theme.fieldsetContentsClassListOn.forEach((divClass) => {
        newGuts.classList.add(divClass);
      });

      fieldset.innerHTML = '';
      fieldset.append(legendCopy);
      fieldset.append(newGuts);
      this.theme.fieldsetClassList.forEach((fieldsetClass) => {
        fieldset.classList.add(fieldsetClass);
      });
      this.theme.fieldsetClassListOn.forEach((fieldsetClass) => {
        fieldset.classList.add(fieldsetClass);
      });

      const button = document.createElement('button');
      this.theme.legendButtonClassList.forEach((btnClass) => {
        button.classList.add(btnClass);
      });
      button.innerHTML = this.theme.legendButtonInnerHTMLOn;
      button.setAttribute('type', 'button');

      button.dataset.controls = newGuts.id;
      button.dataset.labelOn = 'Expand Fieldset';
      button.dataset.labelOff = 'Collapse Fieldset';
      button.dataset.postfix = index;
      button.dataset.startExpanded = 'true';

      // Append the button and initialize it
      legendCopy.prepend(button);
      const toggleButtonObj = new DCFToggleButton(button, {
        toggleKeys: this.toggleKeys,
        onKeys:     this.onKeys,
        offKeys:    this.offKeys,
      });
      toggleButtonObj.initialize();

      this.eventListeners(fieldset, newGuts, button);
    });
  }

  eventListeners(fieldset, toggleElement, button) {
    toggleElement.addEventListener(DCFFieldsetCollapsible.events('toggleElementOn'), () => {
      this.theme.fieldsetContentsClassListOff.forEach((toggleElementClass) => {
        toggleElement.classList.remove(toggleElementClass);
      });
      this.theme.fieldsetContentsClassListOn.forEach((toggleElementClass) => {
        toggleElement.classList.add(toggleElementClass);
      });

      this.theme.fieldsetClassListOff.forEach((fieldsetClass) => {
        fieldset.classList.remove(fieldsetClass);
      });
      this.theme.fieldsetClassListOn.forEach((fieldsetClass) => {
        fieldset.classList.add(fieldsetClass);
      });

      //   fieldset.classList.remove('dcf-opacity-100');
      //   fieldset.classList.remove('dcf-opacity-0');
      //   fieldset.classList.remove('dcf-pointer-events-none');
      //   fieldset.classList.add('dcf-pointer-events-auto');
      //   this.theme.fieldsetClassListOff.forEach((fieldsetClass) => {
      //     fieldset.classList.remove(fieldsetClass);
      //   });
      //   this.theme.fieldsetClassListOn.forEach((fieldsetClass) => {
      //     fieldset.classList.add(fieldsetClass);
      //   });
      //   fieldset.querySelectorAll(':not(legend)').forEach((elem) => {
      //     if (elem.dataset.tempCollField && elem.dataset.tempCollField !== 'false') {
      //       elem.setAttribute('tabindex', elem.dataset.tempCollField);
      //     } else {
      //       elem.removeAttribute('tabindex');
      //     }
      //     delete elem.dataset.tempCollField;
      //   });
    });
    toggleElement.addEventListener(DCFFieldsetCollapsible.events('toggleElementOff'), () => {
      this.theme.fieldsetContentsClassListOn.forEach((toggleElementClass) => {
        toggleElement.classList.remove(toggleElementClass);
      });
      this.theme.fieldsetContentsClassListOff.forEach((toggleElementClass) => {
        toggleElement.classList.add(toggleElementClass);
      });

      this.theme.fieldsetClassListOn.forEach((fieldsetClass) => {
        fieldset.classList.remove(fieldsetClass);
      });
      this.theme.fieldsetClassListOff.forEach((fieldsetClass) => {
        fieldset.classList.add(fieldsetClass);
      });
      //   fieldset.classList.remove('dcf-opacity-100');
      //   fieldset.classList.remove('dcf-opacity-0');
      //   fieldset.classList.remove('dcf-pointer-events-none');
      //   fieldset.classList.add('dcf-pointer-events-auto');
      //   this.theme.fieldsetClassListOn.forEach((fieldsetClass) => {
      //     fieldset.classList.remove(fieldsetClass);
      //   });
      //   this.theme.fieldsetClassListOff.forEach((fieldsetClass) => {
      //     fieldset.classList.add(fieldsetClass);
      //   });

      //   fieldset.querySelectorAll(':not(legend)').forEach((elem) => {
      //     elem.dataset.tempCollField = elem.getAttribute('tabIndex') || 'false';
      //     elem.setAttribute('tabindex', '-1');
      //   });
    });
  }
}
