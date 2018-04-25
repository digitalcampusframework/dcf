// create log function
var log = function (data) {
    if ("console" in window && "log" in console) {
        console.log(data);
    }
};

// load jquery
var $ = require('../vendor/jquery.js');
