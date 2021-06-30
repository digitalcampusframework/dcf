class DCFUtility {
  static magicNumbers(magicNumber) {
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
      arrowDownCode: 40
    };
    Object.freeze(magicNumbers);

    return magicNumber in magicNumbers ? magicNumbers[magicNumber] : undefined;
  }

  static keyEvents(keyEvent) {
    const keyEvents = {
      arrowDown: { code: 'ArrowDown', key: 'ArrowDown', keyCode: 40 },
      arrowLeft: { code: 'ArrowLeft', key: 'ArrowLeft', keyCode: 37 },
      arrowRight: { code: 'ArrowRight', key: 'ArrowRight', keyCode: 39 },
      arrowUp: { code: 'ArrowUp', key: 'ArrowUp', keyCode: 38 },
      escape: { code: 'Escape', key: 'Escape', keyCode: 27 },
      keyC: { code: 'KeyC', key: 'c', keyCode: 67 },
      space: { code: 'Space', key: ' ', keyCode: 32 },
      tab: { code: 'Tab', key: 'Tab', keyCode: 9 }
    };
    Object.freeze(keyEvents);

    return keyEvent in keyEvents ? keyEvents[keyEvent] : undefined;
  }

  static isKeyEvent(event, checkEvent) {
    const validKey = event.key && event.key === checkEvent.key && event.key === checkEvent.key;
    const validCode = event.code && checkEvent.code && event.code === checkEvent.code;
    const validKeyCode = event.keyCode && checkEvent.keyCode && event.keyCode === checkEvent.keyCode;
    return validKey || validCode || validKeyCode;
  }

  static uuidv4() {
    const NUMERIC_0 = DCFUtility.magicNumbers('int0');
    const NUMERIC_16 = DCFUtility.magicNumbers('int16');
    const HEX0x3 = DCFUtility.magicNumbers('hex0x3');
    const HEX0x8 = DCFUtility.magicNumbers('hex0x8');

    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (uuid) => {
      let rand = Math.random() * NUMERIC_16 | NUMERIC_0,
        uuidv4 = uuid === 'x' ? rand : rand & HEX0x3 | HEX0x8;
      return uuidv4.toString(NUMERIC_16);
    });
  }

  static testWebp(callback) {
    let supportsSessionCheck = null;
    try {
      supportsSessionCheck = window.sessionStorage ? window.sessionStorage.getItem('webpSupport') : null;
    } catch (exception) {
      supportsSessionCheck = null;
    }
    if (supportsSessionCheck !== null) {
      callback(supportsSessionCheck === 'true');
      return;
    }

    let webP = new Image();
    webP.onload = webP.onerror = () => {
      let supports = webP.height === DCFUtility.magicNumbers('int2');
      if (window.sessionStorage) {
        window.sessionStorage.setItem('webpSupport', supports);
      }
      callback(supports);
    };
    webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  }

  static flagSupportsWebP(element = document.documentElement) {
    DCFUtility.testWebp((supported) => {
      if (supported) {
        if (element.classList.contains('dcf-no-webp')) {
          element.classList.remove('dcf-no-webp');
        }
        element.classList.add('dcf-webp');
      }
    });
  }

  static flagSupportsJavaScript(element = document.documentElement) {
    if (element.classList.contains('dcf-no-js')) {
      element.classList.remove('dcf-no-js');
    }
    element.classList.add('dcf-js');
  }
}
