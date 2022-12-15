import { DCFUtility } from './dcf-utility';

export class DCFToggleButtonTheme{
    constructor(){
        this.toggleButtonInnerHTML = `<svg class="dcf-h-4 dcf-w-4 dcf-fill-current"
            width="24" height="24" viewBox="0 0 24 24" focusable="false" aria-hidden="true">
            <path class="theme-icon-slide-caption-open"
            d="M1,3h19c0.6,0,1-0.4,1-1c0-0.6-0.4-1-1-1H1C0.4,1,0,1.4,0,2C0,2.6,0.4,3,1,3z"/>
            '<path class="theme-icon-slide-caption-open"
            d="M1,8h15c0.6,0,1-0.4,1-1c0-0.6-0.4-1-1-1H1C0.4,6,0,6.4,0,7C0,7.6,0.4,8,1,8z"/>
            <path class="theme-icon-slide-caption-close-1"
            d="M1,13h22c0.6,0,1-0.4,1-1c0-0.6-0.4-1-1-1H1c-0.6,0-1,0.4-1,1C0,12.6,0.4,13,1,13z"/>
            <path class="theme-icon-slide-caption-close-2"
            d="M1,13h22c0.6,0,1-0.4,1-1c0-0.6-0.4-1-1-1H1c-0.6,0-1,0.4-1,1C0,12.6,0.4,13,1,13z"/>
            <path class="theme-icon-slide-caption-open"
            d="M1,18h18c0.6,0,1-0.4,1-1c0-0.6-0.4-1-1-1H1c-0.6,0-1,0.4-1,1C0,17.6,0.4,18,1,18z"/>
            <path class="theme-icon-slide-caption-open"
            'd="M1,23h15c0.6,0,1-0.4,1-1c0-0.6-0.4-1-1-1H1c-0.6,0-1,0.4-1,1C0,22.6,0.4,23,1,23z"/>
        </svg>`;

        this.toggleButtonClasses = ['dcf-btn', 'dcf-inverse-tertiary', 'dcf-d-flex', 'dcf-ai-center', 'dcf-pt-4', 'dcf-pb-4', 'dcf-white' ];

        this.toggleButtonAnimationDuration = 250;
        this.toggleButtonAnimation = (toggleButton) => {
            const keyframesClose1 = [
                {
                    transform: 'rotate(45deg)',
                    transformOrigin: '50% 50%'
                },
                {
                    transform: 'rotate(0deg)',
                    transformOrigin: '50% 50%'
                }
            ];
        
            const keyframesClose2 = [
                {
                    transform: 'rotate(-45deg)',
                    transformOrigin: '50% 50%'
                },
                {
                    transform: 'rotate(0deg)',
                    transformOrigin: '50% 50%'
                }
            ];
        
            const keyframesOpen1 = [
                {
                    transform: 'rotate(0deg)',
                    transformOrigin: '50% 50%'
                },
                {
                    transform: 'rotate(45deg)',
                    transformOrigin: '50% 50%'
                }
            ];
        
            const keyframesOpen2 = [
                {
                    transform: 'rotate(0deg)',
                    transformOrigin: '50% 50%'
                },
                {
                    transform: 'rotate(-45deg)',
                    transformOrigin: '50% 50%'
                }
            ];
        
            const options = {
                duration: this.toggleButtonAnimationDuration,
                fill: 'forwards'
            };
        
            let close1 = toggleButton.querySelector('.theme-icon-slide-caption-close-1');
            let close2 = toggleButton.querySelector('.theme-icon-slide-caption-close-2');
            
            toggleButton.addEventListener(DCFToggleButton.events('toggleButtonOff'), () => {
                close1.animate(keyframesClose1, options);
                close2.animate(keyframesClose2, options);
            }, false);
        
            toggleButton.addEventListener(DCFToggleButton.events('toggleButtonOn'), () => {
                close1.animate(keyframesOpen1, options);
                close2.animate(keyframesOpen2, options);
            }, false);

        };

        this.toggleElementAnimationDuration = 1000;
        this.toggleElementAnimation = (toggleElement) => {
            const keyframesElementOn = [
                {
                    opacity: 0
                },
                {
                    opacity: 1
                }
            ];

            const keyframesElementOff = [
                {
                    opacity: 1
                },
                {
                    opacity: 0
                }
            ];

            const options = {
                duration: this.slideToggleTransitionDuration,
                fill: 'forwards'
            };

            toggleElement.addEventListener('toggleElementOn', () => {
                toggleElement.animate(keyframesElementOn, options);
            }, false);

            toggleElement.addEventListener('toggleElementOff', () => {
                toggleElement.animate(keyframesElementOff, options);
            }, false);
        };
    }

    setThemeVariable(themeVariableName, value) {
        if (themeVariableName in this && typeof value == typeof this[themeVariableName]) {
            this[themeVariableName] = value
        }
    }
}

export class DCFToggleButton{

    // Set up the button
    constructor(toggleButtons, theme, options) {
        
        // if a theme is provided use it otherwise make a new one
        if (theme instanceof DCFToggleButtonTheme) {
            this.theme = theme;
        } else {
            this.theme = new DCFToggleButtonTheme();
        }

        // Create the events for toggling the button and element
        this.toggleButtonOn = new Event(DCFToggleButton.events('toggleButtonOn'));
        this.toggleButtonOff = new Event(DCFToggleButton.events('toggleButtonOff'));
        this.toggleElementOn = new Event(DCFToggleButton.events('toggleElementOn'));
        this.toggleElementOff = new Event(DCFToggleButton.events('toggleElementOff'));

        this.toggleKeys = options.toggleKeys ?? [];
        this.onKeys = options.onKeys ?? [];
        this.offKeys = options.offKeys ?? [];

        this.toggleKeys.push("space");
        this.offKeys.push("escape");

        // Create a random ID for the button
        this.uuid = DCFUtility.uuidv4();

        // Store the button inputted (always will be an array)
        this.toggleButtons = toggleButtons;
        if (!Array.isArray(this.toggleButtons)) {
            this.toggleButtons = [this.toggleButtons];
        }
    }
    
    // The names of the events to be used easily
    static events(name) {
        const events = {
            toggleButtonOn: 'toggleButtonOn',
            toggleButtonOff: 'toggleButtonOff',
            toggleElementOn: 'toggleElementOn',
            toggleElementOff: 'toggleElementOff'
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

            // Gets the info for setting up the button
            const toggleButtonLabelOn = toggleButton.dataset.labelOn;
            const toggleButtonIdPostfix = toggleButton.dataset.postfix ?? "";

            // if it does not have an ID set it to a random one
            if (toggleButton.id == "") {
                toggleButton.id = this.uuid.concat('-button-', toggleButtonIdPostfix)
            }

            // set the html/classes for the button if we have anything in the theme
            if (this.theme.toggleButtonInnerHTML) {
                toggleButton.innerHTML = this.theme.toggleButtonInnerHTML;
            }
            if (this.theme.toggleButtonClasses) {
                toggleButton.classList.add(...this.theme.toggleButtonClasses);
            }

            // set the attributes for the button
            toggleButton.setAttribute('aria-controls', toggleElementId);
            toggleButton.setAttribute('aria-label', toggleButtonLabelOn);
            toggleButton.setAttribute('aria-expanded', 'false');

            // set the attributes for the thing being toggled
            toggleElement.setAttribute('aria-labelledby', toggleButton.id);

            // set up the animations from the theme with the corresponding elements
            if (this.theme.toggleButtonAnimation) {
                this.theme.toggleButtonAnimation(toggleButton);
            }
            if (this.theme.toggleElementAnimation) {
                this.theme.toggleElementAnimation(toggleElement);
            }

            // set up the event listeners for the button and element
            this.eventListeners(toggleButton, toggleElement)
        });
    }

    // sets up the event listeners for the button
    eventListeners(toggleButton, toggleElement){

        // Toggle the element when button is clicked
        toggleButton.addEventListener('click', (clickEvent) => {
            this.toggleSwitched(toggleButton, toggleElement);
            clickEvent.preventDefault();
        }, false);

        // Show/hide element when the 'space' key is pressed
        // Hide element when the `escape` is pressed
        toggleButton.addEventListener('keydown', (keydownEvent) => {

            this.toggleKeys.forEach((key) => {
                if (DCFUtility.isKeyEvent(keydownEvent, DCFUtility.keyEvents(key))) {
                    console.log("toggle", key)
                    keydownEvent.preventDefault();
                    this.toggleSwitched(toggleButton, toggleElement);
                }
            });
            this.onKeys.forEach((key) => {
                if (DCFUtility.isKeyEvent(keydownEvent, DCFUtility.keyEvents(key))) {
                    console.log("on", key)
                    keydownEvent.preventDefault();
                    this.toggleSwitched(toggleButton, toggleElement, "open");
                }
            });
            this.offKeys.forEach((key) => {
                if (DCFUtility.isKeyEvent(keydownEvent, DCFUtility.keyEvents(key))) {
                    console.log("off", key)
                    keydownEvent.preventDefault();
                    this.toggleSwitched(toggleButton, toggleElement, "close");
                }
            });
        }, false);
    }

    // Handles the logic for the button
    toggleSwitched(toggleButton, toggleElement, state=""){

        // Gets the labels for the button
        const toggleButtonLabelOn = toggleButton.dataset.labelOn;
        const toggleButtonLabelOff = toggleButton.dataset.labelOff;

        // Toggled On
        if (toggleButton.ariaExpanded === "false" && (state === "open" || state === "")) {

            toggleButton.setAttribute('aria-expanded', 'true');
            toggleButton.setAttribute('aria-label', toggleButtonLabelOff);
            toggleButton.dispatchEvent(this.toggleButtonOn);

            toggleElement.setAttribute('aria-hidden', 'false');
            toggleElement.classList.remove('dcf-invisible', 'dcf-opacity-0', 'dcf-pointer-events-none');
            toggleElement.classList.add('dcf-opacity-1', 'dcf-pointer-events-auto');
            toggleElement.dispatchEvent(this.toggleElementOn);

            toggleElement.focus();

        // Toggle Off
        } else if (toggleButton.ariaExpanded === "true" && (state === "close" || state === "")) {

            toggleButton.setAttribute('aria-expanded', 'false');
            toggleButton.setAttribute('aria-label', toggleButtonLabelOn);
            toggleButton.dispatchEvent(this.toggleButtonOff);

            toggleElement.setAttribute('aria-hidden', 'true');
            toggleElement.classList.remove('dcf-opacity-1', 'dcf-pointer-events-auto');
            toggleElement.classList.add('dcf-opacity-0', 'dcf-pointer-events-none', 'dcf-invisible');
            toggleElement.dispatchEvent(this.toggleElementOff);
        }
    }
}