// Lazy Load
let LazyLoad = require('dcf-lazyLoad');
const exampleLazyLoad = new LazyLoad();
exampleLazyLoad.initialize();


// Modal
let Modal = require('dcf-modal');
const modals = document.querySelectorAll('.dcf-modal');
const bodyScrollLock = require('body-scroll-lock');
const exampleModal = new Modal(modals, bodyScrollLock);
exampleModal.initialize();


// NEEDS TO BE MOVED TO ITS OWN FILE
// Test for WebP browser support
// Slightly modified https://github.com/djpogo/webp-inline-support

(function (document) {
  'use strict';

  function alreadyTested() {
    return (!!window.sessionStorage && !!window.sessionStorage.getItem('webpSupport'));
  }

  // Test webP images support.
  // @param {Function} callback - Callback function.
  function testWepP(callback) {
    if (alreadyTested()) {
      addWebPClass(true);
      return;
    }
    var webP = new Image();

    webP.onload = webP.onerror = function () {
      callback(webP.height === 2);
    };
    webP.src = 'data:image/webp;base64,UklGRi4AAABXRUJQVlA4TCEAAAAvAUAAEB8wA' + 'iMwAgSSNtse/cXjxyCCmrYNWPwmHRH9jwMA';
  };

  // Add 'dcf-webp' class to html element if supported.
  // Add 'dcf-no-webp' class to html element if not supported.
  // @param {Boolean} support - WebP format support.
  function addWebPClass(support) {
    var el = document.documentElement;

    if (support) {
      if (el.classList) {
        el.classList.add('dcf-webp');
      } else {
        el.className += ' dcf-webp';
      }
      window.sessionStorage.setItem('webpSupport', true);
    } else {
      if (el.classList) {
        el.classList.add('dcf-no-webp');
      } else {
        el.className += ' dcf-no-webp';
      }
    }
  };

  testWepP(addWebPClass);
})(document);



// Notice
// let Notice = require('dcf-notice');
// const noticeOptions = {
// 	widget: 'notice',
// 	'notice-type': 'alert',
// 	animation: 'true',
// 	location: 'fixedBottom',
// 	collapsible: 'true',
// 	id: 'dynamicNotice1'
// };
//
// Notice.create('Spaghetti Monster Lives', 'You know no spaghetti', noticeOptions);
