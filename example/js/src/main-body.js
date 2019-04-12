let dialog = require('dcf-dialog');
let LazyLoad = require('dcf-lazyLoad');
let Notice = require('dcf-notice');

let flatpickr = require('flatpickr/flatpickr');
require("flatpickr/flatpickr.css");


const noticeOptions = {
	widget: 'notice',
	'notice-type': 'alert',
	animation: 'true',
	location: 'fixedBottom',
	collapsible: 'true',
	id: 'dynamicNotice1'
};

Notice.create('Spaghetti Monster Lives', 'You know no spaghetti', noticeOptions);


let datepicker = document.querySelector('[data-widget*="flatpickr"]');
flatpickr(datepicker, {
	enableTime: true,
	dateFormat: "Y-m-d h:iK",
});

const images = document.querySelectorAll('.dcf-lazy-img:not(.dcf-lazy-img-loaded)');
const observerConfig = {
	// If the image gets within 50px in the Y axis, start the download.
//   rootMargin: '0px 0px 50px 0px',
	rootMargin: '0px 0px 50px 0px',
//   threshold: 0.01
  threshold: [0, 0.25],
};
const enterClassNames = ['dcf-fade-in'];
const exampleLazyLoad = new LazyLoad(images, observerConfig, enterClassNames);
exampleLazyLoad.initialize();
