const date = new Date();
const banner = [
	'/**',
	' * @project        <%= pkg.name %>',
	' * @author         <%= pkg.author %>',
	` * @copyright      Copyright (c) ${ date.getFullYear() }, <%= pkg.license %>`,
	' *',
	' */',
	''
].join('\n');

module.exports = banner;