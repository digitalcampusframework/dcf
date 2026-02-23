import { uuidv4, isKeyEvent, keyEvents} from '../dcf-utility.js';

export default class DCFButtonToggles {

    uuid = uuidv4();

    toggleButtonElement = null;

    toggleTargetElement = null;

    toggleButtonOn = new Event(DCFButtonToggles.events('toggleButtonOn'));

    toggleButtonOff = new Event(DCFButtonToggles.events('toggleButtonOff'));

    toggleElementOn = new Event(DCFButtonToggles.events('toggleElementOn'));

    toggleElementOff = new Event(DCFButtonToggles.events('toggleElementOff'));

    toggleKeys = [];

    onKeys = [];

    offKeys = [];

    constructor(toggleButtonElement, options={}) {
        this.toggleButtonElement = toggleButtonElement;

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

        // These keys will always work
        // Do not care about case due to the implementation of keyEvents
        if (!this.toggleKeys.includes('space')) {
            this.toggleKeys.push('space');
        }
        if (!this.offKeys.includes('escape')) {
            this.offKeys.push('escape');
        }

        // Gets the info for the thing the button is toggling
        const toggleElementId = this.toggleButtonElement.dataset.controls;
        this.toggleTargetElement = document.getElementById(toggleElementId);
        if (this.toggleTargetElement === null) {
            throw new Error('Missing Toggle Element');
        }

        // Gets the info for setting up the button
        let toggleButtonIdPostfix = this.toggleButtonElement.dataset.postfix;
        if (toggleButtonIdPostfix === undefined) {
            toggleButtonIdPostfix = '';
        }
        let toggleButtonStartExpanded = this.toggleButtonElement.dataset.startExpanded;
        if (toggleButtonStartExpanded === undefined) {
            toggleButtonStartExpanded = 'false';
        }

        // if it does not have an ID set it to a random one
        if (
            this.toggleButtonElement.getAttribute('id') === '' ||
            this.toggleButtonElement.getAttribute('id') === null
        ) {
            this.toggleButtonElement.setAttribute('id', this.uuid.concat('-button-', toggleButtonIdPostfix));
        }

        // set the attributes for the button
        this.toggleButtonElement.setAttribute('aria-controls', toggleElementId);

        // set the attributes for the thing being toggled
        if (
            this.toggleTargetElement.getAttribute('aria-labelledby') !== null &&
            this.toggleTargetElement.getAttribute('aria-labelledby') !== this.toggleButtonElement.getAttribute('id')
        ) {
            throw new Error('Toggle Element Already Has Toggle Button');
        }
        this.toggleTargetElement.setAttribute('aria-labelledby', this.toggleButtonElement.getAttribute('id'));

        // ToggleSwitched will set many of the other attributes and styles
        const expandedState = toggleButtonStartExpanded === 'true' ? 'open' : 'close';
        this.toggleSwitched(expandedState, true);

        // set up the event listeners for the button and element
        this.#eventListeners();

        if (this.toggleTargetElement.getAttribute('hidden') !== null) {
            this.toggleTargetElement.removeAttribute('hidden');
        }

        this.toggleButtonElement.classList.add('dcf-btn-toggle-initialized');
        this.toggleButtonElement.removeAttribute('hidden');

        this.toggleButtonElement.dispatchEvent(new CustomEvent(DCFButtonToggles.events('toggleButtonReady'), {
            detail: {
                classInstance: this,
            },
        }));

        this.toggleTargetElement.dispatchEvent(new CustomEvent(DCFButtonToggles.events('toggleButtonReady'), {
            detail: {
                classInstance: this,
            },
        }));
    }

    // The names of the events to be used easily
    static events(name) {
        const events = {
            toggleButtonReady: 'toggleButtonReady',
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

    // sets up the event listeners for the button
    #eventListeners() {
        // Toggle the element when button is clicked
        this.toggleButtonElement.addEventListener('click', (clickEvent) => {
            const switched = this.toggleSwitched();
            if (switched) {
                clickEvent.preventDefault();
            }
        }, false);

        // Show/hide element when the 'space' key is pressed
        // Hide element when the `escape` is pressed
        this.toggleButtonElement.addEventListener('keydown', (keydownEvent) => {
            this.toggleKeys.forEach((key) => {
                if (isKeyEvent(keydownEvent, keyEvents(key))) {
                    const switched = this.toggleSwitched();
                    if (switched) {
                        keydownEvent.preventDefault();
                    }
                }
            });
            this.onKeys.forEach((key) => {
                if (isKeyEvent(keydownEvent, keyEvents(key))) {
                    const switched = this.toggleSwitched('open');
                    if (switched) {
                        keydownEvent.preventDefault();
                    }
                }
            });
            this.offKeys.forEach((key) => {
                if (isKeyEvent(keydownEvent, keyEvents(key))) {
                    const switched = this.toggleSwitched('close');
                    if (switched) {
                        keydownEvent.preventDefault();
                    }
                }
            });
        }, false);

        this.toggleButtonElement.addEventListener(DCFButtonToggles.events('commandOpen'), () => {
            this.toggleSwitched('open');
        });
        this.toggleButtonElement.addEventListener(DCFButtonToggles.events('commandClose'), () => {
            this.toggleSwitched('close');
        });
        this.toggleButtonElement.addEventListener(DCFButtonToggles.events('commandToggle'), () => {
            this.toggleSwitched();
        });

        this.toggleTargetElement.addEventListener(DCFButtonToggles.events('commandOpen'), () => {
            this.toggleSwitched('open');
        });
        this.toggleTargetElement.addEventListener(DCFButtonToggles.events('commandClose'), () => {
            this.toggleSwitched('close');
        });
        this.toggleTargetElement.addEventListener(DCFButtonToggles.events('commandToggle'), () => {
            this.toggleSwitched();
        });
    }

    // Handles the logic for the button
    // This will only call the animations
    toggleSwitched(state = '', onload = false) {
        // Gets the labels for the button
        const toggleButtonLabelOn = this.toggleButtonElement.dataset.labelOn;
        const toggleButtonLabelOff = this.toggleButtonElement.dataset.labelOff;
        const timeoutTime = 10;

        // Toggled On
        if (
            (
                this.toggleButtonElement.getAttribute('aria-expanded') === 'false' ||
                this.toggleButtonElement.getAttribute('aria-expanded') === null ||
                this.toggleButtonElement.getAttribute('aria-expanded') === ''
            ) && (
                state === 'open' || state === ''
            )
        ) {
            this.toggleButtonElement.setAttribute('aria-expanded', 'true');
            if ('labelOff' in this.toggleButtonElement.dataset) {
                this.toggleButtonElement.setAttribute('aria-label', toggleButtonLabelOff);
            }
            this.toggleButtonElement.dispatchEvent(this.toggleButtonOn);

            // Unhide the stuff now so animations can run after
            this.toggleTargetElement.setAttribute('aria-hidden', 'false');
            this.toggleTargetElement.classList.remove('dcf-d-none');

            // If we do not have this the transition will not run on our toggled elements for some reason
            setTimeout(() => {
                this.toggleTargetElement.classList.remove('dcf-opacity-0', 'dcf-pointer-events-none');
                this.toggleTargetElement.classList.add('dcf-opacity-100', 'dcf-pointer-events-auto');
            }, timeoutTime);

            // Dispatch event in case something else is using it
            this.toggleTargetElement.dispatchEvent(this.toggleElementOn);

            // Focus on newly opened thing
            this.toggleTargetElement.focus();
            return true;

        // Toggle Off
        } else if (
            (
                this.toggleButtonElement.getAttribute('aria-expanded') === 'true' ||
                this.toggleButtonElement.getAttribute('aria-expanded') === null ||
                this.toggleButtonElement.getAttribute('aria-expanded') === ''
            ) && (
                state === 'close' || state === ''
            )
        ) {
            this.toggleButtonElement.setAttribute('aria-expanded', 'false');
            if ('labelOn' in this.toggleButtonElement.dataset) {
                this.toggleButtonElement.setAttribute('aria-label', toggleButtonLabelOn);
            }
            this.toggleButtonElement.dispatchEvent(this.toggleButtonOff);

            // Set it to hidden
            this.toggleTargetElement.setAttribute('aria-hidden', 'true');
            this.toggleTargetElement.classList.remove('dcf-opacity-100', 'dcf-pointer-events-auto');
            this.toggleTargetElement.classList.add('dcf-pointer-events-none', 'dcf-opacity-0');

            this.#hideElement(this.toggleTargetElement, onload);

            // Dispatch event in case something else is using it
            this.toggleTargetElement.dispatchEvent(this.toggleElementOff);
            return true;
        }

        return false;
    }

    /**
     * Hides element with dcf-d-none but if it has a transition or animation it will wait for that to finish
     * @param {HTMLElement} element The element we want to hide
     * @param {Boolean} onload If we are initializing the element or not
     * @returns { Void }
     */
    #hideElement(element, onload) {
        const hasAnimation =
            getComputedStyle(element).animationName !== 'none' ||
            getComputedStyle(element).transitionDuration !== '0s';


        if (onload || !hasAnimation) {
            element.classList.add('dcf-d-none');
            return;
        }

        const onEnd = () => {
            element.classList.add('dcf-d-none');
        };

        element.addEventListener('transitionend', onEnd, {once: true});
        element.addEventListener('animationend', onEnd, {once: true});
    }
}
