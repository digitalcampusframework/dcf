import { uuidv4 } from '../dcf-utility.js';

// These are used to parse the select into a know structure
/**
 * @typedef {Object} ParsedOption
 * @property {'option'} tag - The option's tag
 * @property {string} label - The option's label
 * @property {string} value - The option's value
 * @property {bool} disabled - If option is disabled
 * @property {bool} selected - If option is selected
 * @property {string} elemId - The option's unique ID
 * @property {HTMLOptionElement} element - The options's original element
 */

/**
 * @typedef {Object} ParsedOptgroup
 * @property {'optgroup'} tag - The optgroup tag
 * @property {string} label - The optgroup's label
 * @property {HTMLOptGroupElement|HTMLSelectElement} element - The optgroup's original element
 * @property {Array<ParsedOption>} items - The optgroup's children
 */

/**
 * @typedef {Object} #parseSelectInner
 * @property {Array<ParsedOptgroup>} optgroups - A list of optgroups found
 * @property {Array<ParsedOption>} options - A list of options found
 */

/** This is the class for a single instance of a single-select combobox */
export default class DCFSearchSelect {

    uuid = uuidv4();

    multiple = false;

    selectID = null;

    selectElement = null;

    parsedSelect = [];

    searchAndSelectID = null;

    searchAndSelectElement = null;

    inputID = null;

    inputElement = null;

    openButtonElement = null;

    searchAreaElement = null;

    availableItemsListID = null;

    availableItemsListElement = null;

    listOfAvailableItems = [];

    selectedItemsListID = null;

    selectedItemsListElement = null;

    selectedItemsHelpID = null;

    currentFocus = null;

    searchAndSelectClassList = [
        'dcf-relative',
    ];

    searchAreaClassList = [
        'dcf-relative',
        'dcf-d-grid',
        'dcf-overflow-x-hidden',
        'dcf-overflow-y-auto',
    ];

    selectedItemsListClassList = [
        'dcf-d-flex',
        'dcf-flex-wrap',
        'dcf-m-0',
    ];

    selectedItemClassList = [
        'dcf-d-flex',
        'dcf-flex-nowrap',
        'dcf-ai-center',
        'dcf-jc-center',
        'dcf-mb-0',
        'dcf-relative',
    ];

    selectedItemButtonClassList = [
        'dcf-btn',
        'dcf-btn-secondary',
        'dcf-h-100%',
        'dcf-z-1',
    ];

    selectedItemButtonSVG = `<svg
    xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26 26" class="dcf-fill-current dcf-w-4 dcf-h-4 dcf-d-block">
    <path d="M25.4,22.6L15.8,13l9.6-9.6C25.8,3,26,2.5,26,2s-0.2-1-0.6-1.4c-0.8-0.8-2.1-0.8-2.8,0L13,10.2L3.4,0.6
        c-0.8-0.8-2-0.8-2.8,0c-0.8,0.8-0.8,2,0,2.8l9.6,9.6l-9.6,9.6C0.2,23,0,23.5,0,24c0,0.5,0.2,1,0.6,1.4C1,25.8,1.5,26,2,26
        c0.5,0,1-0.2,1.4-0.6l9.6-9.6l9.6,9.6C23,25.8,23.5,26,24,26c0,0,0,0,0,0c0.5,0,1-0.2,1.4-0.6C25.8,25,26,24.5,26,24
        C26,23.5,25.8,23,25.4,22.6z"/>
</svg>`;

    selectedItemLabelClassList = [
        'dcf-h-100%',
    ];

    toggleButtonContainerClassList = [
        'dcf-sticky',
        'dcf-top-50%',
        'dcf-h-0',
        'dcf-pl-1',
        'dcf-pr-1',
    ];

    toggleButtonClassList = [
        'dcf-btn',
        'dcf-btn-tertiary',
        'dcf-p-3',
    ];

    toggleButtonSVG = `<svg
xmlns="http://www.w3.org/2000/svg"
viewBox="0 0 24 24"
class="dcf-fill-current dcf-w-3 dcf-h-3 dcf-d-block"
aria-hidden="true"
>
<path d="M23.936,2.255C23.848,2.098,23.681,2,23.5,2h-23
    C0.32,2,0.153,2.098,0.065,2.255c-0.089,0.157-0.085,0.35,0.008,0.504
    l11.5,19C11.663,21.908,11.826,22,12,22s0.337-0.092,0.428-0.241
    l11.5-19C24.021,2.605,24.025,2.412,23.936,2.255z"></path>
</svg>`;

    inputSingleClassList = [
        'dcf-b-0',
    ];

    inputGroupMultiple = [
        'dcf-d-flex',
        'dcf-flex-wrap',
    ];

    inputMultipleClassList = [
        'dcf-b-0',
        'dcf-flex-grow-1',
        'dcf-flex-shrink-0',
    ];

    availableItemsListClassList = [
        'dcf-absolute',
        'dcf-d-none',
        'dcf-mb-0',
        'dcf-pl-0',
        'dcf-w-100%',
        'dcf-z-2',
    ];

    availableItemsGroupClassList = [
        'dcf-m-0',
        'dcf-pl-0',
    ];

    availableItemsGroupLabelClassList = [
        'dcf-mb-0',
        'dcf-bold',
    ];

    availableItemClassList = [
        'dcf-relative',
        'dcf-d-flex',
        'dcf-flex-row',
        'dcf-flex-nowrap',
        'dcf-jc-between',
        'dcf-ai-center',
        'dcf-mb-0',
    ];

    availableItemIndicatorSVG = `<svg
    xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" class="dcf-fill-current dcf-h-4 dcf-w-4 dcf-d-block">
    <path d="M31,0.4C30.6,0.1,30-0.1,29.4,0c-0.6,0.1-1.1,0.4-1.5,0.9
    L10.1,26.3L3.8,20c-0.4-0.4-1-0.6-1.6-0.6c0,0,0,0,0,0
    c-0.6,0-1.2,0.2-1.6,0.6C0.2,20.5,0,21,0,21.6
    c0,0.6,0.2,1.2,0.7,1.6l8.1,8.1c0.4,0.4,1,0.7,1.6,0.7
    c0.7,0,1.4-0.4,1.8-1L31.6,3.5
    C32.3,2.5,32.1,1.1,31,0.4z"/>
</svg>`;

    availableItemsNoResultsClassList = [
        'dcf-mb-0',
        'dcf-bold',
    ];


    /**
     * Constructor for the multi-select combobox
     * @param { HTMLSelectElement } selectElement The select that will be used to build the component
     */
    constructor(selectElement, options = {}) {

        if ('searchAndSelectClassList' in options && Array.isArray(options.searchAndSelectClassList)) {
            this.searchAndSelectClassList = options.searchAndSelectClassList;
        }
        if ('searchAreaClassList' in options && Array.isArray(options.searchAreaClassList)) {
            this.searchAreaClassList = options.searchAreaClassList;
        }
        if ('selectedItemsListClassList' in options && Array.isArray(options.selectedItemsListClassList)) {
            this.selectedItemsListClassList = options.selectedItemsListClassList;
        }
        if ('selectedItemClassList' in options && Array.isArray(options.selectedItemClassList)) {
            this.selectedItemClassList = options.selectedItemClassList;
        }
        if ('selectedItemButtonClassList' in options && Array.isArray(options.selectedItemButtonClassList)) {
            this.selectedItemButtonClassList = options.selectedItemButtonClassList;
        }
        if ('selectedItemButtonSVG' in options && typeof options.selectedItemButtonSVG === 'string') {
            this.selectedItemButtonSVG = options.selectedItemButtonSVG;
        }
        if ('selectedItemLabelClassList' in options && Array.isArray(options.selectedItemLabelClassList)) {
            this.selectedItemLabelClassList = options.selectedItemLabelClassList;
        }
        if ('toggleButtonContainerClassList' in options && Array.isArray(options.toggleButtonContainerClassList)) {
            this.toggleButtonContainerClassList = options.toggleButtonContainerClassList;
        }
        if ('toggleButtonClassList' in options && Array.isArray(options.toggleButtonClassList)) {
            this.toggleButtonClassList = options.toggleButtonClassList;
        }
        if ('toggleButtonSVG' in options && typeof options.toggleButtonSVG === 'string') {
            this.toggleButtonSVG = options.toggleButtonSVG;
        }
        if ('inputSingleClassList' in options && Array.isArray(options.inputSingleClassList)) {
            this.inputSingleClassList = options.inputSingleClassList;
        }
        if ('inputGroupMultiple' in options && Array.isArray(options.inputGroupMultiple)) {
            this.inputGroupMultiple = options.inputGroupMultiple;
        }
        if ('inputMultipleClassList' in options && Array.isArray(options.inputMultipleClassList)) {
            this.inputMultipleClassList = options.inputMultipleClassList;
        }
        if ('availableItemsListClassList' in options && Array.isArray(options.availableItemsListClassList)) {
            this.availableItemsListClassList = options.availableItemsListClassList;
        }
        if ('availableItemsGroupClassList' in options && Array.isArray(options.availableItemsGroupClassList)) {
            this.availableItemsListClassList = options.availableItemsGroupClassList;
        }
        if ('availableItemsGroupLabelClassList' in options && Array.isArray(options.availableItemsGroupLabelClassList)) {
            this.availableItemsGroupLabelClassList = options.availableItemsGroupLabelClassList;
        }
        if ('availableItemClassList' in options && Array.isArray(options.availableItemClassList)) {
            this.availableItemClassList = options.availableItemClassList;
        }
        if ('availableItemIndicatorSVG' in options && typeof options.availableItemIndicatorSVG === 'string') {
            this.availableItemIndicatorSVG = options.availableItemIndicatorSVG;
        }
        if ('availableItemsNoResultsClassList' in options && Array.isArray(options.availableItemsNoResultsClassList)) {
            this.availableItemsNoResultsClassList = options.availableItemsNoResultsClassList;
        }

        this.selectElement = selectElement;

        if (this.selectElement.getAttribute('multiple') !== null) {
            this.multiple = true;
        }

        // These are the IDs that will be used for the whole component
        this.selectID = this.selectElement.getAttribute('id') || this.uuid.concat('-search-and-select-select');
        this.searchAndSelectID = this.uuid.concat('-search-and-select');
        this.inputID = this.uuid.concat('-search-and-select-input');
        this.availableItemsListID = this.uuid.concat('-search-and-select-available-items-list');

        // This is the core markup for the component
        this.searchAndSelectElement = document.createElement('div');
        this.searchAndSelectElement.innerHTML = `<div
class="dcf-search-and-select-search-area-single ${ this.searchAreaClassList.join(' ') }" >
    <input
    class="${ this.inputSingleClassList.join(' ') }"
    type="text"
    role="combobox"
    id=${ this.inputID }
    aria-haspopup="listbox"
    aria-autocomplete="list"
    aria-expanded="false"
    aria-controls="${ this.availableItemsListID }"
    >
    <div class="dcf-search-and-select-open-btn ${ this.toggleButtonContainerClassList.join(' ') }">
    <button
        class="${ this.toggleButtonClassList.join(' ') }"
        type="button"
        tabindex="-1"
        aria-expanded="false"
        aria-controls="${ this.availableItemsListID }"
    >
        ${ this.toggleButtonSVG }
    </button>
    </div>
</div>`;
        this.searchAndSelectElement.classList.add('dcf-search-and-select', ...this.searchAndSelectClassList);
        this.searchAndSelectElement.setAttribute('id', this.searchAndSelectID);
        this.searchAndSelectElement.setAttribute('hidden', 'hidden'); // This will be removed later in the constructor
        this.searchAndSelectElement.dataset.for = this.selectID;

        // We will select the items for use in the rest of the component
        this.inputElement = this.searchAndSelectElement.querySelector('input');
        this.openButtonElement = this.searchAndSelectElement.querySelector('.dcf-search-and-select-open-btn button');
        this.searchAreaElement = this.searchAndSelectElement.querySelector('.dcf-search-and-select-search-area-single');

        if (this.multiple) {
            this.selectedItemsListID = this.uuid.concat('-search-and-select-selected-items-list');
            this.selectedItemsHelpID = this.uuid.concat('-search-and-select-selected-items-list-help');

            // This is the core markup for the component
            this.searchAndSelectElement.innerHTML = `<div
class="dcf-search-and-select-search-area-multiple ${ this.searchAreaClassList.join(' ') }" >
    <div class="dcf-search-and-select-multiple-input-group ${ this.inputGroupMultiple.join(' ') }">
    <span id="${ this.selectedItemsHelpID }" class="dcf-sr-only">Press Delete or Backspace to Remove.</span>
    <ul
        class="dcf-search-and-select-selected-items ${ this.selectedItemsListClassList.join(' ') }"
        role="listbox"
        aria-describedby="${ this.selectedItemsHelpID }"
        id=${ this.selectedItemsListID }
        tabindex="-1"
        aria-activedescendant=""
        aria-orientation="horizontal"
    ></ul>
    <input
        class="${ this.inputMultipleClassList.join(' ') }"
        type="text"
        role="combobox"
        id=${ this.inputID }
        aria-haspopup="listbox"
        aria-autocomplete="list"
        aria-expanded="false"
        aria-controls="${ this.availableItemsListID }"
    >
    </div>
    <div class="dcf-search-and-select-open-btn ${ this.toggleButtonContainerClassList.join(' ') }">
    <button
        class="${ this.toggleButtonClassList.join(' ') }"
        type="button"
        tabindex="-1"
        aria-expanded="false"
        aria-controls="${ this.availableItemsListID }"
    >
        ${ this.toggleButtonSVG }
    </button>
    </div>
</div>`;

            // Re-select these since the elements have changed
            this.inputElement = this.searchAndSelectElement.querySelector('input');
            this.openButtonElement = this.searchAndSelectElement.querySelector('.dcf-search-and-select-open-btn button');
            this.selectedItemsListElement = this.searchAndSelectElement.querySelector('.dcf-search-and-select-selected-items');
            this.searchAreaElement = this.searchAndSelectElement.querySelector('.dcf-search-and-select-search-area-multiple');
        }

        // We will parse the select element and build the available items from that
        this.parsedSelect = this.#parseSelect();

        // insert search-select after select element
        this.selectElement.after(this.searchAndSelectElement);

        // In the multi-select #buildAvailableItems will use the selectedItemsList
        // If we did not have init this step would break and cause errors
        this.availableItemsListElement = this.#buildAvailableItems();
        this.availableItemsListElement.setAttribute('id', this.availableItemsListID);
        this.availableItemsListElement.classList.add(
            'dcf-search-and-select-available-items',
            ...this.availableItemsListClassList,
        );
        this.searchAndSelectElement.append(this.availableItemsListElement);

        this.#fixSelectReferences();
        this.#transferSelectAttributes();
        this.#setDisabled(this.selectElement.getAttribute('disabled') !== null);
        this.#setReadOnly(this.selectElement.getAttribute('readonly') !== null);

        // We will finish setting up the event listeners and un-hide the element
        this.#addEventListeners();
        this.searchAndSelectElement.removeAttribute('hidden');

        if (this.multiple) {
            this.availableItemsListElement.setAttribute('aria-multiselectable', true);
        }
    }

    /**
     * Fix any references to the hidden select
     */
    #fixSelectReferences() {
        const attributesToFix = [
            'for',
            'aria-controls',
            'aria-describedby',
        ];

        attributesToFix.forEach((singleAttr) => {
            document.querySelectorAll(`[${ singleAttr }="${ this.selectID }"]`).forEach((elementToFix) => {
                elementToFix.setAttribute(singleAttr, this.inputID);
            });
        });
    }

    /**
     * If the select element has attributes set it will transfer them to the input
     */
    #transferSelectAttributes() {
        const attributesToFix = [
            'aria-describedby',
            'aria-label',
            'aria-labelledby',
            'aria-owns',
        ];

        attributesToFix.forEach((singleAttr) => {
            if (this.selectElement.getAttribute(singleAttr) !== null) {
                this.inputElement.setAttribute(singleAttr, this.selectElement.getAttribute(singleAttr));
            }
        });
    }

    /**
     * Recursively parses the select/optgroups
     * @returns { Array<ParsedOptgroup> }
     */
    #parseSelect() {
        const returnedData = this.#parseSelectInner(this.selectElement);
        const optgroups = returnedData.optgroups;

        if (returnedData.options.length > 0) {
            optgroups.push({
                tag: 'optgroup',
                label: 'Other',
                element: this.selectElement,
                items: returnedData.options,
            });
        }

        return optgroups;
    }

    /**
     * Recursively parses the select/optgroups
     * @param { HTMLSelectElement|HTMLOptGroupElement } selectOrOptgroup The select or optgroup to parse
     * @returns { parseSelectInner }
     */
    #parseSelectInner(selectOrOptgroup) {
        const optgroups = [];
        const options = [];

        for (const optgroupOrOption of selectOrOptgroup.children) {
            if (optgroupOrOption.tagName === 'OPTGROUP') {
                const returnedData = this.#parseSelectInner(optgroupOrOption);
                const returnedOptgroups = returnedData.optgroups;
                optgroups.push(...returnedOptgroups);

                optgroups.push({
                    tag: 'optgroup',
                    label: optgroupOrOption.getAttribute('label'),
                    element: optgroupOrOption,
                    items: returnedData.options,
                });
            } else if (optgroupOrOption.tagName === 'OPTION') {
                options.push({
                    tag: 'option',
                    label: optgroupOrOption.innerHTML,
                    value: optgroupOrOption.getAttribute('value'),
                    selected: optgroupOrOption.getAttribute('selected') !== null,
                    disabled: optgroupOrOption.getAttribute('disabled') !== null,
                    elemId: uuidv4().concat('-search-and-select-option'),
                    element: optgroupOrOption,
                });
            }
        }

        return { optgroups: optgroups, options: options };
    }

    /**
     * Builds the available items UL from output of parse select
     * @returns { HTMLUListElement }
     */
    #buildAvailableItems() {
        if (this.multiple) {
            return this.#buildAvailableItemsMultiple();
        }
        return this.#buildAvailableItemsSingle();
    }

    /**
     * Builds the available items UL from output of parse select
     * SINGLE
     * @returns { HTMLUListElement }
     */
    #buildAvailableItemsSingle() {
        const availableItems = document.createElement('ul');
        availableItems.setAttribute('role', 'listbox');

        let lastSelectedOption = null;

        this.parsedSelect.forEach((singleOptgroup) => {
            const groupedItems = document.createElement('ul');
            groupedItems.setAttribute('role', 'group');
            groupedItems.classList.add('dcf-search-and-select-available-items-group', ...this.availableItemsGroupClassList);

            if (this.parsedSelect.length !== 1) {
                groupedItems.innerHTML = `${ groupedItems.innerHTML }
<li
class="${ this.availableItemsGroupLabelClassList.join(' ') }"
role="presentation"
>
${ singleOptgroup.label }
</li>`;
            }

            singleOptgroup.items.forEach((singleItem) => {
                const newItem = document.createElement('li');
                newItem.classList.add(
                    'dcf-search-and-select-available-item',
                    'dcf-search-and-select-clickable',
                    ...this.availableItemClassList,
                );
                newItem.setAttribute('role', 'option');
                newItem.setAttribute('aria-selected', 'false');
                newItem.setAttribute('aria-disabled', singleItem.disabled);
                newItem.setAttribute('id', `${ singleItem.elemId }-available`);
                newItem.dataset.value = singleItem.value;
                newItem.dataset.label = singleItem.label;
                newItem.dataset.elemId = singleItem.elemId;
                newItem.innerHTML = `<span
    class="dcf-search-and-select-available-item-label">
    ${ singleItem.label}
</span>
<span class="dcf-search-and-select-available-item-indicator" aria-hidden="true">
    ${ this.availableItemIndicatorSVG }
</span>`;
                groupedItems.append(newItem);

                if (singleItem.disabled === false && singleItem.selected === true) {
                    lastSelectedOption = newItem;
                }
            });

            availableItems.append(groupedItems);
        });

        if (lastSelectedOption !== null) {
            lastSelectedOption.setAttribute('aria-selected', 'true');
            this.inputElement.value = lastSelectedOption.dataset.label;
        }

        return availableItems;
    }

    /**
     * Builds the available items UL from output of parse select
     * MULTIPLE
     * @returns { HTMLUListElement }
     */
    #buildAvailableItemsMultiple() {
        const availableItems = document.createElement('ul');
        availableItems.setAttribute('role', 'listbox');

        this.parsedSelect.forEach((singleOptgroup) => {
            const groupedItems = document.createElement('ul');
            groupedItems.setAttribute('role', 'group');
            groupedItems.classList.add('dcf-search-and-select-available-items-group', ...this.availableItemsGroupClassList);

            if (this.parsedSelect.length !== 1) {
                groupedItems.innerHTML = `${ groupedItems.innerHTML }
<li
class="${ this.availableItemsGroupLabelClassList.join(' ') }"
role="presentation"
>
${ singleOptgroup.label }
</li>
            `;
            }

            singleOptgroup.items.forEach((singleItem) => {
                const newItem = document.createElement('li');
                newItem.classList.add(
                    'dcf-search-and-select-available-item',
                    'dcf-search-and-select-clickable',
                    ...this.availableItemClassList,
                );
                newItem.setAttribute('role', 'option');
                newItem.setAttribute('aria-selected', singleItem.disabled ? 'false' : singleItem.selected);
                newItem.setAttribute('aria-disabled', singleItem.disabled);
                newItem.setAttribute('id', `${ singleItem.elemId }-available`);
                newItem.dataset.value = singleItem.value;
                newItem.dataset.elemId = singleItem.elemId;
                newItem.innerHTML = `<span
    class="dcf-search-and-select-available-item-label">
    ${ singleItem.label}
</span>
<span class="dcf-search-and-select-available-item-indicator" aria-hidden="true">
    ${ this.availableItemIndicatorSVG }
</span>`;
                groupedItems.append(newItem);

                // We need to add the selected options into the selected items list
                if (singleItem.disabled === false && singleItem.selected === true) {
                    this.#appendNewSelectedItem(newItem);
                    this.selectedItemsListElement.setAttribute('tabindex', '0');
                }
            });

            availableItems.append(groupedItems);
        });

        return availableItems;
    }

    /**
     * We will build a new selected item element and append it to the list of selected items
     * @param { HTMLLIElement } singleAvailableItem The li from the available items list
     */
    #appendNewSelectedItem(singleAvailableItem) {
        if (!this.#isElementAnAvailableItem(singleAvailableItem)) {
            throw new Error('Element is not an available item');
        }

        const newSelectedItem = document.createElement('li');
        newSelectedItem.dataset.elemId = singleAvailableItem.dataset.elemId;
        newSelectedItem.setAttribute('id', `${ singleAvailableItem.dataset.elemId }-selected`);
        newSelectedItem.classList.add(
            'dcf-search-and-select-selected-item',
            'dcf-search-and-select-clickable',
            ... this.selectedItemClassList,
        );
        newSelectedItem.innerHTML = `<button
    class="
    dcf-search-and-select-selected-item-remove-btn
    ${ this.selectedItemButtonClassList.join(' ') }
    "
    type="button"
    tabindex="-1"
>
    ${ this.selectedItemButtonSVG }
</button>
<span class="
    dcf-search-and-select-selected-item-label
    ${ this.selectedItemLabelClassList.join(' ') }">
    ${ singleAvailableItem.querySelector('.dcf-search-and-select-available-item-label').innerText }
</span>`;
        this.selectedItemsListElement.append(newSelectedItem);

        // If the item is not in view then we will scroll it into view
        if (!this.#isSelectedItemInView(newSelectedItem)) {
            newSelectedItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }

    /**
     * Add event listeners for the different parts of the search and select element
     */
    #addEventListeners() {
        if (this.multiple) {
            return this.#addEventListenersMultiple();
        }
        return this.#addEventListenersSingle();
    }

    #addEventListenersSingle() {
        document.body.addEventListener('pointerup', (event) => {
            if (!this.searchAndSelectElement.contains(event.target)) {
                this.closeAvailableItems();
                this.#setVisualFocusOn(false);
            }
        }, true);

        this.searchAreaElement.addEventListener('click', () => {
            if (this.isComponentDisabled()) {
                return;
            }

            this.#setVisualFocusOn(this.searchAreaElement);
            this.inputElement.focus();
            if (this.isComponentReadOnly() || this.isAvailableItemsOpen()) {
                this.closeAvailableItems();
            } else {
                this.#filterAvailableItems();
                this.openAvailableItems();
            }
        });

        this.inputElement.addEventListener('focus', () => {
            this.#setVisualFocusOn(this.searchAreaElement);
        });

        this.inputElement.addEventListener('keydown', (event) => {
            if (this.isComponentReadOnly()) {
                return;
            }

            const altKey = event.altKey;
            let preventDefault = false;
            const length = this.inputElement.value.length;

            switch (event.code) {
            case 'Enter':
                if (this.#visualFocusOnAvailableItems()) {
                    const currentItemElement = this.getAvailableItemActiveDescendant();
                    if (currentItemElement !== false) {
                        if (!this.#isAvailableItemDisabled(currentItemElement)) {
                            if (this.#isAvailableItemSelected(currentItemElement)) {
                                this.#removeAvailableItem(currentItemElement);
                            } else {
                                this.#selectAvailableItem(currentItemElement);
                            }
                        }
                    }
                } else {
                    if (!this.isAvailableItemsOpen()) {
                        this.#filterAvailableItems();
                        this.openAvailableItems();
                    }
                    this.#setVisualFocusOn(this.availableItemsListElement);
                    this.#setAvailableItemActiveDescendant(this.getFirstAvailableItem());
                    this.#scrollActiveAvailableItemInView();
                }
                preventDefault = true;
                break;

            case 'Down':
            case 'ArrowDown':
                if (altKey) {
                    if (!this.isAvailableItemsOpen()) {
                        this.#filterAvailableItems();
                        this.openAvailableItems();
                    }
                } else {
                    if (!this.isAvailableItemsOpen()) {
                        this.#filterAvailableItems();
                        this.openAvailableItems();
                    }
                    if (!this.#visualFocusOnAvailableItems()) {
                        this.#setVisualFocusOn(this.availableItemsListElement);
                        this.#setAvailableItemActiveDescendant(this.getFirstAvailableItem());
                        this.#scrollActiveAvailableItemInView();
                    } else {
                        this.#setVisualFocusOn(this.availableItemsListElement);
                        this.#setAvailableItemActiveDescendant(this.getNextAvailableItem());
                        this.#scrollActiveAvailableItemInView();
                    }
                }
                preventDefault = true;
                break;

            case 'Esc':
            case 'Escape':
                if (this.isAvailableItemsOpen()) {
                    this.closeAvailableItems(true);
                    this.#setVisualFocusOn(this.searchAreaElement);
                }
                preventDefault = true;
                break;

            case 'Up':
            case 'ArrowUp':
                if (altKey) {
                    if (!this.isAvailableItemsOpen()) {
                        this.#filterAvailableItems();
                        this.openAvailableItems();
                    }
                } else {
                    if (!this.isAvailableItemsOpen()) {
                        this.#filterAvailableItems();
                        this.openAvailableItems();
                    }
                    if (!this.#visualFocusOnAvailableItems()) {
                        this.#setVisualFocusOn(this.availableItemsListElement);
                        this.#setAvailableItemActiveDescendant(this.getLastAvailableItem());
                        this.#scrollActiveAvailableItemInView();
                    } else {
                        this.#setVisualFocusOn(this.availableItemsListElement);
                        this.#setAvailableItemActiveDescendant(this.getPreviousAvailableItem());
                        this.#scrollActiveAvailableItemInView();
                    }
                }
                preventDefault = true;
                break;

            case 'Tab':
                this.closeAvailableItems(true);
                this.#setVisualFocusOn(false);
                break;

            case 'Home':
                this.inputElement.setSelectionRange(0, 0);
                preventDefault = true;
                break;

            case 'End':
                this.inputElement.setSelectionRange(length, length);
                preventDefault = true;
                break;

            default:
                break;
            }

            if (preventDefault) {
                event.stopPropagation();
                event.preventDefault();
            }
        });

        this.inputElement.addEventListener('keyup', (event) => {
            if (this.isComponentReadOnly()) {
                return;
            }

            const char = event.key;
            let preventDefault = false;

            if (event.key === 'Escape' || event.key === 'Esc') {
                return;
            }

            switch (event.code) {
            case 'Backspace':
                this.#setVisualFocusOn(this.searchAreaElement);
                this.#filterAvailableItems();
                this.#setAvailableItemActiveDescendant(false);
                preventDefault = true;
                break;

            case 'Left':
            case 'ArrowLeft':
            case 'Right':
            case 'ArrowRight':
            case 'Home':
            case 'End':
                this.#setVisualFocusOn(this.searchAreaElement);
                preventDefault = true;
                break;

            default:
                if (this.#isPrintableCharacter(char)) {
                    this.#setVisualFocusOn(this.searchAreaElement);
                    this.#filterAvailableItems();
                    this.openAvailableItems();
                    this.#setAvailableItemActiveDescendant(false);
                }
                break;
            }

            if (preventDefault) {
                event.stopPropagation();
                event.preventDefault();
            }
        });

        this.availableItemsListElement.addEventListener('click', (event) => {
            const closestItem = event.target.closest('.dcf-search-and-select-available-item');
            if (closestItem === null) {
                return;
            }

            // If an item is disabled you can not select or de-select
            if (!this.#isAvailableItemDisabled(closestItem)) {
                if (this.#isAvailableItemSelected(closestItem)) {
                    this.#removeAvailableItem(closestItem);
                } else {
                    this.#selectAvailableItem(closestItem);
                }
            }
            this.inputElement.focus();
            this.#setVisualFocusOn(this.availableItemsListElement);
            this.#setAvailableItemActiveDescendant(closestItem);
        });

        this.availableItemsListElement.addEventListener('pointermove', (event) => {
            const currentItem = this.getAvailableItemActiveDescendant();
            const closestItem = event.target.closest('.dcf-search-and-select-available-item');
            if (closestItem === null) {
                return;
            }

            if (currentItem === false || !closestItem.isSameNode(currentItem)) {
                this.#setAvailableItemActiveDescendant(closestItem);
            }
        });

        this.availableItemsListElement.addEventListener('pointerout', (event) => {
            if (this.availableItemsListElement.isSameNode(event.target)) {
                this.#setAvailableItemActiveDescendant(false);
            }
        });
    }

    #addEventListenersMultiple() {
        // This is for when we click outside the component
        document.body.addEventListener('pointerup', (event) => {
            if (!this.searchAndSelectElement.contains(event.target)) {
                this.closeAvailableItems();
                this.#setVisualFocusOn(false);
            }
        }, true);

        this.searchAreaElement.addEventListener('click', () => {
            if (this.isComponentDisabled()) {
                return;
            }

            this.#setVisualFocusOn(this.searchAreaElement);
            this.inputElement.focus();
            if (this.isAvailableItemsOpen() || this.isComponentReadOnly()) {
                this.closeAvailableItems();
            } else {
                this.#filterAvailableItems();
                this.openAvailableItems();
            }
        });

        this.inputElement.addEventListener('focus', () => {
            this.#setVisualFocusOn(this.searchAreaElement);
        });

        this.inputElement.addEventListener('keydown', (event) => {
            if (this.isComponentReadOnly()) {
                return;
            }

            const altKey = event.altKey;
            const shiftKey = event.shiftKey;
            let preventDefault = false;
            const length = this.inputElement.value.length;

            switch (event.code) {
            case 'Enter':
                if (this.#visualFocusOnAvailableItems()) {
                    const currentItemElement = this.getAvailableItemActiveDescendant();
                    if (currentItemElement !== false) {
                        if (!this.#isAvailableItemDisabled(currentItemElement)) {
                            if (this.#isAvailableItemSelected(currentItemElement)) {
                                this.#removeAvailableItem(currentItemElement);
                            } else {
                                this.#selectAvailableItem(currentItemElement);
                            }
                        }
                    }
                } else {
                    if (!this.isAvailableItemsOpen()) {
                        this.#filterAvailableItems();
                        this.openAvailableItems();
                    }
                    this.#setVisualFocusOn(this.availableItemsListElement);
                    this.#setAvailableItemActiveDescendant(this.getFirstAvailableItem());
                    this.#scrollActiveAvailableItemInView();
                }
                preventDefault = true;
                break;

            case 'Down':
            case 'ArrowDown':
                if (altKey) {
                    if (!this.isAvailableItemsOpen()) {
                        this.#filterAvailableItems();
                        this.openAvailableItems();
                    }
                } else {
                    if (!this.isAvailableItemsOpen()) {
                        this.#filterAvailableItems();
                        this.openAvailableItems();
                    }
                    if (!this.#visualFocusOnAvailableItems()) {
                        this.#setVisualFocusOn(this.availableItemsListElement);
                        this.#setAvailableItemActiveDescendant(this.getFirstAvailableItem());
                        this.#scrollActiveAvailableItemInView();
                    } else {
                        this.#setVisualFocusOn(this.availableItemsListElement);
                        this.#setAvailableItemActiveDescendant(this.getNextAvailableItem());
                        this.#scrollActiveAvailableItemInView();
                    }
                }
                preventDefault = true;
                break;

            case 'Esc':
            case 'Escape':
                if (this.isAvailableItemsOpen()) {
                    this.closeAvailableItems(true);
                    this.#setVisualFocusOn(this.searchAreaElement);
                }
                preventDefault = true;
                break;

            case 'Up':
            case 'ArrowUp':
                if (altKey) {
                    if (!this.isAvailableItemsOpen()) {
                        this.#filterAvailableItems();
                        this.openAvailableItems();
                    }
                } else {
                    if (!this.isAvailableItemsOpen()) {
                        this.#filterAvailableItems();
                        this.openAvailableItems();
                    }
                    if (!this.#visualFocusOnAvailableItems()) {
                        this.#setVisualFocusOn(this.availableItemsListElement);
                        this.#setAvailableItemActiveDescendant(this.getLastAvailableItem());
                        this.#scrollActiveAvailableItemInView();
                    } else {
                        this.#setVisualFocusOn(this.availableItemsListElement);
                        this.#setAvailableItemActiveDescendant(this.getPreviousAvailableItem());
                        this.#scrollActiveAvailableItemInView();
                    }
                }
                preventDefault = true;
                break;

            case 'Tab':
                this.closeAvailableItems(true);
                if (this.isSelectedItemTab() === false || !shiftKey) {
                    this.#setVisualFocusOn(false);
                }
                break;

            case 'Home':
                this.inputElement.setSelectionRange(0, 0);
                preventDefault = true;
                break;

            case 'End':
                this.inputElement.setSelectionRange(length, length);
                preventDefault = true;
                break;

            default:
                break;
            }

            if (preventDefault) {
                event.stopPropagation();
                event.preventDefault();
            }
        });

        this.inputElement.addEventListener('keyup', (event) => {
            if (this.isComponentReadOnly()) {
                return;
            }

            const char = event.key;
            let preventDefault = false;

            if (event.key === 'Escape' || event.key === 'Esc') {
                return;
            }

            switch (event.code) {
            case 'Backspace':
                this.#setVisualFocusOn(this.searchAreaElement);
                this.#filterAvailableItems();
                this.#setAvailableItemActiveDescendant(false);
                preventDefault = true;
                break;

            case 'Left':
            case 'ArrowLeft':
            case 'Right':
            case 'ArrowRight':
            case 'Home':
            case 'End':
                this.#setVisualFocusOn(this.searchAreaElement);
                preventDefault = true;
                break;

            default:
                if (this.#isPrintableCharacter(char)) {
                    this.#setVisualFocusOn(this.searchAreaElement);
                    this.#filterAvailableItems();
                    this.openAvailableItems();
                    this.#setAvailableItemActiveDescendant(false);
                }
                break;
            }

            if (preventDefault) {
                event.stopPropagation();
                event.preventDefault();
            }
        });

        this.availableItemsListElement.addEventListener('click', (event) => {
            const closestItem = event.target.closest('.dcf-search-and-select-available-item');
            if (closestItem === null) {
                return;
            }

            // If an item is disabled you can not select or de-select
            if (!this.#isAvailableItemDisabled(closestItem)) {
                if (this.#isAvailableItemSelected(closestItem)) {
                    this.#removeAvailableItem(closestItem);
                } else {
                    this.#selectAvailableItem(closestItem);
                }
            }
            this.inputElement.focus();
            this.#setVisualFocusOn(this.availableItemsListElement);
            this.#setAvailableItemActiveDescendant(closestItem);
        });

        this.availableItemsListElement.addEventListener('pointermove', (event) => {
            const currentItem = this.getAvailableItemActiveDescendant();
            const closestItem = event.target.closest('.dcf-search-and-select-available-item');
            if (closestItem === null) {
                return;
            }

            if (currentItem === false || !closestItem.isSameNode(currentItem)) {
                this.#setAvailableItemActiveDescendant(closestItem);
            }
        });

        this.availableItemsListElement.addEventListener('pointerout', (event) => {
            if (this.availableItemsListElement.isSameNode(event.target)) {
                this.#setAvailableItemActiveDescendant(false);
            }
        });

        this.selectedItemsListElement.addEventListener('click', (event) => {
            if (this.isComponentDisabled()) {
                return;
            }

            const closestSelectedItem = event.target.closest('.dcf-search-and-select-selected-item');
            if (closestSelectedItem === null) {
                return;
            }

            const closestDeleteButton = event.target.closest('.dcf-search-and-select-selected-item-remove-btn');
            if (closestDeleteButton !== null && !this.isComponentReadOnly()) {
                this.selectedItemsListElement.focus();
                this.#removeSelectedItem(closestSelectedItem);
                this.#setAvailableItemActiveDescendant(false);
                event.stopPropagation();
                return;
            }

            this.#setVisualFocusOn(this.selectedItemsListElement);
            this.#setAvailableItemActiveDescendant(false);
            this.setSelectedItemActiveDescendant(closestSelectedItem);
            event.stopPropagation();
        });

        this.selectedItemsListElement.addEventListener('pointermove', (event) => {
            if (this.isComponentDisabled()) {
                return;
            }

            const currentItem = this.getSelectedItemActiveDescendant();
            const closestSelectedItem = event.target.closest('.dcf-search-and-select-selected-item');
            if (closestSelectedItem === null) {
                return;
            }

            if (currentItem === false || !closestSelectedItem.isSameNode(currentItem)) {
                this.setSelectedItemActiveDescendant(closestSelectedItem);
            }
            event.stopPropagation();
        });

        this.selectedItemsListElement.addEventListener('pointerout', (event) => {
            if (this.selectedItemsListElement.isSameNode(event.target)) {
                this.setSelectedItemActiveDescendant(false);
                event.stopPropagation();
            }
        });

        this.selectedItemsListElement.addEventListener('focus', () => {
            const currentItem = this.getSelectedItemActiveDescendant();
            this.#setVisualFocusOn(this.selectedItemsListElement);
            if (currentItem === false) {
                this.setSelectedItemActiveDescendant(this.getFirstSelectedItem());
            }
        });

        this.selectedItemsListElement.addEventListener('blur', () => {
            this.#setVisualFocusOn(false);
            this.setSelectedItemActiveDescendant(false);
        });

        this.selectedItemsListElement.addEventListener('keydown', (event) => {
            if (this.isComponentDisabled()) {
                return;
            }

            let preventDefault = false;
            const currentItem = this.getSelectedItemActiveDescendant();
            const firstItem = this.getFirstSelectedItem();

            switch (event.code) {
            case 'Left':
            case 'ArrowLeft':
                if (currentItem === false) {
                    this.setSelectedItemActiveDescendant(this.getLastSelectedItem());
                }
                this.#setVisualFocusOn(this.selectedItemsListElement);
                this.setSelectedItemActiveDescendant(this.getPreviousSelectedItem());
                this.scrollActiveSelectedItemInView();
                preventDefault = true;
                break;

            case 'Right':
            case 'ArrowRight':
                if (currentItem === false) {
                    this.setSelectedItemActiveDescendant(this.getFirstSelectedItem());
                }
                this.#setVisualFocusOn(this.selectedItemsListElement);
                this.setSelectedItemActiveDescendant(this.getNextSelectedItem());
                this.scrollActiveSelectedItemInView();
                preventDefault = true;
                break;

            case 'Home':
                this.#setVisualFocusOn(this.selectedItemsListElement);
                this.setSelectedItemActiveDescendant(this.getFirstSelectedItem());
                this.scrollActiveSelectedItemInView();
                preventDefault = true;
                break;

            case 'End':
                this.#setVisualFocusOn(this.selectedItemsListElement);
                this.setSelectedItemActiveDescendant(this.getLastSelectedItem());
                this.scrollActiveSelectedItemInView();
                preventDefault = true;
                break;

            case 'Backspace':
            case 'Delete':
                if (!this.isComponentReadOnly()) {
                    if (firstItem.isSameNode(currentItem)) {
                        this.#removeSelectedItem(currentItem);
                        this.setSelectedItemActiveDescendant(this.getFirstSelectedItem());
                    } else {
                        this.setSelectedItemActiveDescendant(this.getPreviousSelectedItem());
                        this.#removeSelectedItem(currentItem);
                    }
                    preventDefault = true;
                }
                break;

            default:
                break;
            }

            if (preventDefault) {
                event.stopPropagation();
                event.preventDefault();
            }
        });
    }

    /**
     * Will turn the component's disabled mode on or off
     * @param { bool } boolDisabled the new disabled state
     */
    #setDisabled(boolDisabled) {
        if (this.multiple) {
            return this.#setDisabledMultiple(boolDisabled);
        }
        return this.#setDisabledSingle(boolDisabled);
    }

    #setDisabledSingle(boolDisabled) {
        let formattedBoolDisabled = boolDisabled;
        if (typeof formattedBoolDisabled !== 'boolean') {
            formattedBoolDisabled = false;
        }

        if (formattedBoolDisabled) {
            this.inputElement.setAttribute('disabled', 'disabled');
            this.openButtonElement.setAttribute('disabled', 'disabled');
            this.searchAndSelectElement.classList.add('dcf-search-and-select-disabled');
            this.#setVisualFocusOn(false);
            this.closeAvailableItems();
        } else {
            this.inputElement.removeAttribute('disabled');
            this.openButtonElement.removeAttribute('disabled');
            this.searchAndSelectElement.classList.remove('dcf-search-and-select-disabled');
        }
    }

    #setDisabledMultiple(boolDisabled) {
        let formattedBoolDisabled = boolDisabled;
        if (typeof formattedBoolDisabled !== 'boolean') {
            formattedBoolDisabled = false;
        }

        if (formattedBoolDisabled) {
            this.inputElement.setAttribute('disabled', 'disabled');
            this.openButtonElement.setAttribute('disabled', 'disabled');
            this.searchAndSelectElement.classList.add('dcf-search-and-select-disabled');
            this.selectedItemsListElement.setAttribute('aria-disabled', 'true');
            this.selectedItemsListElement.setAttribute('tabindex', '-1');
            this.selectedItemsListElement.querySelectorAll('button').forEach((selectedItemButton) => {
                selectedItemButton.setAttribute('disabled', 'disabled');
            });
            this.#setVisualFocusOn(false);
            this.closeAvailableItems();
        } else {
            const allSelectedItems = this.selectedItemsListElement.querySelectorAll('li');

            this.inputElement.removeAttribute('disabled');
            this.openButtonElement.removeAttribute('disabled');
            this.searchAndSelectElement.classList.remove('dcf-search-and-select-disabled');
            this.selectedItemsListElement.removeAttribute('aria-disabled');
            this.selectedItemsListElement.setAttribute(
                'tabindex',
                allSelectedItems.length === 0 ? '-1' : '0',
            );
            this.selectedItemsListElement.querySelectorAll('button').forEach((selectedItemButton) => {
                selectedItemButton.removeAttribute('disabled');
            });
        }
    }

    /**
     * Determines if the component is in disabled mode
     * @returns { bool } true if the component is disabled
     */
    isComponentDisabled() {
        return this.inputElement.getAttribute('disabled') !== null;
    }

    /**
     * Will turn the component's readonly mode on or off
     * @param { bool } boolReadOnly the new readonly state
     */
    #setReadOnly(boolReadOnly) {
        if (this.multiple) {
            return this.#setReadOnlyMultiple(boolReadOnly);
        }
        return this.#setReadOnlySingle(boolReadOnly);
    }

    #setReadOnlySingle(boolReadOnly) {
        let formattedBoolReadOnly = boolReadOnly;
        if (typeof formattedBoolReadOnly !== 'boolean') {
            formattedBoolReadOnly = false;
        }

        if (formattedBoolReadOnly) {
            this.inputElement.setAttribute('readonly', 'readonly');
            this.openButtonElement.setAttribute('readonly', 'readonly');
            this.closeAvailableItems();
        } else {
            this.inputElement.removeAttribute('readonly');
            this.openButtonElement.removeAttribute('readonly');
        }
    }

    #setReadOnlyMultiple(boolReadOnly) {
        let formattedBoolReadOnly = boolReadOnly;
        if (typeof formattedBoolReadOnly !== 'boolean') {
            formattedBoolReadOnly = false;
        }

        if (formattedBoolReadOnly) {
            this.inputElement.setAttribute('readonly', 'readonly');
            this.openButtonElement.setAttribute('readonly', 'readonly');
            this.selectedItemsListElement.setAttribute('aria-readonly', 'true');
            this.selectedItemsListElement.querySelectorAll('button').forEach((selectedItemButton) => {
                selectedItemButton.setAttribute('readonly', 'readonly');
            });
            this.closeAvailableItems();
        } else {
            this.inputElement.removeAttribute('readonly');
            this.openButtonElement.removeAttribute('readonly');
            this.selectedItemsListElement.removeAttribute('aria-readonly');
            this.selectedItemsListElement.querySelectorAll('button').forEach((selectedItemButton) => {
                selectedItemButton.removeAttribute('readonly');
            });
        }
    }

    /**
     * Determines if the selected items list is in the tab list
     * @returns { bool } true if the tab-able
     */
    isSelectedItemTab() {
        return this.selectedItemsListElement.getAttribute('tabindex') === '0';
    }

    /**
     * Determines if the component is in readonly mode
     * @returns { bool } true if the component is readonly
     */
    isComponentReadOnly() {
        return this.inputElement.getAttribute('readonly') !== null;
    }

    /**
     * Determines if the keyboard input was a printable character or not
     * @param { string } str string to test
     * @returns { bool } true if the string was a printable character
     */
    #isPrintableCharacter(str) {
        return str.length === 1 && str.match(/\S| /);
    }

    /**
     * Determines if the available items list is expanded or not
     * @returns { bool } true if the available items list is expanded
     */
    isAvailableItemsOpen() {
        return !this.availableItemsListElement.classList.contains('dcf-d-none');
    }

    /**
     * Handles functionality of opening/expanding the available items list
     */
    openAvailableItems() {
        this.inputElement.setAttribute('aria-expanded', 'true');
        this.openButtonElement.setAttribute('aria-expanded', 'true');

        this.availableItemsListElement.classList.remove('dcf-d-none');
    }

    /**
     * Handles functionality of closing/un-expanding the available items list
     */
    closeAvailableItems() {
        this.inputElement.setAttribute('aria-expanded', 'false');
        this.openButtonElement.setAttribute('aria-expanded', 'false');

        this.availableItemsListElement.classList.add('dcf-d-none');
    }

    /**
     * Determines if the visual focus is on the available items list
     * @returns { bool } true if the available items list has visual focus
     */
    #visualFocusOnAvailableItems() {
        return this.availableItemsListElement.dataset.focused === 'true';
    }

    /**
     * Handles functionality of how to set the visual focus on an element
     * @param { HTMLElement|false } elementToFocus The element to focus on or false to not focus on anything
     */
    #setVisualFocusOn(elementToFocus) {
        // Un-set the current focused element if there is any
        if (this.currentFocus !== null && this.availableItemsListElement.isSameNode(this.currentFocus)) {
            this.searchAreaElement.classList.remove('dcf-search-and-select-visual-focus');
            delete this.availableItemsListElement.dataset.focused;
        } else if (this.currentFocus !== null) {
            this.currentFocus.classList.remove('dcf-search-and-select-visual-focus');
            delete this.currentFocus.dataset.focused;
        }

        // Set the focus on the new element or do nothing if false
        if (elementToFocus !== false && this.availableItemsListElement.isSameNode(elementToFocus)) {
            this.searchAreaElement.classList.add('dcf-search-and-select-visual-focus');
            this.availableItemsListElement.dataset.focused = 'true';
            this.currentFocus = elementToFocus;
        } else if (elementToFocus !== false) {
            elementToFocus.classList.add('dcf-search-and-select-visual-focus');
            elementToFocus.dataset.focused = 'true';
            this.currentFocus = elementToFocus;
        } else {
            this.currentFocus = null;
        }
    }

    /**
     * Handles functionality of how to set the visual hover on an element
     * @param { HTMLElement|false } elementToHover The element to hover on or false to not hover on anything
     */
    #setVisualHover(elementToHover) {
        // Un-set hover on anything inside the component
        this.searchAndSelectElement.querySelectorAll('.dcf-search-and-select-visual-hover').forEach((elem) => {
            elem.classList.remove('dcf-search-and-select-visual-hover');
        });

        // Set the hover on element or do nothing on false
        if (elementToHover !== false) {
            elementToHover.classList.add('dcf-search-and-select-visual-hover');
            this.currentHover = elementToHover;
        } else {
            this.currentHover = null;
        }
    }

    /**
     * Gets the currently active item in the available items list
     * @returns { HTMLLIElement|false } The currently active element in the available items list or false if there is none
     */
    getAvailableItemActiveDescendant() {
        const currentItemID = this.inputElement.getAttribute('aria-activedescendant');
        if (currentItemID !== null && currentItemID !== '') {
            const currentItemElement = document.getElementById(currentItemID);
            if (currentItemElement !== null) {
                return currentItemElement;
            }
        }

        return false;
    }

    /**
     * Gets the current active item in the select items list
     * @returns { HTMLLIElement|false } The currently active element in the available items list or false if there is none
     */
    getSelectedItemActiveDescendant() {
        const currentItemID = this.selectedItemsListElement.getAttribute('aria-activedescendant');
        if (currentItemID !== null && currentItemID !== '') {
            const currentItemElement = document.getElementById(currentItemID);
            if (currentItemElement !== null) {
                return currentItemElement;
            }
        }

        return false;
    }

    /**
     * Handles functionality of setting the active element on the available items list
     * @param { HTMLLIElement|false } itemToSet The list item to set or false if there is none
     */
    #setAvailableItemActiveDescendant(itemToSet) {
        if (itemToSet !== false && !this.#isElementAnAvailableItem(itemToSet)) {
            throw new Error('Element is not an available item');
        }

        if (itemToSet !== false) {
            this.inputElement.setAttribute('aria-activedescendant', itemToSet.getAttribute('id'));
            this.#setVisualHover(itemToSet);
        } else {
            this.#setVisualHover(false);
            this.inputElement.setAttribute('aria-activedescendant', '');
        }
    }

    /**
     * Handles functionality of setting the active element on the selected items list
     * @param { HTMLLIElement|false } itemToSet The list item to set or false if there is none
     */
    setSelectedItemActiveDescendant(itemToSet) {
        if (itemToSet !== false && !this.#isElementASelectedItem(itemToSet)) {
            throw new Error('Element is not a selected item');
        }

        if (itemToSet !== false) {
            this.selectedItemsListElement.setAttribute('aria-activedescendant', itemToSet.getAttribute('id'));
            this.#setVisualHover(itemToSet);
        } else {
            this.#setVisualHover(false);
            this.selectedItemsListElement.setAttribute('aria-activedescendant', '');
        }
    }

    /**
     * Handles functionality of scrolling the current active item into view
     */
    #scrollActiveAvailableItemInView() {
        const currentItemElement = this.getAvailableItemActiveDescendant();
        if (currentItemElement !== false && !this.#isAvailableItemInView(currentItemElement)) {
            currentItemElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }

    /**
     * Handles functionality of scrolling the current active item into view
     */
    scrollActiveSelectedItemInView() {
        const currentItemElement = this.getSelectedItemActiveDescendant();
        if (currentItemElement !== false && !this.#isSelectedItemInView(currentItemElement)) {
            currentItemElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }

    /**
     * Gets the next available item that is currently being shown
     * This will loop the beginning if we are at the end of the list
     * @returns { HTMLLIElement|null } The next shown available item or null if there is none
     */
    getNextAvailableItem() {
        let nextElement = null;
        let nextElementFlag = false;
        for (let index = 0; index < this.listOfAvailableItems.length; index++) {
            if (nextElementFlag) {
                nextElement = this.listOfAvailableItems[index];
                break;
            }
            if (this.listOfAvailableItems[index].getAttribute('id') === this.inputElement.getAttribute('aria-activedescendant')) {
                nextElementFlag = true;
            }
        }

        if (nextElement === null) {
            return this.getFirstAvailableItem();
        }
        return nextElement;
    }

    /**
     * Gets the previous available item that is currently being shown
     * This will loop to the end if we are the beginning of the list
     * @returns { HTMLLIElement|null } The previous shown available item or null if there is none
     */
    getPreviousAvailableItem() {
        let previousElement = null;
        for (let index = 0; index < this.listOfAvailableItems.length; index++) {
            if (this.listOfAvailableItems[index].getAttribute('id') === this.inputElement.getAttribute('aria-activedescendant')) {
                break;
            }
            previousElement = this.listOfAvailableItems[index];
        }

        if (previousElement === null) {
            return this.getLastAvailableItem();
        }
        return previousElement;
    }

    /**
     * Gets the first available item that is currently being shown
     * @returns { HTMLLIElement|null } The first shown available item or null if there is none
     */
    getFirstAvailableItem() {
        if (this.listOfAvailableItems.length === 0) {
            return false;
        }
        return this.listOfAvailableItems[0];
    }

    /**
     * Gets the last available item that is currently being shown
     * @returns { HTMLLIElement|null } The last shown available item or null if there is none
     */
    getLastAvailableItem() {
        if (this.listOfAvailableItems.length === 0) {
            return false;
        }
        return this.listOfAvailableItems[this.listOfAvailableItems.length - 1];
    }

    /**
     * Gets the next selected item
     * This will loop the beginning if we are at the end of the list
     * @returns { HTMLLIElement|null } The next selected item or null if there is none
     */
    getNextSelectedItem() {
        const currentItem = this.getSelectedItemActiveDescendant();
        if (currentItem === false) {
            return this.getFirstSelectedItem();
        }

        const nextElement = currentItem.nextElementSibling;
        if (nextElement === null) {
            return this.getFirstSelectedItem();
        }

        return nextElement;
    }

    /**
     * Gets the previous selected item
     * This will loop the end if we are at the beginning of the list
     * @returns { HTMLLIElement|null } The next selected item or null if there is none
     */
    getPreviousSelectedItem() {
        const currentItem = this.getSelectedItemActiveDescendant();
        if (currentItem === false) {
            return this.getLastSelectedItem();
        }

        const nextElement = currentItem.previousElementSibling;
        if (nextElement === null) {
            return this.getLastSelectedItem();
        }

        return nextElement;
    }

    /**
     * Gets the first selected item
     * @returns { HTMLLIElement|null } The first selected item or null if there is none
     */
    getFirstSelectedItem() {
        const allSelectedItems = this.selectedItemsListElement.children;
        if (allSelectedItems.length === 0) {
            return false;
        }
        return allSelectedItems[0];
    }

    /**
     * Gets the last selected item
     * @returns { HTMLLIElement|null } The last selected item or null if there is none
     */
    getLastSelectedItem() {
        const allSelectedItems = this.selectedItemsListElement.children;
        if (allSelectedItems.length === 0) {
            return false;
        }
        return allSelectedItems[allSelectedItems.length - 1];
    }

    /**
     * Handles the functionality of selecting an available item
     * @param { HTMLLIElement } itemToSelect The available item to select
     */
    #selectAvailableItem(itemToSelect) {
        if (this.multiple) {
            return this.#selectAvailableItemMultiple(itemToSelect);
        }
        return this.#selectAvailableItemSingle(itemToSelect);
    }

    #selectAvailableItemSingle(itemToSelect) {
        if (!this.#isElementAnAvailableItem(itemToSelect)) {
            throw new Error('Element is not an available item');
        }

        const allItems = this.availableItemsListElement.querySelectorAll('li.dcf-search-and-select-available-item');
        allItems.forEach((singleOption) => {
            singleOption.setAttribute('aria-selected', 'false');
        });
        itemToSelect.setAttribute('aria-selected', 'true');
        this.selectElement.querySelectorAll('option').forEach((singleOption) => {
            if (singleOption.value === itemToSelect.dataset.value) {
                singleOption.setAttribute('selected', 'selected');
            } else {
                singleOption.removeAttribute('selected', 'selected');
            }
        });
        this.closeAvailableItems();
        this.inputElement.value = itemToSelect.dataset.label;
    }

    #selectAvailableItemMultiple(itemToSelect) {
        if (!this.#isElementAnAvailableItem(itemToSelect)) {
            throw new Error('Element is not an available item');
        }

        itemToSelect.setAttribute('aria-selected', 'true');
        this.selectElement.querySelectorAll('option').forEach((singleOption) => {
            if (singleOption.value === itemToSelect.dataset.value) {
                singleOption.setAttribute('selected', 'selected');
            }
        });
        this.#appendNewSelectedItem(itemToSelect);
        this.selectedItemsListElement.setAttribute('tabindex', '0');
    }

    /**
     * Handles the functionality of de-selecting an available item
     * @param { HTMLLIElement } itemToRemove The available item to de-select
     */
    #removeAvailableItem(itemToRemove) {
        if (!this.#isElementAnAvailableItem(itemToRemove)) {
            throw new Error('Element is not an available item');
        }

        itemToRemove.setAttribute('aria-selected', 'false');
        this.selectElement.querySelectorAll('option').forEach((singleOption) => {
            if (singleOption.value === itemToRemove.dataset.value) {
                singleOption.removeAttribute('selected');
            }
        });

        if (this.multiple) {
            this.selectedItemsListElement.querySelectorAll(`li[data-elem-id="${itemToRemove.dataset.elemId}"]`).forEach((singleSelectedItem) => {
                singleSelectedItem.remove();
            });
            if (this.selectedItemsListElement.children.length === 0) {
                this.selectedItemsListElement.setAttribute('tabindex', '-1');
            }
        }
    }

    /**
     * Handles the functionality of de-selecting a selected item
     * @param { HTMLLIElement } itemToRemove The selected item to de-select
     */
    #removeSelectedItem(itemToRemove) {
        if (!this.#isElementASelectedItem(itemToRemove)) {
            throw new Error('Element is not a selected item');
        }

        const availableItem = this.availableItemsListElement.querySelector(`li[data-elem-id="${ itemToRemove.dataset.elemId }"]`);
        availableItem.setAttribute('aria-selected', 'false');
        this.selectElement.querySelectorAll('option').forEach((singleOption) => {
            if (singleOption.value === availableItem.dataset.value) {
                singleOption.removeAttribute('selected');
            }
        });
        itemToRemove.remove();
        if (this.selectedItemsListElement.children.length === 0) {
            this.selectedItemsListElement.setAttribute('tabindex', '-1');
            this.inputElement.focus();
        }
    }

    /**
     * Checks if the element has the class `dcf-search-and-select-available-item`
     * @param { HTMLElement } elementToCheck The element to check
     * @returns { bool } true if it does contain that class
     */
    #isElementAnAvailableItem(elementToCheck) {
        return elementToCheck.classList.contains('dcf-search-and-select-available-item');
    }

    /**
     * Checks if the available item is selected
     * @param { HTMLLIElement } itemToCheck The item to check if it is selected
     * @returns { bool } true if the item is selected
     */
    #isAvailableItemSelected(itemToCheck) {
        if (!this.#isElementAnAvailableItem(itemToCheck)) {
            throw new Error('Element is not an available item');
        }

        return itemToCheck.getAttribute('aria-selected') === 'true';
    }

    /**
     * Checks if the available item is disabled
     * @param { HTMLLIElement } itemToCheck The item to check if it is disabled
     * @returns { bool } true if the item is disabled
     */
    #isAvailableItemDisabled(itemToCheck) {
        if (!this.#isElementAnAvailableItem(itemToCheck)) {
            throw new Error('Element is not an available item');
        }

        return itemToCheck.getAttribute('aria-disabled') === 'true';
    }

    /**
     * Calculates if the available item is in view
     * @param { HTMLLIElement } itemToCheck The item to check if it is in view
     * @returns { bool } true if it is in view
     */
    #isAvailableItemInView(itemToCheck) {
        if (!this.#isElementAnAvailableItem(itemToCheck)) {
            throw new Error('Element is not an available item');
        }

        // Get the bounding client rect of the ul and li
        const listRect = this.availableItemsListElement.getBoundingClientRect();
        const itemToCheckRect = itemToCheck.getBoundingClientRect();

        // Check if the li is vertically in view within the ul
        return itemToCheckRect.top >= listRect.top &&
        itemToCheckRect.bottom <= listRect.bottom;
    }

    /**
     * Calculates if the selected item is in view
     * @param { HTMLLIElement } itemToCheck The item to check if it is in view
     * @returns { bool } true if it is in view
     */
    #isSelectedItemInView(itemToCheck) {
        if (!this.#isElementASelectedItem(itemToCheck)) {
            throw new Error('Element is not a selected item');
        }

        // Get the bounding client rect of the ul and li
        const listRect = this.searchAreaElement.getBoundingClientRect();
        const itemToCheckRect = itemToCheck.getBoundingClientRect();

        // Check if the li is vertically in view within the ul
        return itemToCheckRect.top >= listRect.top &&
        itemToCheckRect.bottom <= listRect.bottom;
    }

    /**
     * Checks if the element has the class `dcf-search-and-select-selected-item`
     * @param { HTMLElement } elementToCheck The element to check
     * @returns { bool } true if it does contain that class
     */
    #isElementASelectedItem(elementToCheck) {
        return elementToCheck.classList.contains('dcf-search-and-select-selected-item');
    }

    /**
     * Filters available items and hides any item that does not contain the input value's string
     */
    #filterAvailableItems() {
        const searchTerm = this.inputElement.value.trim().toUpperCase();
        const allItems = this.availableItemsListElement.querySelectorAll('li.dcf-search-and-select-available-item');
        const allItemGroups = this.availableItemsListElement.querySelectorAll('.dcf-search-and-select-available-items-group');
        this.listOfAvailableItems = [];

        // Removes any no results elements
        this.availableItemsListElement.querySelectorAll('.dcf-search-and-select-no-results').forEach((singleNoResult) => {
            singleNoResult.remove();
        });

        let noItemsFound = true;
        allItems.forEach((singleItem) => {
            const itemLabel = singleItem.querySelector('.dcf-search-and-select-available-item-label').innerText.toUpperCase();
            if (searchTerm === '' || itemLabel.includes(searchTerm)) {
                singleItem.classList.remove('dcf-d-none');
                singleItem.classList.add('dcf-d-flex');
                this.listOfAvailableItems.push(singleItem);
                noItemsFound = false;
            } else {
                singleItem.classList.add('dcf-d-none');
                singleItem.classList.remove('dcf-d-flex');
            }
        });

        allItemGroups.forEach((singleGroup) => {
            const shownGroupItems = singleGroup.querySelectorAll('.dcf-search-and-select-available-item:not(.dcf-d-none)');
            if (shownGroupItems.length === 0) {
                singleGroup.classList.add('dcf-d-none');
            } else {
                singleGroup.classList.remove('dcf-d-none');
            }
        });

        // if there were no items found it will add a note about no items being found
        if (noItemsFound) {
            const noItemsFoundElement = document.createElement('ul');
            noItemsFoundElement.setAttribute('role', 'presentation');
            noItemsFoundElement.classList.add('dcf-search-and-select-no-results', ...this.availableItemsGroupClassList);

            noItemsFoundElement.innerHTML = `<li
class="${ this.availableItemsNoResultsClassList.join(' ') }" role="option">
    No results found
</li>`;

            this.availableItemsListElement.append(noItemsFoundElement);
        }
    }
}
