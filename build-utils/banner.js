const date = new Date();
const banner = [
	'/**',
	' * @project        <%= pkg.name %>',
	' * @author         <%= pkg.author.name %>',
	' * @website        <%= pkg.author.url %>',
	` * @copyright      Copyright (c) ${ date.getFullYear() }, <%= pkg.license %>`,
	' *',
	' */',
	''
].join('\n');

module.exports = banner;