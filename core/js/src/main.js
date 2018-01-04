// create log function
log = function (data) {
	if ("console" in window && "log" in console) {
		console.log(data);
	}
}

// load jquery
$ = require('../vendor/jquery.js');
