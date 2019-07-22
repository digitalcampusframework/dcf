# dcf
Digital Campus Framework



## Objective
DCF contains core scripts and styles which are used as 'plumbing' and a foundation to build a theme. It is created to be brand agnostic.
The core scripts and styles help create a more consistent user experience, incorporate the best possible web accessibility accordance, and allow for ease of development across themes, while individual themes built upon it allows for customizations and brand identity.

## Usage

### Directories and Files
Developers seeking to use DCF can find assets to work with in the `assets/dist` folder.

#### Sass Files
`/assets/dist/scss/**/*.scss`

There will be no SASS compilation of `.scss` files in DCF Core. SASS files are provided as is. Sass compilation is
done on the theme layer to allow additional theme `.scss` files to be compiled alongside core `.scss` files. This also
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
`/assets/dist/js`

Bearing in mind the different build tools and processes out there, we have decided to provide files with minimal
modifications (e.g. concatenated/minified) to allow users to easily incorporate them into their build environment.

* There will be three folders under `/assets/dist/js`:
    * `vendor`: Contains third-party vendor JS files that are required by DCF, since vendor files do not change frequently, outputting a separate vendor file helps with browser caching.
    * `mustard`: We encourage users to utilize [polyfill.io](https://polyfill.io/v2/docs/) to provide fallbacks for
    older browsers. The mustard folder contains unminified polyfills that are not supported in
    polyfill.io for features that DCF widgets will be using at the users convenience. We also encourage you to
    implement cutting-the-mustard method by feature-testing before bringing in the needed polyfills.
        * [Smarter Polyfilling with Polyfill.io](https://gomakethings.com/smarter-polyfill-loading-with-polyfill-io/)
        * [Connect: behind the front-end experience](https://stripe.com/blog/connect-front-end-experience)
    * `app`: Custom written JS modules that includes common distributed and optional files.
        * `common`: Minified and transpiled, JS modules/widgets that are part of DCF and should be implemented
        * `optional`: Minified and transpiled, Optional JS modules/widgets that can be required when additional
        functionality is wanted.
        * `preBabel` : Unminified. Custom and Optional modules in ES6
        * `postBabel` : Unminified and transpiled. Custom and Optional modules.




#### CSS Files
`/assets/src/css/vendor/**/*.css`

DCF Core uses SASS. The CSS folder is mainly used for vendor associated CSS files which can later be concatenated to
your compiled CSS file and then minified.


## Installing the project

Run `npm install` to install the required node modules.


## Theme implementation

When being implemented in a theme, DCF expects the Modular Scale package to be available and for an number of SASS variables to be defined.

### Modular Scale
Ensure the [modularscale-sass](https://www.npmjs.com/package/modularscale-sass) package is installed at the theme layer. It is necessary for compiling the SASS provided by DCF.

Depending on the SASS compilation tools used, it may be necessary to include the path for modularscale-sass. For example, use `includePaths` for Gulp and for Grunt.

A Gulp example is provided below:
```
.pipe(sass({
  includePaths: [ 'node_modules/modularscale-sass/stylesheets' ]
}))
```

### Theme-defined SASS variables

The theme needs to define a number of variables for DCF:

- Border radius
  - `$roundrect`
- Background colors
  - `$color-body-bg`
- Text colors
  - `$color-body`
  - `$color-heading`
- Links
  - `$color-link`
  - `$color-link-visited`
  - `$color-link-hover`
  - `$color-link-active`
- Inverse
  - `$color-inverse-link`
  - `$color-inverse-link-visited`
  - `$color-inverse-link-hover`
  - `$color-inverse-link-active`
- Buttons
  - `$color-button-hover`
- Borders
  - `$color-border`
- Marks (highlights) background color
  - `$color-mark`
- Badges
  - `$color-badge`
- Captions
  - `$color-caption`
- Tables
  - `$color-table-stripe`

If any of these variables is not available, then SASS compilation will fail.

See `/example/dcf/variables/_variables.borders.scss` and `/example/dcf/variables/_variables.colors.scss` for examples.