export function magicNumbers(magicNumber) {
    const magicNumbers = {

        // integer values
        int0: 0,
        int1: 1,
        int2: 2,
        int3: 3,
        int4: 4,
        int5: 5,
        int6: 6,
        int7: 7,
        int16: 16,

        intMinus1: -1,

        // hex values
        hex0x3: 0x3,
        hex0x8: 0x8,

        // Keycodes (Leave for backwards compatibility)
        tabCode: 9,
        escCode: 27,
        spaceKeyCode: 32,
        arrowLeftCode: 37,
        arrowUpCode: 38,
        arrowRightCode:  39,
        arrowDownCode: 40,
    };
    Object.freeze(magicNumbers);

    return magicNumber in magicNumbers ? magicNumbers[magicNumber] : undefined;
}

export function keyEvents(keyEvent) {
    const keyEvents = {
        arrowDown: { code: 'ArrowDown', key: 'ArrowDown', keyCode: 40 },
        arrowLeft: { code: 'ArrowLeft', key: 'ArrowLeft', keyCode: 37 },
        arrowRight: { code: 'ArrowRight', key: 'ArrowRight', keyCode: 39 },
        arrowUp: { code: 'ArrowUp', key: 'ArrowUp', keyCode: 38 },
        escape: { code: 'Escape', key: 'Escape', keyCode: 27 },
        keyC: { code: 'KeyC', key: 'c', keyCode: 67 },
        space: { code: 'Space', key: ' ', keyCode: 32 },
        tab: { code: 'Tab', key: 'Tab', keyCode: 9 },
        home: { code: 'Home', key: 'Home', keyCode: 36 },
        end: { code: 'End', key: 'End', keyCode: 35 },
    };
    Object.freeze(keyEvents);

    return keyEvent in keyEvents ? keyEvents[keyEvent] : undefined;
}

export function isKeyEvent(event, checkEvent) {
    const validKey = event.key && event.key === checkEvent.key && event.key === checkEvent.key;
    const validCode = event.code && checkEvent.code && event.code === checkEvent.code;
    const validKeyCode = event.keyCode && checkEvent.keyCode && event.keyCode === checkEvent.keyCode;
    return validKey || validCode || validKeyCode;
}

/**
 * Generates a random UUID
 * @returns {string} Random UUID
 */
export function uuidv4() {
    const NUMERIC_0 = magicNumbers('int0');
    const NUMERIC_16 = magicNumbers('int16');
    const HEX0x3 = magicNumbers('hex0x3');
    const HEX0x8 = magicNumbers('hex0x8');

    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (uuid) => {
        const rand = Math.random() * NUMERIC_16 | NUMERIC_0;
        const uuidv4 = uuid === 'x' ? rand : rand & HEX0x3 | HEX0x8;
        return uuidv4.toString(NUMERIC_16);
    });
}

export function checkSetElementId(element, defaultElementId = null) {
    let elementId = element.getAttribute('id');
    if (!elementId) {
        if (defaultElementId) {
            elementId = defaultElementId;
        } else {
            elementId = uuidv4();
        }
    }
    return elementId;
}

// Track in-flight stylesheet loads to avoid race conditions
const pendingStyleSheets = new Map();

/**
 * Loads a stylesheet
 * Avoids loading the same stylesheet twice and handles concurrent requests
 * @param {string} styleSheetSrc 
 * @returns {Promise<void>}
 */
export function loadStyleSheet(styleSheetSrc) {
    // Check if stylesheet is already loaded
    const linkAlreadyThere = document.querySelector(`link[rel="stylesheet"][href="${styleSheetSrc}"]`);
    if (linkAlreadyThere !== null) {
        return Promise.resolve();
    }

    // Check if there's already a pending load for this stylesheet
    if (pendingStyleSheets.has(styleSheetSrc)) {
        return pendingStyleSheets.get(styleSheetSrc);
    }

    // Create new promise for this stylesheet load
    const promise = new Promise((resolve, reject) => {
        // Double-check in case another load completed while we were checking the map
        const linkCheck = document.querySelector(`link[rel="stylesheet"][href="${styleSheetSrc}"]`);
        if (linkCheck !== null) {
            resolve();
            return;
        }

        // If the stylesheet is not already there then load it
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = styleSheetSrc;

        // Handle load and error events
        link.addEventListener('load', () => {
            pendingStyleSheets.delete(styleSheetSrc);
            resolve();
        });
        link.addEventListener('error', () => {
            pendingStyleSheets.delete(styleSheetSrc);
            reject(new Error(`Failed to load stylesheet: ${styleSheetSrc}`));
        });

        document.head.appendChild(link);
    });

    // Store the promise so concurrent requests can share it
    pendingStyleSheets.set(styleSheetSrc, promise);

    return promise;
}

/**
 * Loads multiple stylesheets in parallel
 * @param {string[]} styleSheetSrcs 
 * @returns {Promise<void>}
 */
export function loadStyleSheets(styleSheetSrcs) {
    return Promise.all(styleSheetSrcs.map(src => loadStyleSheet(src)));
}

/**
 * Converts a HTML string into a HTMLDocument object
 * 
 * @param { String } htmlString 
 * @returns { ChildNode | null }
 */
export function stringToDom(htmlString) {
    const doc = new DOMParser().parseFromString(htmlString, 'text/html');
    return doc.body.firstChild;
}

export function waitForTransition(element) {
    return new Promise((resolve) => {
        const styles = window.getComputedStyle(element);
        const duration = parseFloat(styles.transitionDuration);

        if (!duration) {
            resolve();
            return;
        }

        const propertyCount = styles.transitionProperty.split(',').length;
        let fired = 0;

        element.addEventListener('transitionend', function handler() {
            fired++;
            if (fired >= propertyCount) {
                element.removeEventListener('transitionend', handler);
                resolve();
            }
        });
    });
}
