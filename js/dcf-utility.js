class DCFUtility {
  static magicNumbers(magicNumber) {
    const magicNumbers = {
      int0: 0,
      int1: 1,
      int2: 2,
      int16: 16,
      hex0x3: 0x3,
      hex0x8: 0x8,
      escCode: 27
    };
    Object.freeze(magicNumbers);

    return magicNumber in magicNumbers ? magicNumbers[magicNumber] : undefined;
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

  static supportsWebp() {
    let supports = false;
    try {
      const supportCheck = window.sessionStorage.getItem('webpSupport');
      if (supportCheck !== null) {
        supports = supportCheck;
      } else {
        let WebP = new Image();
        WebP.src =
          'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
        WebP.onload = WebP.onerror = () => {
          supports = WebP.height === DCFUtility.magicNumbers('int2');
          window.sessionStorage.setItem('webpSupport', supports);
        };
      }
    } catch (err) {
      // do nothing
    }

    return supports;
  }

  static flagSupportsWebp(element = document.documentElement) {
    if (DCFUtility.this.supportsWebp()) {
      if (element.className.indexOf('dcf-no-webp') >= DCFUtility.magicNumbers('int0')) {
        element.className = element.className.replace(/\bdcf-no-webp\b/, 'dcf-webp');
      } else {
        element.className.concat(' dcf-webp');
      }
    }
  }
}
