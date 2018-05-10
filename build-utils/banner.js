const moment = require('moment');

const banner = [
	'/**',
	' * @project        <%= pkg.name %>',
	' * @author         <%= pkg.author %>',
	` * @copyright      Copyright (c) ${ moment().format('YYYY') }, <%= pkg.license %>`,
	' *',
	' */',
	''
].join('\n');

module.exports = banner;