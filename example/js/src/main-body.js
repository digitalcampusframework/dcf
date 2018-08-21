var dialog = require('dialog');
// var lazyload = require('lazy-load');
var Notice = require('notice');
// var test = require('test');

Notice.initialize();

var noticeOptions = {
	widget: 'notice',
	'notice-type': 'alert',
	animation: 'true',
	location: 'fixedBottom',
	collapsible: 'true'
};

Notice.create('Spaghetti Monster Lives', 'You know no spaghetti', noticeOptions);