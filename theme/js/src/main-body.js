// Lazy Load
let LazyLoad = require('dcf-lazyLoad');
const images = document.querySelectorAll('[loading=lazy], .dcf-lazy-load');
const observerConfig = {
	// Extend intersection root margin by 50px to start intersection earlier by 50px
	rootMargin: '0px 0px 50px 0px',
	threshold: [0, 0.40]
};
const enterClassNames = ['dcf-fade-in'];
const exampleLazyLoad = new LazyLoad(images, observerConfig, enterClassNames);
exampleLazyLoad.initialize();


// Modal
let Modal = require('dcf-modal');
const modals = document.querySelectorAll('.dcf-modal');
const bodyScrollLock = require('body-scroll-lock');
const exampleModal = new Modal(modals, bodyScrollLock);
exampleModal.initialize();


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


// Date Picker
// let flatpickr = require('flatpickr/flatpickr');
// require("flatpickr/flatpickr.css");
// let datepicker = document.querySelector('[data-widget*="flatpickr"]');
// flatpickr(datepicker, {
// 	enableTime: true,
// 	dateFormat: "Y-m-d h:iK",
// });
