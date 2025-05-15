import { uuidv4 } from '../dcf-utility.js';
import DCFButtonToggles from './dcf-button-toggle.js';

export default class DCFFigcaptionToggles {
    uuid = uuidv4();

    figcaption = null;

    figure = null;

    toggleButton = null;

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

    toggleButtonClassList = [
        'dcf-btn',
        'dcf-btn-inverse-tertiary',
        'dcf-absolute',
        'dcf-z-1',
        'dcf-d-flex',
        'dcf-ai-center',
        'dcf-white',
        'dcf-btn-toggle-figcaption',
    ];

    figcaptionClassList = [
        'dcf-absolute',
        'dcf-left-0',
        'dcf-top-0',
        'dcf-h-100%',
        'dcf-w-100%',
        'dcf-z-1',
        'dcf-figcaption-toggle',
    ];

    toggleKeys = [];

    onKeys = [];

    offKeys = [];

    // Set up the button
    constructor(figcaption, options = {}) {
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

        if ('toggleButtonInnerHTML' in options && typeof options.toggleButtonInnerHTML === 'string') {
            this.toggleButtonInnerHTML = options.toggleButtonInnerHTML;
        }
        if ('toggleButtonClassList' in options && Array.isArray(options.toggleButtonClassList)) {
            this.toggleButtonClassList = options.toggleButtonClassList;
        }
        if ('figcaptionClassList' in options && Array.isArray(options.figcaptionClassList)) {
            this.figcaptionClassList = options.figcaptionClassList;
        }

        this.figcaption = figcaption;

        // Get figure and validate it
        this.figure = this.figcaption.parentElement;
        if (this.figure !== null && this.figure.tagName !== 'FIGURE') {
            throw new Error('Figcaption-Toggle Missing Figure Tag Parent');
        }

        // Set figure classes/styles
        this.figure.classList.add('dcf-relative');

        if (this.figcaption.id === '') {
            this.figcaption.setAttribute('id', this.uuid.concat('-figcaption-toggle'));
        }
        if (this.figcaptionClassList) {
            //TODO: Fix these to use spread operator
            this.figcaptionClassList.forEach((cssClass) => {
                this.figcaption.classList.add(cssClass);
            });
        }

        // Set up the caption button
        this.toggleButton = document.createElement('button');
        this.toggleButton.dataset.controls = this.figcaption.id;
        this.toggleButton.dataset.labelOn = 'Show caption';
        this.toggleButton.dataset.labelOff = 'Hide caption';
        this.toggleButton.dataset.startExpanded = 'false';
        this.toggleButton.innerHTML = this.toggleButtonInnerHTML;

        // Sets the toggleButton classes
        if (this.toggleButtonClassList) {
            this.toggleButtonClassList.forEach((cssClass) => {
                this.toggleButton.classList.add(cssClass);
            });
        }

        // Append the button and initialize it
        this.figure.appendChild(this.toggleButton);
        new DCFButtonToggles(this.toggleButton, {
            toggleKeys: this.toggleKeys,
            onKeys:         this.onKeys,
            offKeys:        this.offKeys,
        });
    }

    // The names of the events to be used easily
    static events(name) {
        // Define any new events
        const events = {
        };
        Object.freeze(events);

        // Forward the events from the DCFButtonToggles
        if (DCFButtonToggles.events(name) !== undefined) {
            return DCFButtonToggles.events(name);
        }

        // Return the name of the event if it exists if not it will return undefined
        return name in events ? events[name] : undefined;
    }
}
