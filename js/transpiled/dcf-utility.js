function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var DCFUtility =
/*#__PURE__*/
function () {
  function DCFUtility() {
    _classCallCheck(this, DCFUtility);
  }

  _createClass(DCFUtility, null, [{
    key: "magicNumbers",
    value: function magicNumbers(magicNumber) {
      var magicNumbers = {
        int0: 0,
        int1: 1,
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
  }, {
    key: "uuidv4",
    value: function uuidv4() {
      var NUMERIC_0 = DCFUtility.magicNumbers('int0');
      var NUMERIC_16 = DCFUtility.magicNumbers('int16');
      var HEX0x3 = DCFUtility.magicNumbers('hex0x3');
      var HEX0x8 = DCFUtility.magicNumbers('hex0x8');
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (uuid) {
        var rand = Math.random() * NUMERIC_16 | NUMERIC_0,
            uuidv4 = uuid === 'x' ? rand : rand & HEX0x3 | HEX0x8;
        return uuidv4.toString(NUMERIC_16);
      });
    }
  }]);

  return DCFUtility;
}();