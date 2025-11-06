import { uuidv4 } from '../dcf-utility.js';
import DCFButtonToggles from './dcf-button-toggle.js';

export default class DCFCollapsibleFieldsets {

    uuid = uuidv4();

    fieldsetElement = null;

    legendElement = null;

    legendButtonElement = null;

    innerDivElement = null;

    legendButtonClassList = [
        'dcf-btn',
        'dcf-btn-tertiary',
        'dcf-d-inline-block',
        'dcf-pt-0',
        'dcf-pb-0',
        'dcf-pl-1',
        'dcf-pr-1',
        'dcf-mr-2',
    ];

    legendButtonInnerHTMLOn = '-';

    legendButtonInnerHTMLOff = '+';

    fieldsetContentsClassList = [];

    fieldsetContentsClassListOn = [
        'dcf-h-auto',
    ];

    fieldsetContentsClassListOff = [
        'dcf-h-0',
        'dcf-overflow-y-hidden',
        'dcf-overflow-x-hidden',
    ];

    fieldsetClassList = [];

    fieldsetClassListOn = [];

    fieldsetClassListOff = [
        'dcf-pt-0',
        'dcf-pb-0',
    ];

    animationBlockClassList = [
        'dcf-motion-none',
    ];

    commandToggle = new Event(DCFButtonToggles.events('commandToggle'));

    toggleKeys = [];

    onKeys = [];

    offKeys = [];

    // Set up the button
    constructor(fieldset, options = {}) {
        // Copy the Keys without copying the references
        // Objects plus their properties and arrays are pass by reference
        if (Array.isArray(options.toggleKeys)) {
            this.toggleKeys = [...options.toggleKeys];
        } else if (options.toggleKeys !== null && options.toggleKeys !== undefined && options.toggleKeys !== '') {
            this.toggleKeys.push(options.toggleKeys);
        }
        if (Array.isArray(options.onKeys)) {
            this.onKeys = [...options.onKeys];
        } else if (options.onKeys !== null && options.onKeys !== undefined && options.onKeys !== '') {
            this.onKeys.push(options.onKeys);
        }
        if (Array.isArray(options.offKeys)) {
            this.offKeys = [...options.offKeys];
        } else if (options.offKeys !== null && options.offKeys !== undefined && options.offKeys !== '') {
            this.offKeys.push(options.offKeys);
        }


        if ('legendButtonClassList' in options && Array.isArray(options.legendButtonClassList)) {
            this.legendButtonClassList = options.legendButtonClassList;
        }
        if ('legendButtonInnerHTMLOn' in options && typeof options.legendButtonInnerHTMLOn === 'string') {
            this.legendButtonInnerHTMLOn = options.legendButtonInnerHTMLOn;
        }
        if ('legendButtonInnerHTMLOff' in options && typeof options.legendButtonInnerHTMLOff === 'string') {
            this.legendButtonInnerHTMLOff = options.legendButtonInnerHTMLOff;
        }
        if ('fieldsetContentsClassList' in options && Array.isArray(options.fieldsetContentsClassList)) {
            this.fieldsetContentsClassList = options.fieldsetContentsClassList;
        }
        if ('fieldsetContentsClassListOn' in options && Array.isArray(options.fieldsetContentsClassListOn)) {
            this.fieldsetContentsClassListOn = options.fieldsetContentsClassListOn;
        }
        if ('fieldsetContentsClassListOff' in options && Array.isArray(options.fieldsetContentsClassListOff)) {
            this.fieldsetContentsClassListOff = options.fieldsetContentsClassListOff;
        }
        if ('fieldsetClassList' in options &&  Array.isArray(options.fieldsetClassList)) {
            this.fieldsetClassList = options.fieldsetClassList;
        }
        if ('fieldsetClassListOn' in options && Array.isArray(options.fieldsetClassListOn)) {
            this.fieldsetClassListOn = options.fieldsetClassListOn;
        }
        if ('fieldsetClassListOff' in options && Array.isArray(options.fieldsetClassListOff)) {
            this.fieldsetClassListOff = options.fieldsetClassListOff;
        }
        if ('animationBlockClassList' in options && Array.isArray(options.animationBlockClassList)) {
            this.animationBlockClassList = options.animationBlockClassList;
        }

        this.fieldsetElement = fieldset;

        // We want to put everything inside the fieldset into a div
        // That div is what will toggle and not the fieldset
        // If we toggle the fieldset then we will also toggle the legend which holds the button

        // Gets value for if it starts expanded or not
        let fieldsetStartExpanded = this.fieldsetElement.dataset.startExpanded;
        if (fieldsetStartExpanded === undefined) {
            fieldsetStartExpanded = 'true';
        }

        // Checks for legend
        const legend = this.fieldsetElement.querySelector('legend');
        if (legend === null) {
            throw new Error('Missing Legend In Fieldset');
        }

        // Removed the legend and saves it
        this.legendElement = legend.cloneNode(true);
        legend.remove();
        this.legendElement.style.cursor = 'pointer';

        // Creates a new div and we copy everything left in the fieldset into it
        this.innerDivElement = document.createElement('div');
        this.innerDivElement.setAttribute('id', this.uuid.concat('-collapsible-fieldset-contents'));
        this.innerDivElement.innerHTML = fieldset.innerHTML;

        // We will also add any styles
        this.fieldsetContentsClassList.forEach((divClass) => {
            this.innerDivElement.classList.add(divClass);
        });
        if (fieldsetStartExpanded === 'true') {
            this.fieldsetContentsClassListOn.forEach((divClass) => {
                this.innerDivElement.classList.add(divClass);
            });
        } else {
            this.fieldsetContentsClassListOff.forEach((divClass) => {
                this.innerDivElement.classList.add(divClass);
            });
        }

        // We can then add the new div and legend back into the fieldset
        this.fieldsetElement.innerHTML = '';
        this.fieldsetElement.append(this.legendElement);
        this.fieldsetElement.append(this.innerDivElement);

        // Block any animations from running on load
        // These get removed during first event listener
        this.animationBlockClassList.forEach((fieldsetClass) => {
            this.fieldsetElement.classList.add(fieldsetClass);
        });

        // We can also add any styles
        this.fieldsetClassList.forEach((fieldsetClass) => {
            this.fieldsetElement.classList.add(fieldsetClass);
        });
        if (fieldsetStartExpanded === 'true') {
            this.fieldsetClassListOn.forEach((fieldsetClass) => {
                this.fieldsetElement.classList.add(fieldsetClass);
            });
        } else {
            this.fieldsetClassListOff.forEach((fieldsetClass) => {
                this.fieldsetElement.classList.add(fieldsetClass);
            });
        }

        // We then make the button to be put into the legend
        this.legendButtonElement = document.createElement('button');
        this.legendButtonClassList.forEach((btnClass) => {
            this.legendButtonElement.classList.add(btnClass);
        });
        this.legendButtonElement.innerHTML = this.legendButtonInnerHTMLOn;
        this.legendButtonElement.setAttribute('type', 'button');

        // We set up the toggle button values
        this.legendButtonElement.dataset.controls = this.innerDivElement.getAttribute('id');
        this.legendButtonElement.dataset.labelOn = 'Expand Fieldset';
        this.legendButtonElement.dataset.labelOff = 'Collapse Fieldset';
        this.legendButtonElement.dataset.startExpanded = fieldsetStartExpanded;

        // Append the button and initialize it
        this.legendElement.prepend(this.legendButtonElement);

        // We can then add the event listeners
        // We want to do this before the toggle button is initialized
        // Since we have to change the styles for if it starts expanded or not
        this.#setEventListeners();

        // Initialize the toggle button
        //TODO: Use class methods instead of command events
        new DCFButtonToggles(this.legendButtonElement, {
            toggleKeys: this.toggleKeys,
            onKeys:     this.onKeys,
            offKeys:    this.offKeys,
        });

        this.fieldsetElement.classList.add('dcf-collapsible-fieldset-initialized');

        // This lets any outside js that needs to interact with elements inside the fieldset
        // to know that its safe to create references to these elements
        this.fieldsetElement.dispatchEvent(new CustomEvent(DCFCollapsibleFieldsets.events('collapsibleFieldsetReady'), {
            detail: {
                classInstance: this,
            },
        }));

        if (this.fieldsetElement.getAttribute('hidden') !== null) {
            this.fieldsetElement.removeAttribute('hidden');
        }

        // Remove the classes related to block any animation
        const removeAnimationBlock = () => {
            this.animationBlockClassList.forEach((fieldsetClass) => {
                this.fieldsetElement.classList.remove(fieldsetClass);
            });
            this.fieldsetElement.removeEventListener('transitionend', removeAnimationBlock);
        };

        // We want to wait for the css classes to finish changing before removing the classes
        this.fieldsetElement.addEventListener('transitionend', removeAnimationBlock);
    }

    // The names of the events to be used easily
    static events(name) {
        // Define any new events
        const events = {
            collapsibleFieldsetReady: 'collapsibleFieldsetReady',
        };
        Object.freeze(events);

        // Forward the events from the DCFButtonToggles
        if (DCFButtonToggles.events(name) !== undefined) {
            return DCFButtonToggles.events(name);
        }

        // Return the name of the event if it exists if not it will return undefined
        return name in events ? events[name] : undefined;
    }

    // /**
    //  * This function will update the styles and HTML for the fieldset, fieldset contents, and the button
    //  * These events we are listening for come from the DCFButtonToggles
    //  */
    #setEventListeners() {
        // If we click the legend and not the button we want to toggle the fieldset
        this.legendElement.addEventListener('click', (event) => {
            // If the legend does not contain it then we clicked the SVG and the SVG has changed
            // If e.target is the button we do not want to toggle
            // If the button contains e.target then we do not want to toggle
            if (
                this.legendElement.contains(event.target) &&
                !this.legendButtonElement.isEqualNode(event.target) &&
                !this.legendButtonElement.contains(event.target)
            ) {
                this.legendButtonElement.dispatchEvent(this.commandToggle);
            }
        });

        // We listen for when the toggle element is turned on
        this.innerDivElement.addEventListener(DCFCollapsibleFieldsets.events('toggleElementOn'), () => {
            // When it is we will remove the off styles and add the on styles
            this.fieldsetContentsClassListOff.forEach((toggleElementClass) => {
                this.innerDivElement.classList.remove(toggleElementClass);
            });
            this.fieldsetContentsClassListOn.forEach((toggleElementClass) => {
                this.innerDivElement.classList.add(toggleElementClass);
            });

            // When it is we will remove the off styles and add the on styles
            this.fieldsetClassListOff.forEach((fieldsetClass) => {
                this.fieldsetElement.classList.remove(fieldsetClass);
            });
            this.fieldsetClassListOn.forEach((fieldsetClass) => {
                this.fieldsetElement.classList.add(fieldsetClass);
            });
        });

        // We listen for when the toggle element is turned off
        this.innerDivElement.addEventListener(DCFCollapsibleFieldsets.events('toggleElementOff'), () => {
            // When it is we will remove the on styles and add the off styles
            this.fieldsetContentsClassListOn.forEach((toggleElementClass) => {
                this.innerDivElement.classList.remove(toggleElementClass);
            });
            this.fieldsetContentsClassListOff.forEach((toggleElementClass) => {
                this.innerDivElement.classList.add(toggleElementClass);
            });

            // When it is we will remove the on styles and add the off styles
            this.fieldsetClassListOn.forEach((fieldsetClass) => {
                this.fieldsetElement.classList.remove(fieldsetClass);
            });
            this.fieldsetClassListOff.forEach((fieldsetClass) => {
                this.fieldsetElement.classList.add(fieldsetClass);
            });
        });

        // We listen for when the toggle button is turned on and update the HTML
        this.legendButtonElement.addEventListener(DCFCollapsibleFieldsets.events('toggleButtonOn'), () => {
            this.legendButtonElement.innerHTML = this.legendButtonInnerHTMLOn;
        });

        // We listen for when the toggle button is turned off and update the HTML
        this.legendButtonElement.addEventListener(DCFCollapsibleFieldsets.events('toggleButtonOff'), () => {
            this.legendButtonElement.innerHTML = this.legendButtonInnerHTMLOff;
        });
    }
}
