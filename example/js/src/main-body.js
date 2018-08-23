let dialog = require('dcf-dialog');
// let lazyload = require('dcf-lazyLoad');
let Notice = require('dcf-notice');
// let test = require('dcf-test');

// Notice.initialize();

const noticeOptions = {
	widget: 'notice',
	'notice-type': 'alert',
	animation: 'true',
	location: 'fixedBottom',
	collapsible: 'true',
	id: 'dynamicNotice1'
};

Notice.create('Spaghetti Monster Lives', 'You know no spaghetti', noticeOptions);