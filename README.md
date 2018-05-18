# dcf
Digital Campus Framework



## Objective
DCF contains core scripts and styles which are used as 'plumbing' and a foundation to build a theme. It is created to be brand agnostic.
The core scripts and styles help create a more consistent user experience, incorporate the best possible web accessibility affordances, and allow for ease of development across themes, while individual themes built upon it allows for customizations and brand identity.



## Folder Structure 
The DCF core uses Gulp as its build tool for task automation, supoorts SASS and ES6 JS syntax. DCF core also employs 'cutting the mustard' approach to using JS browser feature detection to request for fallbacks that most modern evergreen browsers have already taken care of. This is a more user friendly and performant approach to providing fallbacks only when it is needed. 
// TODO talk about folder structure, decisions made about scss compilation, mustard and such 


### Directories and Files 
Source files should be placed in the `assets/src` folder and running the default gulp task will output the production-ready files in the `assets/dist` folder. Developers should only have to work with `assets/src` and `assets/dist` folder. 

* The `assets/src` directory contains the core scripts and files for DCF.
* The `assets/build` directory contains temporary files between build processes (e.g. concatenated JS files before minification).
* The `assets/dist` directory contains production ready scripts and files for DCF.


#### Sass Files
`/assets/src/scss/**/*.scss`

There will be no SCSS compilation `.scss` files in DCF Core. Sass file compilations is done on the theme layer to allow additional theme `.scss` files to be compiled alongside core `.scss` files. This also allows theme layer scss files to make use of includes and mixins defined in DCF core. There should be two "main/index" scss files in the _theme_ layer:
* `main.scss` - brings together all the core and theme layer sass partials for compilation
* `mustard.scss` - brings together partials for fallback styles that will be used in the 'cutting the mustard' approach 


#### JavaScript Files
`/assets/src/js`

* There are three folders under `/assets/src/js`:
    * `vendor`: Contains third-party vendor JS files that are required by DCF, since vendor files do not change frequently, outputting a separate vendor file helps with browser caching.
    * `mustard`: Contains third-party vendor JS polyfills that will be pulled in if browser doesn't cut the mustard
    * `app`: Custom written JS that includes common distributed and optional files. Supports ES6 syntax which will be transpiled by Babel during the build process.
      *`common`: Custom written JS that is needed by DCF and will be packaged with and distributed with core
      *`optional`: Optional custom written JS modules that can be required when additional functionality is wanted.
      
      
#### CSS Files
`/assets/src/css/vendor/**/*.css`

DCF Core uses SASS. The CSS folder is mainly used for vendor associated CSS files 




## Gulp Tasks & Build Process
DCF Core uses Gulp 4.0. Gulp tasks are specified in the `gulpfile.js`. To modularize commonly used variables and functions, they are specified in the `/build-utils` folder and required in the gulpfile as needed. This also help keep the gulpfile easy to scan and dry.


### Build-utils Folder Contents
* `banner.js` - contains copyright/owner info banner template that extracts information out of `package.json` and injected into files 
* `build-names.js` - contains variable names of files outputted into the build folder
* `build-paths.js` - contains path variables of files going that are being outputted into the `/assets/build` folder by Gulp
* `cascade-delete.js` - custom written reusable function to delete similar files in either `/build` or `/dist` when files are being deleted from `/src` when the watch tasks are running
* `check-directory.js` - custom function to check if a directory exists and if not create it, used in outputting eslint error logs
* `common-paths.js` - contains base path variables to be composed from in build-paths.js and dist-paths.js
* `concat.js` - contains object with two Gulp concat task functions, one with and one without gulp-newer
* `custom-plumber.js` - error notification function using gulp-notify
* `dist-names.js` - contains variable names of files outputted into the build folder
* `dist-paths.js` - contains path variables of files going that are being outputted into the `/assets/build` folder by Gulp
* `gulp-load-plugins.js` - contains function to pull in `package.json` plugins using gulp-load-plugins and store it in the `$` variable. Scoped to just devDependencies plugins.
*  `uglify.js` - contains function to run gulp-uglify task, preserves comments that starts with @license or @preserve, also shows anticipated gzipped size 


### Gulp Processing for SCSS, JS, CSS files
 * SASS files - The src `_*.scss` partials are linted and then copied to the `assets/dist/scss` folder. Lint errors will be displayed in the console and also outputed to `/logs/stylelint` 
 * JS files:
    * src vendor JS files are concatenated and uglified and outputted to the `assets/dist/js/vendor` folder with sourcemap.
    * src mustard JS files are concatenated and uglified and outputted to the `assets/dist/js/mustard` folder with sourcemap.
    * src app/common JS files are linted, transpiled, concatenated and uglified and outputted to the `assets/dist/js/app/common` folder with sourcemap. Lint errors will be displayed in the console and outputted to `/logs/eslint`.
    * src app/optional JS files are linted and copied to `assets/dist/js/app/optional` folder. Lint errors will be displayed in the console and outputted to `/logs/eslint`.
* CSS files - The src css files are copied to the `assets/dist/css` folder
    
    

## Installing the project

Run `npm install` to install the required node modules.
You are good to go!

## Running Gulp Tasks - Commands
* `gulp` - the default gulp task. The one task to rule them all. Deletes `/build` and `/dist` and runs all the SCSS, JS, CSS related tasks once and enters into watching mode
* `gulp stylelintFix` - stylelint allows _some_ CSS/SCSS styling errors to be fixed automatically. It is not perfect but definitely helps. Run this task manually to have stylelint automatically fix some of the minor styling issues in your SCSS.
* `gulp eslintFix` - eslint allows _some_ JS errors to be fixed automatically. It is not perfect but definitely helps. Does convert JS to ES6 version. Run this task manually to have eslint automatically fix some of the minor styling issues in your JS.

## Known issues
* Some of the gulp tasks uses gulp-newer that compares against target files to see if a task needs to be performed (helps avoid performance issues when watching). On watching, when files are deleted from src folders, files such as vendor.concat.js in the build folder will be re-concatenated and then re-uglified (expected behavior). However if you add a file that is older than the gulp-newer targeted file, the associated task will not run. To overcome this, just do something (add a space and save) in that file so that it has a newer modified date than the gulp-newer targeted file.
    * Example: gulp-newer observing file b.js in build folder but no b.js in src folder. While gulp is watching, file with the same filename b.js was just added in src folder but has an older modified date than what gulp-newer is looking at, then the associated gulp task will not run.   


---