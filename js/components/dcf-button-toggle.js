import { DCFUtility } from '../dcf-utility.js';

export default class DCFToggleButton extends HTMLElement {
  button_expand_event_name = 'toggle_button_expanded';
  button_collapsed_event_name = 'toggle_button_collapsed';
  target_expand_event_name = 'target_expanded';
  target_collapsed_event_name = 'target_collapsed';

  button_expanded_event = new Event(this.button_expand_event_name);
  button_collapsed_event = new Event(this.button_collapsed_event_name);
  target_expanded_event = new Event(this.target_expand_event_name);
  target_collapsed_event = new Event(this.button_collapsed_event_name);

  toggle_keys = ['space'];
  expand_keys = [];
  collapse_keys = ['escape'];

  constructor() {
    super();

    this.button = null;
  }

  connectedCallback() {
    const targetId = this.getAttribute('controls');
    this.target = document.getElementById(targetId);
    if (!this.target) {
      throw new Error(`No element found with id "${targetId}".`);
    }

    // Find the button inside the toggle-button element
    this.button = this.querySelector('button');
    if (!this.button) {
      throw new Error(`No element found with id "${targetId}".`);
    }

    let toggleButtonIdPostfix = this.dataset.postfix;
    if (toggleButtonIdPostfix === undefined) {
      toggleButtonIdPostfix = '';
    }
    this.uuid = DCFUtility.uuidv4();
    if (this.button.id === '') {
      this.button.id = this.uuid.concat('-button-', toggleButtonIdPostfix);
    }

    let toggleButtonStartExpanded = this.dataset.startExpanded;
    if (toggleButtonStartExpanded === undefined) {
      toggleButtonStartExpanded = 'false';
    }

    // set the attributes for the button
    this.button.setAttribute('aria-controls', targetId);

    // set the attributes for the thing being toggled
    if (this.target.getAttribute('aria-labelledby') !== null &&
    this.target.getAttribute('aria-labelledby') !== this.button.id) {
      throw new Error('Toggle Element Already Has Toggle Button');
    }
    this.target.setAttribute('aria-labelledby', this.button.id);

    // #toggleSwitched will set many of the other attributes and styles
    const expandedState = toggleButtonStartExpanded === 'true' ? 'expand' : 'collapse';
    this.#toggleSwitched(expandedState, true);

    if (this.target.getAttribute('hidden') !== null) {
      this.target.removeAttribute('hidden');
    }

    // Toggle the element when button is clicked
    this.button.addEventListener('click', (clickEvent) => {
      const switched = this.#toggleSwitched();
      if (switched) {
        clickEvent.preventDefault();
      }
    }, false);

    // Show/hide element when the 'space' key is pressed
    // Hide element when the `escape` is pressed
    this.button.addEventListener('keydown', (keydownEvent) => {
      this.toggleKeys.forEach((key) => {
        if (DCFUtility.isKeyEvent(keydownEvent, DCFUtility.keyEvents(key))) {
          const switched = this.#toggleSwitched();
          if (switched) {
            keydownEvent.preventDefault();
          }
        }
      });
      this.onKeys.forEach((key) => {
        if (DCFUtility.isKeyEvent(keydownEvent, DCFUtility.keyEvents(key))) {
          const switched = this.#toggleSwitched('expand');
          if (switched) {
            keydownEvent.preventDefault();
          }
        }
      });
      this.offKeys.forEach((key) => {
        if (DCFUtility.isKeyEvent(keydownEvent, DCFUtility.keyEvents(key))) {
          const switched = this.#toggleSwitched('collapse');
          if (switched) {
            keydownEvent.preventDefault();
          }
        }
      });
    }, false);
  }

  disconnectedCallback() {
    //TODO: remove all event listeners
  }

  // Handles the logic for the button
  // This will only call the animations
  #toggleSwitched(state = '', onload = false) {
    // Gets the labels for the button
    const toggleButtonLabelOn = this.button.dataset.labelOn;
    const toggleButtonLabelOff = this.button.dataset.labelOff;
    const timeoutTime = 10;

    // Toggled On
    if ((this.button.getAttribute('aria-expanded') === 'false' ||
    this.button.getAttribute('aria-expanded') === null ||
    this.button.getAttribute('aria-expanded') === '') &&
      (state === 'expand' || state === '')
    ) {
      this.button.setAttribute('aria-expanded', 'true');
      if ('labelOff' in this.button.dataset) {
        this.button.setAttribute('aria-label', toggleButtonLabelOff);
      }
      this.button.dispatchEvent(this.button_expanded_event);

      // Removed transitionend if it was there
      this.target.removeEventListener('transitionend', this.removeDisplayNone);

      // Unhide the stuff now so animations can run after
      this.target.setAttribute('aria-hidden', 'false');
      this.target.classList.remove('dcf-d-none');
      // If we do not have this the transition will not run on our toggled elements for some reason
      setTimeout(() => {
        this.target.classList.remove('dcf-opacity-0', 'dcf-pointer-events-none');
        this.target.classList.add('dcf-opacity-100', 'dcf-pointer-events-auto');
      }, timeoutTime);

      // Dispatch event incase something else is using it
      this.target.dispatchEvent(this.target_collapsed_event);

      // Focus on newly expanded thing
      this.target.focus();
      return true;

    // Toggle Off
    } else if ((this.button.getAttribute('aria-expanded') === 'true' ||
    this.button.getAttribute('aria-expanded') === null ||
    this.button.getAttribute('aria-expanded') === '') &&
      (state === 'collapse' || state === '')
    ) {
      this.button.setAttribute('aria-expanded', 'false');
      if ('labelOn' in this.button.dataset) {
        this.button.setAttribute('aria-label', toggleButtonLabelOn);
      }
      this.button.dispatchEvent(this.button_collapsed_event);

      // Set it to hidden
      this.target.setAttribute('aria-hidden', 'true');
      this.target.classList.remove('dcf-opacity-100', 'dcf-pointer-events-auto');
      this.target.classList.add('dcf-pointer-events-none', 'dcf-opacity-0');

      // If it has a transition wait for it to finish before removing display none
      // If not just remove the class
      if (onload || window.getComputedStyle(this.target, null).getPropertyValue('transition') === '') {
        this.target.classList.add('dcf-d-none');
      } else {
        this.target.addEventListener('transitionend', this.removeDisplayNone);
      }

      // Dispatch event incase something else is using it
      this.target.dispatchEvent(this.target_collapsed_event);
      return true;
    }

    return false;
  }

  toggle() {
    return this.#toggleSwitched();
  }

  toggleExpand() {
    return this.#toggleSwitched('expand');
  }

  toggleCollapse() {
    return this.#toggleSwitched('collapse');
  }
}