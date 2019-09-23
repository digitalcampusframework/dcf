// Load all plugins in "devDependencies" into the variable $
const $ = require('gulp-load-plugins')({
  pattern: [ '*', '!stylelint' ],  // Don't process stylelint as it will conflict with gulp-stylint when trying to create dependencies, require it in gulpfile instead
  lazy: true,
  scope: [ 'devDependencies' ]
});

module.exports = $;
