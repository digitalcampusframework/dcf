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
        this.dialogElement.classList.add(...this.dialogElementClassList);

        this.dialogHeaderElement = this.dialogElement.querySelector('.dcf-dialog-header');
        if (this.dialogHeaderElement === null) {
            throw new Error('Dialog is missing header (.dcf-dialog-header)');
        }
        this.dialogHeaderElement.classList.add(...this.dialogHeaderElementClassList);

        this.heading = this.dialogHeaderElement.querySelector('h1, h2, h3, h4, h5, h6');
        if (this.heading.getAttribute('id') === '') {
            this.heading.setAttribute('id', this.uuid.concat('-heading'));
        }
        this.dialogElement.setAttribute('aria-labelledby', this.heading.getAttribute('id'));

        this.dialogContentElement = this.dialogElement.querySelector('.dcf-dialog-content');
        if (this.dialogContentElement === null) {
            throw new Error('Dialog is missing header (.dcf-dialog-content)');
        }
        this.dialogContentElement.classList.add(...this.dialogContentElementClassList);

        this.closeButton = this.dialogElement.querySelector('.dcf-btn-close-dialog');
        if (this.closeButton === null) {
            throw new Error('Dialog is missing close button (.dcf-btn-close-dialog)');
        }
        this.closeButton.classList.add(...this.dialogCloseButtonClassList);
        this.closeButton.setAttribute('type', 'button');

        this.toggleButtons = Array.from(document.querySelectorAll(`.dcf-btn-toggle-dialog[data-controls='${this.dialogElement.getAttribute('id')}']`));

        this.#addEventListeners();
        this.dialogElement.classList.add('dcf-dialog-initialized');

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
            if (singleToggleButton.getAttribute('data-with-nav-toggle-group') === 'true') {
                this.setNavToggleBtnState(singleToggleButton, 'open');
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
        this.dialogElement.showModal();
        this.dialogElement.classList.add('dcf-dialog-is-open');
        this.toggleButtons.forEach((singleToggleButton) => {
            if (singleToggleButton.getAttribute('data-with-nav-toggle-group') === 'true') {
                this.setNavToggleBtnState(singleToggleButton, 'closed');
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

    // Set nav toggle button state as open or closed
    // Note: Assumes nav toggle buttons are svgs with expected markup
    setNavToggleBtnState(btn, btnState = 'open') {
        const btnSVGs = btn.getElementsByTagName('svg');
        const btnLabels = btn.getElementsByClassName('dcf-nav-toggle-label');

        // Set SVG state
        if (btnSVGs.length) {
            const gTags = btnSVGs[0].getElementsByTagName('g');
            Array.from(gTags).forEach((tag) => {
                if (tag.classList.contains('dcf-nav-toggle-icon-open')) {
                    if (btnState.toLowerCase() === 'open') {
                        tag.classList.remove('dcf-d-none');
                    } else {
                        tag.classList.add('dcf-d-none');
                    }
                } else if (tag.classList.contains('dcf-nav-toggle-icon-close')) {
                    if (btnState.toLowerCase() === 'open') {
                        tag.classList.add('dcf-d-none');
                    } else {
                        tag.classList.remove('dcf-d-none');
                    }
                }
            });
        }

        // Set Button Label
        if (btnLabels.length) {
            if (btnState.toLowerCase() === 'open') {
                btnLabels[0].textContent =
                btn.getAttribute('data-nav-toggle-label-open') ? btn.getAttribute('data-nav-toggle-label-open') : 'Open';
            } else {
                btnLabels[0].textContent =
                btn.getAttribute('data-nav-toggle-label-closed') ? btn.getAttribute('data-nav-toggle-label-closed') : 'Close';
            }
        }
    }
}
