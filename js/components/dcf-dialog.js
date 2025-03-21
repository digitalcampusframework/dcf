import { uuidv4 } from '../dcf-utility.js';

export default class DCFDialog {

    uuid = uuidv4();

    dialog_element = null;
    toggle_buttons = [];
    close_button = null;
    dialog_content_element = null;
    dialog_header_element = null;
    heading_element = null;

    confirm_close = false;
    deliberate_close_only = false;

    pre_open = new Event(DCFDialog.events('dialog_pre_open'));
    post_open = new Event(DCFDialog.events('dialog_post_open'));
    pre_close = new Event(DCFDialog.events('dialog_pre_close'));
    post_close = new Event(DCFDialog.events('dialog_post_close'));

    dialog_element_classList = [
        'dcf-relative',
        'dcf-p-0',
        'dcf-b-0',
    ];
    dialog_header_element_classList = [
        'dcf-wrapper',
        'dcf-pt-8',
        'dcf-sticky',
        'dcf-top-0',
    ];
    dialog_content_element_classList = [
        'dcf-wrapper',
        'dcf-pb-8',
    ];
    dialog_close_button_classList = [
        'dcf-btn',
        'dcf-btn-tertiary',
        'dcf-absolute',
        'dcf-top-0',
        'dcf-right-0',
        'dcf-z-1',
    ];


    constructor(dialog, options = {}) {
        if ('dialog_element_classList' in options && Array.isArray(options.dialog_element_classList)) {
            this.dialog_element_classList = options.dialog_element_classList;
        }
        if ('dialog_header_element_classList' in options && Array.isArray(options.dialog_header_element_classList)) {
            this.dialog_header_element_classList = options.dialog_header_element_classList;
        }
        if ('dialog_content_element_classList' in options && Array.isArray(options.dialog_content_element_classList)) {
            this.dialog_content_element_classList = options.dialog_content_element_classList;
        }
        if ('dialog_close_button_classList' in options && Array.isArray(options.dialog_close_button_classList)) {
            this.dialog_close_button_classList = options.dialog_close_button_classList;
        }

        this.dialog_element = dialog;
        if (this.dialog_element.tagName !== 'DIALOG') {
            throw new Error('dcf-dialog used on non-dialog element');
        }
        if (this.dialog_element.getAttribute('id') === null) {
            throw new Error('Dialog element is missing ID');
        }
        if (this.dialog_element.hasAttribute('data-confirmClose')) {
            this.confirm_close = true;
        }
        if (this.dialog_element.hasAttribute('data-deliberateCloseOnly')) {
            this.deliberate_close_only = true;
        }
        this.dialog_element.classList.add(...this.dialog_element_classList);

        this.dialog_header_element = this.dialog_element.querySelector('.dcf-dialog-header');
        if (this.dialog_header_element === null) {
            throw new Error('Dialog is missing header (.dcf-dialog-header)');
        }
        this.dialog_header_element.classList.add(...this.dialog_header_element_classList);

        this.heading = this.dialog_header_element.querySelector('h1, h2, h3, h4, h5, h6');
        if (this.heading.getAttribute('id') === '') {
            this.heading.setAttribute('id', this.uuid.concat('-heading'));
        }
        this.dialog_element.setAttribute('aria-labelledby', this.heading.getAttribute('id'));

        this.dialog_content_element = this.dialog_element.querySelector('.dcf-dialog-content');
        if (this.dialog_content_element === null) {
            throw new Error('Dialog is missing header (.dcf-dialog-content)');
        }
        this.dialog_content_element.classList.add(...this.dialog_content_element_classList);

        this.close_button = this.dialog_element.querySelector('.dcf-btn-close-dialog');
        if (this.close_button === null) {
            throw new Error('Dialog is missing close button (.dcf-btn-close-dialog)');
        }
        this.close_button.classList.add(...this.dialog_close_button_classList);
        this.close_button.setAttribute('type', 'button');

        this.toggle_buttons = Array.from(document.querySelectorAll(`.dcf-btn-toggle-dialog[data-controls='${this.dialog_element.getAttribute('id')}']`));
        if (this.toggle_buttons.length === 0) {
            throw new Error('Dialog is missing toggle button (.dcf-btn-toggle-dialog)');
        }

        this.#addEventListeners();
    }

    // The names of the events to be used easily
    static events(name) {
        const events = {
            dialog_pre_open: 'dialog_pre_open',
            dialog_post_open: 'dialog_post_open',
            dialog_pre_close: 'dialog_pre_close',
            dialog_post_close: 'dialog_post_close',
            commandClose: 'commandClose',
            commandOpen: 'commandOpen',
            commandToggle: 'commandToggle',
        };
        Object.freeze(events);

        return name in events ? events[name] : undefined;
    }

    #addEventListeners() {
        // Set up toggle buttons to open and close modal
        this.toggle_buttons.forEach((single_toggle_button) => {
            single_toggle_button.removeAttribute('disabled');
            single_toggle_button.addEventListener('click', () => {
                this.toggle({
                    'type': 'toggle_button',
                    'button': single_toggle_button
                });
            });
        });

        // If another modal is opened then close this one
        document.addEventListener('dialog_pre_open', (e) => {
            if (!e.target.isSameNode(this.dialog_element)) {
                this.close({
                    'type': 'other_dialog_opened'
                });
            }
        }, true);

        // Set up close button to close modal
        this.close_button.addEventListener('click', (e) => {
            this.close({
                'type': 'close_button',
                'button': this.close_button
            });
        });

        this.dialog_element.addEventListener(DCFDialog.events('commandClose'), () => {
            this.close({
                'type': 'command_close',
            });
        });
        this.dialog_element.addEventListener(DCFDialog.events('commandOpen'), () => {
            this.open({
                'type': 'command_open',
            });
        });
        this.dialog_element.addEventListener(DCFDialog.events('commandToggle'), () => {
            this.toggle({
                'type': 'command_toggle',
            });
        });

        if (!this.deliberate_close_only) {
            // If we click outside the modal then close it
            this.dialog_element.addEventListener('click', (e) => {
                if (e.target.tagName !== 'DIALOG') { return; }
    
                const rect = e.target.getBoundingClientRect();
                const clickedInDialog = (
                    rect.top <= e.clientY &&
                    e.clientY <= rect.top + rect.height &&
                    rect.left <= e.clientX &&
                    e.clientX <= rect.left + rect.width
                );
    
                if (clickedInDialog === false) {
                    this.close({
                        'type': 'clicked_outside_dialog'
                    });
                }
            });
        }
    }

    close(event_data = {}) {
        if (!this.dialog_element.open) { return; }
        if (this.confirm_close && !window.confirm(this.dialog_element.dataset.confirmclose)) {
            return;
        }
        const pre_close_event = new CustomEvent(
            DCFDialog.events('dialog_pre_close'), {
                detail: event_data,
            }
        );
        this.dialog_element.dispatchEvent(pre_close_event);
        this.dialog_element.close();
        const post_close_event = new CustomEvent(
            DCFDialog.events('dialog_close_open'), {
                detail: event_data,
            }
        );
        this.dialog_element.dispatchEvent(post_close_event);
    }

    open(event_data = {}) {
        if (this.dialog_element.open) { return; }
        const pre_open_event = new CustomEvent(
            DCFDialog.events('dialog_pre_open'), {
                detail: event_data,
            }
        );
        this.dialog_element.dispatchEvent(pre_open_event);
        this.dialog_element.showModal();
        const post_open_event = new CustomEvent(
            DCFDialog.events('dialog_post_open'), {
                detail: event_data,
            }
        );
        this.dialog_element.dispatchEvent(post_open_event);
    }

    toggle(event_data = {}) {
        if (this.dialog_element.open) {
            this.close(event_data);
        } else {
            this.open(event_data);
        }
    }
}