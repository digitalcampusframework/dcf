let dialog = require('dialog');
// let lazyload = require('lazy-load');
let Notice = require('notice');
// let test = require('test');

Notice.initialize();

const noticeOptions = {
	widget: 'notice',
	'notice-type': 'alert',
	animation: 'true',
	location: 'fixedBottom',
	collapsible: 'true'
};

Notice.create('Spaghetti Monster Lives', 'You know no spaghetti', noticeOptions);