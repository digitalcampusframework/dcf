# dcf
Digital Campus Framework



## Objective
DCF contains core scripts and styles which are used as 'plumbing' and a foundation to build a theme. It is created to be brand agnostic.
The core scripts and styles help create a more consistent user experience, incorporate the best possible web accessibility accordance, and allow for ease of development across themes, while individual themes built upon it allows for customizations and brand identity.

DCF core employs 'cutting the mustard' approach: using JS browser feature detection to request CSS and JS fallbacks that most modern evergreen browsers have already taken care of. This is a more user friendly and performant approach to providing fallbacks only when it is needed. 



## Folder Structure 
The DCF core uses Gulp as its build tool for task automation. Build process supports SASS and ES6+ JS syntax.  


### Directories and Files 
Source files are placed in the `assets/src` folder and running the default gulp task will output the 
production-ready files in the `assets/dist` folder. Developers seeking to use DCF should only have to work with 
`assets/dist` folder. 

* The `assets/src` directory contains the core scripts and files for DCF.
* The `assets/build` directory contains temporary files in-between build processes (e.g. transpiled JS files before 
minification).
* The `assets/dist` directory contains production ready scripts and files for DCF.
* The `example` directory contains an example setup of how to use the core styles and JS modules. SASS files are 
compiled to CSS and the JS module files are bundled, transpiled, and minified using Browserify. The end product
can be seen live at [digitalcampus.us](http://www.digitalcampus.us/).  
//TODO: Ask Michael if people can look at the index.shtml without doing the whole symlink process


#### Sass Files
`/assets/src/scss/**/*.scss`

There will be no SASS compilation of `.scss` files in DCF Core. SASS files are provided as is. Sass compilation is done
 on the theme layer to allow additional theme `.scss` files to be compiled alongside core `.scss` files. This also 
 allows theme layer scss 
files to make use of includes and mixins defined in DCF core. There should be three "main/index" scss files in the 
_theme_ layer:
* `main.scss` - brings together all the core and theme layer sass partials for compilation
* `print.scss` - brings together all the core and theme layer print-related partials from the print folder for 
compilation
* `mustard.scss` - brings together partials from the mustard folder for fallback styles that will be used in the 
'cutting the mustard' approach

_Use a SASS glob plugin for your task runner to pull in the partials from DCF core in your entry files. See the example 
folder on how to structure the imports using SASS globs._ 


#### JavaScript Files
`/assets/src/js`

* There are three folders under `/assets/src/js`:
    * `vendor`: Contains third-party vendor JS files that are required by DCF, since vendor files do not change frequently, outputting a separate vendor file helps with browser caching.
    * `mustard`: Contains third-party vendor JS polyfills that will be pulled in if browser doesn't cut the mustard
    * `app`: Custom written JS modules that includes common distributed and optional files. Supports ES6 syntax which 
    will be transpiled by Babel during the build process.
        * `common`: Custom JS modules that are needed by DCF and will be packaged with and distributed with core. 
        * `optional`: Optional custom JS modules that can be required when additional functionality is wanted.

_To add new modules to the build process, after adding the JS files to the correct `src/js/app`  subfolder, add a new
 entry to the UMD wrapper configuration file under `build-utils/umd-tasks-common.js` or 
 `build-utils/umd-tasks-optional.js`._
  
     
      
#### CSS Files
`/assets/src/css/vendor/**/*.css`

DCF Core uses SASS. The CSS folder is mainly used for vendor associated CSS files which can later be concatenated to 
your compiled CSS file and then minified.


## Gulp Tasks & Build Process
DCF Core uses Gulp 4.0. Gulp tasks are specified in the `gulpfile.babel.js`. To modularize commonly used variables and 
functions, they are specified in the `/build-utils` folder and required in the gulpfile as needed. This also help keep the gulpfile easy to scan and dry.


### Build-utils Folder Contents
* `banner.js` - contains copyright/owner info banner template that extracts information out of `package.json` and injected into files 
* `build-names.js` - contains variable names of files outputted into the build folder
* `build-paths.js` - contains path variables of files going that are being outputted into the `/assets/build` folder by Gulp
* `cascade-delete.js` - custom written reusable function to delete similar files in either `/build` or `/dist` when files are being deleted from `/src` when the watch tasks are running
* `check-directory.js` - custom function to check if a directory exists and if not create it, used in outputting eslint error logs
* `common-paths.js` - contains base path variables to be composed from in build-paths.js and dist-paths.js
* `concat.js` - contains object with two Gulp concat task functions, one with and one without gulp-newer
* `css-minify.js` - contains function to minify CSS using CSSO, inserts a banner to the beginning of minified file and shows anticipated gzipped size 
* `custom-plumber.js` - error notification function using gulp-notify
* `dist-names.js` - contains variable names of files outputted into the build folder
* `dist-paths.js` - contains path variables of files going that are being outputted into the `/assets/build` folder by Gulp
* `example-theme-gulp-tasks.js` - contains a bundles array (for generating multiple bundles) and gulp tasks for 
browserify and eslint for example 
theme
* `gulp-load-plugins.js` - contains function to pull in `package.json` plugins using gulp-load-plugins and store it in the `$` variable. Scoped to just devDependencies plugins.
* `sass-compile.js` - contains object with three SASS compile task for screen-related CSS. Print and mustard SASS 
compilation tasks will be added in the future (compilation is for example theme)
*  `uglify.js` - contains function to run gulp-uglify task, preserves comments that starts with @license or 
@preserve, inserts a banner to the beginning of minified file and shows anticipated gzipped size 
* `umd-tasks-common.js` - contains an entry for every JS modules that needs to be UMD wrapped in `src/js/app/common`
* `umd-tasks-optional.js` - contains an entry for every JS modules that needs to be UMD wrapped in `src/js/app/optional`


### Gulp Processing for SCSS, JS, CSS files
 * SASS files - The src `_*.scss` partials are linted and then copied to the `assets/dist/scss` folder. Lint errors will be displayed in the console and also outputed to `/logs/stylelint` 
 * JS files:
    * src vendor JS files are concatenated and uglified and outputted to the `assets/dist/js/vendor` folder with sourcemap.
    * src mustard JS files are concatenated and uglified and outputted to the `assets/dist/js/mustard` folder with sourcemap.
    * src app/common JS files are linted, UMD-wrapped, transpiled, uglified and outputted to the 
    `assets/dist/js/app/common` folder with sourcemap. Lint errors will be displayed in the console and outputted to `/logs/eslint`.
    * src app/optional JS files are linted, UMD-wrapped, transpiled, uglified and outputted to the`assets/dist/js/app/optional` folder. Lint errors will be displayed in the console and outputted to `/logs/eslint`.
* CSS files - The src css files are copied to the `assets/dist/css` folder

    
_JS modules in `/assets/dist/js/app` comes in three different flavors:_
 * _*.babel.js - pre-transpiled & UMD-wrapped_
 * _*.js - transpiled & UMD-wrapped_
 * _*.min.js - transpiled, minified, & UMD-wrapped_
    

## Installing the project

Run `npm install` to install the required node modules.
You are good to go!

## Running Gulp Tasks - Commands
* `gulp` - the default gulp task. The one task to rule them all. Deletes `/build` and `/dist` and runs all the SCSS, JS, CSS related tasks once and enters into watching mode
* `gulp stylelintFix` - stylelint allows _some_ CSS/SCSS styling errors to be fixed automatically. It is not perfect but definitely helps. Run this task manually to have stylelint automatically fix some of the minor styling issues in your SCSS.
* `gulp eslintFix` - eslint allows _some_ JS errors to be fixed automatically. It is not perfect but definitely helps. Does convert JS to ES6 version. Run this task manually to have eslint automatically fix some of the minor styling issues in your JS.

### Troubleshooting Gulp Tasks
* [gulp-debug](https://github.com/sindresorhus/gulp-debug) can be used to view files that are being streamed into a task and the files that are being 
passed 
through your Gulp pipeline. It is already included in the package.json
* For example, to use gulp-debug to see what files are being passed into the task at the beginning and what files are
 let through by gulp-newer, we can do the following:
 
 ```javascript
 gulp.task('copyCSS:newer', (done) => {
  	$.pump([
  		gulp.src(distPaths.cssGlob),
  		customPlumber('Error Running copyCSS'),
  		// add the gulp-debug line below to see what files are passed into gulp-newer
  		$.debug({title: 'All files - [copySass:newer]'}), 
  		$.newer(distPaths.cssDest),
  		// add the gulp-debug line below to see what files are processed and let through by gulp-newer
  		$.debug({title: 'Passed Through - [copySass:newer]'}), 
  		gulp.dest(distPaths.cssDest)
  	], done);
  });
  ```  
* [gulp-cached](https://github.com/gulp-community/gulp-cached) to debug if something is being stored inside gulp-cached add `console.log($.cached.caches);`
    * Cache key = file.path + file.contents
    * Gulp-cached doesn't persist between new processes. It's an in-memory object that goes away when the process dies
    . To check gulp-cached properly using the console.log it needs to be runned in a watch process

 
 ```javascript
gulp.task('babel', (done) => {
	$.fancyLog('----> //** Transpiling ES6 via Babel... 🍕');
	console.log($.cached.caches);
	$.pump([
		gulp.src(buildPaths.babelAppGlob),
		customPlumber('Error Running Babel'),
		$.cached('babel'),
		console.log($.cached.caches); 
		$.babel({presets: [ 'env' ]}),
		gulp.dest(buildPaths.appJsDestPostBabel)
	], done);
});
  ```  

## Known issues
* Some of the gulp tasks uses gulp-newer that compares against target files to see if a task needs to be performed (helps avoid performance issues when watching). On watching, when files are deleted from src folders, files such as vendor.concat.js in the build folder will be re-concatenated and then re-uglified (expected behavior). However if you add a file that is older than the gulp-newer targeted file, the associated task will not run. To overcome this, just do something (add a space and save) in that file so that it has a newer modified date than the gulp-newer targeted file.
    * Example: Current state: gulp-newer observing file b.js in build folder but no b.js in src folder. While gulp is 
    watching, file with the same filename b.js was just added in src folder but has an older modified date than what 
    gulp-newer is looking at in the build folder, then the associated gulp task will not run.   
* when using gulp-sass-glob, this plugin cannot perform nested glob imports 
    * Example: If entry file uses a sass import glob that pulls in a sass partial that also has an import glob, it will 
    throw an error.


---