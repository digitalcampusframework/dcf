var count = 0;

$(document).ready(function() {
	window.setInterval(function() {
		log('testing javascript: ' + count);
		count += 1;
	}, 4000);
});