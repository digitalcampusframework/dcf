import { uuidv4 } from '../dcf-utility.js';

export default class DCFDialog {

    uuid = uuidv4();

    dialogElement = null;

    toggleButtons = [];

    closeButton = null;

    dialogContentElement = null;

    dialogHeaderElement = null;

    headingElement = null;

    confirmClose = false;

    deliberateCloseOnly = false;

    preOpen = new Event(DCFDialog.events('dialogPreOpen'));

    postOpen = new Event(DCFDialog.events('dialogPostOpen'));

    preClose = new Event(DCFDialog.events('dialogPreClose'));

    postClose = new Event(DCFDialog.events('dialogPostClose'));

    dialogElementClassList = [
        'dcf-p-0',
        'dcf-b-0',
        'dcf-m-auto',
    ];

    dialogNonModalElementClassList = [
        'dcf-b-0',
    ];

    dialogHeaderElementClassList = [
        'dcf-wrapper',
        'dcf-pt-8',
        'dcf-sticky',
        'dcf-top-0',
    ];

    dialogContentElementClassList = [
        'dcf-wrapper',
        'dcf-pb-8',
    ];

    dialogCloseButtonClassList = [
        'dcf-btn',
        'dcf-btn-tertiary',
        'dcf-absolute',
        'dcf-top-0',
        'dcf-right-0',
        'dcf-z-1',
    ];

    constructor(dialog, options = {}) {
        if ('dialogElementClassList' in options && Array.isArray(options.dialogElementClassList)) {
            this.dialogElementClassList = options.dialogElementClassList;
        }
        if ('dialogNonModalElementClassList' in options && Array.isArray(options.dialogNonModalElementClassList)) {
            this.dialogNonModalElementClassList = options.dialogNonModalElementClassList;
        }
        if ('dialogHeaderElementClassList' in options && Array.isArray(options.dialogHeaderElementClassList)) {
            this.dialogHeaderElementClassList = options.dialogHeaderElementClassList;
        }
        if ('dialogContentElementClassList' in options && Array.isArray(options.dialogContentElementClassList)) {
            this.dialogContentElementClassList = options.dialogContentElementClassList;
        }
        if ('dialogCloseButtonClassList' in options && Array.isArray(options.dialogCloseButtonClassList)) {
            this.dialogCloseButtonClassList = options.dialogCloseButtonClassList;
        }

        this.dialogElement = dialog;
        if (this.dialogElement.tagName !== 'DIALOG') {
            throw new Error('dcf-dialog used on non-dialog element');
        }
        if (this.dialogElement.getAttribute('id') === null) {
            throw new Error('Dialog element is missing ID');
        }
        if (this.dialogElement.hasAttribute('data-confirmClose')) {
            this.confirmClose = true;
        }
        if (this.dialogElement.hasAttribute('data-deliberateCloseOnly')) {
            this.deliberateCloseOnly = true;
        }

        if (this.dialogElement.dataset.defaultClasses !== 'false') {
            if (this.dialogElement.classList.contains('dcf-dialog-non-modal')) {
                this.dialogElement.classList.add(...this.dialogNonModalElementClassList);
            } else {
                this.dialogElement.classList.add(...this.dialogElementClassList);
            }
        }

        this.dialogHeaderElement = this.dialogElement.querySelector('.dcf-dialog-header');
        if (this.dialogHeaderElement === null) {
            throw new Error('Dialog is missing header (.dcf-dialog-header)');
        }
        if (this.dialogElement.dataset.defaultClasses !== 'false') {
            this.dialogHeaderElement.classList.add(...this.dialogHeaderElementClassList);
        }

        this.heading = this.dialogHeaderElement.querySelector('h1, h2, h3, h4, h5, h6');
        if (this.heading.getAttribute('id') === '') {
            this.heading.setAttribute('id', this.uuid.concat('-heading'));
        }
        this.dialogElement.setAttribute('aria-labelledby', this.heading.getAttribute('id'));

        this.dialogContentElement = this.dialogElement.querySelector('.dcf-dialog-content');
        if (this.dialogContentElement === null) {
            throw new Error('Dialog is missing header (.dcf-dialog-content)');
        }
        if (this.dialogElement.dataset.defaultClasses !== 'false') {
            this.dialogContentElement.classList.add(...this.dialogContentElementClassList);
        }

        this.closeButton = this.dialogElement.querySelector('.dcf-btn-close-dialog');
        if (this.closeButton === null) {
            throw new Error('Dialog is missing close button (.dcf-btn-close-dialog)');
        }
        if (this.dialogElement.dataset.defaultClasses !== 'false') {
            this.closeButton.classList.add(...this.dialogCloseButtonClassList);
        }
        this.closeButton.setAttribute('type', 'button');

        this.toggleButtons = Array.from(document.querySelectorAll(`.dcf-btn-toggle-dialog[data-controls='${this.dialogElement.getAttribute('id')}']`));

        this.toggleButtons.forEach((singleToggleButton) => {
            if (this.dialogElement.classList.contains('dcf-dialog-non-modal')) {
                singleToggleButton.setAttribute('aria-expanded', false);
            } else {
                singleToggleButton.setAttribute('aria-haspopup', 'dialog');
            }
        });

        this.#addEventListeners();
        this.dialogElement.classList.add('dcf-dialog-initialized');
        this.dialogElement.removeAttribute('hidden');

        this.dialogElement.dispatchEvent(new CustomEvent(DCFDialog.events('dialogReady'), {
            detail: {
                classInstance: this,
            },
        }));
    }

    // The names of the events to be used easily
    static events(name) {
        const events = {
            dialogReady: 'dialogReady',
            dialogPreOpen: 'dialogPreOpen',
            dialogPostOpen: 'dialogPostOpen',
            dialogPreClose: 'dialogPreClose',
            dialogPostClose: 'dialogPostClose',
            commandClose: 'commandClose',
            commandOpen: 'commandOpen',
            commandToggle: 'commandToggle',
        };
        Object.freeze(events);

        return name in events ? events[name] : undefined;
    }

    #addEventListeners() {
        // Set up toggle buttons to open and close modal
        this.toggleButtons.forEach((singleToggleButton) => {
            singleToggleButton.removeAttribute('disabled');
            singleToggleButton.addEventListener('click', () => {
                this.toggle({
                    'type': 'toggleButton',
                    'button': singleToggleButton,
                });
            });
        });

        // If another modal is opened then close this one
        document.addEventListener('dialogPreOpen', (event) => {
            if (!event.target.isSameNode(this.dialogElement)) {
                this.close({
                    'type': 'otherDialogOpened',
                });
            }
        }, true);

        // Set up close button to close modal
        this.closeButton.addEventListener('click', () => {
            this.close({
                'type': 'closeButton',
                'button': this.closeButton,
            });
        });

        // Close dialog if we are no longer on it (this is important for the non-modal)
        this.dialogElement.addEventListener('focusout', (event) => {
            let isToggleButtonFocusout = false;
            for (const singleToggleButton of this.toggleButtons) {
                if (singleToggleButton.isSameNode(event.relatedTarget) || singleToggleButton.contains(event.relatedTarget)) {
                    isToggleButtonFocusout = true;
                }
            }

            if (this.dialogElement.open && !isToggleButtonFocusout) {
                requestAnimationFrame(() => {
                    const active = document.activeElement;
                    if (!this.dialogElement.contains(active)) {
                        this.close({
                            'type': 'focusout',
                        });
                    }
                });
            }
        });

        // Close the dialog if we hit escape (this is important for the non-modal)
        this.dialogElement.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                event.preventDefault();
                this.close({
                    'type': 'escapeKey',
                });
            }
        });

        this.dialogElement.addEventListener(DCFDialog.events('commandClose'), () => {
            this.close({
                'type': 'commandClose',
            });
        });
        this.dialogElement.addEventListener(DCFDialog.events('commandOpen'), () => {
            this.open({
                'type': 'commandOpen',
            });
        });
        this.dialogElement.addEventListener(DCFDialog.events('commandToggle'), () => {
            this.toggle({
                'type': 'commandToggle',
            });
        });

        if (!this.deliberateCloseOnly) {
            // If we click outside the modal then close it
            this.dialogElement.addEventListener('click', (event) => {
                if (event.target.tagName !== 'DIALOG') { return; }

                const rect = event.target.getBoundingClientRect();
                const clickedInDialog = (
                    rect.top <= event.clientY &&
                    event.clientY <= rect.top + rect.height &&
                    rect.left <= event.clientX &&
                    event.clientX <= rect.left + rect.width
                );

                if (clickedInDialog === false) {
                    this.close({
                        'type': 'clickedOutsideDialog',
                    });
                }
            });
        }
    }

    close(eventData = {}) {
        if (!this.dialogElement.open) { return; }
        if (this.confirmClose && !window.confirm(this.dialogElement.dataset.confirmclose)) {
            return;
        }
        const preCloseEvent = new CustomEvent(
            DCFDialog.events('dialogPreClose'), {
                detail: eventData,
            },
        );
        this.dialogElement.dispatchEvent(preCloseEvent);
        this.dialogElement.close();
        this.dialogElement.classList.remove('dcf-dialog-is-open');
        this.toggleButtons.forEach((singleToggleButton) => {
            singleToggleButton.classList.remove('dcf-dialog-open');
            if (this.dialogElement.classList.contains('dcf-dialog-non-modal')) {
                singleToggleButton.setAttribute('aria-expanded', false);
            }
        });

        const postCloseEvent = new CustomEvent(
            DCFDialog.events('dialogPostClose'), {
                detail: eventData,
            },
        );
        this.dialogElement.dispatchEvent(postCloseEvent);
    }

    open(eventData = {}) {
        if (this.dialogElement.open) { return; }
        const preOpenEvent = new CustomEvent(
            DCFDialog.events('dialogPreOpen'), {
                detail: eventData,
            },
        );

        this.dialogElement.dispatchEvent(preOpenEvent);
        if (this.dialogElement.classList.contains('dcf-dialog-non-modal')) {
            this.dialogElement.show();
        } else {
            this.dialogElement.showModal();
        }
        this.dialogElement.classList.add('dcf-dialog-is-open');
        this.toggleButtons.forEach((singleToggleButton) => {
            singleToggleButton.classList.add('dcf-dialog-open');
            if (this.dialogElement.classList.contains('dcf-dialog-non-modal')) {
                singleToggleButton.setAttribute('aria-expanded', true);
            }
        });

        const postOpenEvent = new CustomEvent(
            DCFDialog.events('dialogPostOpen'), {
                detail: eventData,
            },
        );
        this.dialogElement.dispatchEvent(postOpenEvent);
    }

    toggle(eventData = {}) {
        if (this.dialogElement.open) {
            this.close(eventData);
        } else {
            this.open(eventData);
        }
    }
}
