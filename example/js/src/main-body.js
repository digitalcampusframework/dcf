let dialog = require('dcf-dialog');
// let lazyload = require('dcf-lazyLoad');
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
console.log(datepicker);
flatpickr(datepicker);
