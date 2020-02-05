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

    if (magicNumber in magicNumbers) {
      return magicNumbers[magicNumber];
    }
    return undefined;
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
}
