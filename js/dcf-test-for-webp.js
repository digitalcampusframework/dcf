// Test for WebP browser support
// Slightly modified https://github.com/djpogo/webp-inline-support

class DCFTestForWebp {
  constructor(document) {
    this.document = document;
  }
  initialize() {
    (function(document) {
      function alreadyTested() {
        return Boolean(window.sessionStorage) && Boolean(window.sessionStorage.getItem('webpSupport'));
      }
      // Add 'webp' class to html element if not supported.
      // Add 'no-webp' class to html element if not supported.

      function addWebPClass(support) {
        let el = document.documentElement;

        if (support) {
          if (el.classList) {
            el.classList.add('dcf-webp');
          } else {
            el.className = `${el.className} dcf-webp`;
          }
          window.sessionStorage.setItem('webpSupport', true);
        } else if (el.classList) {
          el.classList.add('dcf-no-webp');
        } else {
          el.className = `${el.className} dcf-no-webp`;
        }
      }

      function testWebP(callback) {
        if (alreadyTested()) {
          addWebPClass(true);
          return;
        }
        let webP = new Image();
        webP.onload = webP.onerror = function callbackFunction() {
          callback(webP.height === DCFUtility.magicNumbers('int2'));
        };
        webP.src = 'data:image/webp;base64,UklGRi4AAABXRUJQVlA4TCEAAAAvAUAAEB8wA' +
          'iMwAgSSNtse/cXjxyCCmrYNWPwmHRH9jwMA';
      }
      testWebP(addWebPClass);
    }(document));
  }
}
