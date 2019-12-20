class DCFUtility {
  static uuidv4() {
    const NUMERIC_0 = 0;
    const NUMERIC_16 = 16;
    const HEX0x3 = 0x3;
    const HEX0x8 = 0x8;

    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (uuid) => {
      let rand = Math.random() * NUMERIC_16 | NUMERIC_0,
        uuidv4 = uuid === 'x' ? rand : rand & HEX0x3 | HEX0x8;
      return uuidv4.toString(NUMERIC_16);
    });
  }
}
