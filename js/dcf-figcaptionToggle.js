import { DCFUtility } from './dcf-utility';
import { DCFToggleButton } from './dcf-toggleButton';

export class DCFFigcaptionToggle {
  // Set up the button
  constructor(figures, options = {}) {
    // Create a random ID for the button
    this.uuid = DCFUtility.uuidv4();

    // Store the button inputted (always will be an array )
    this.figures = figures;
    if (NodeList.prototype.isPrototypeOf(this.figures)) {
      this.figures = Array.from(this.figures);
    } else if (!Array.isArray(this.figures)) {
      this.figures = [ this.figures ];
    }
  }

  // The names of the events to be used easily
  static events(name) {
    const events = {
    };
    Object.freeze(events);

    if (DCFToggleButton.events(name) !== undefined) {
      return DCFToggleButton.events(name);
    }

    return name in events ? events[name] : undefined;
  }

  // Initialize the buttons that were inputted in the constructor
  initialize() {
    // loops through each one
    this.figures.forEach((figure) => {

      figure.classlist.add('dcf-relative')

      // set up styles for the figure
      // set up styles for the figcaption

      // Create button on figure
        // make caption start hidden
      // Set up event listeners

    });
  }

  eventListeners(figcaption, toggleButton){
    // Get listeners for caption for animation
    // Get listeners for buttons for animation
  }
}
