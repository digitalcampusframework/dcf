# dcf
Digital Campus Framework

## Objective
DCF contains core scripts and styles which are used as 'plumbing' and a foundation to build a theme. It is created to be brand agnostic.
The core scripts and styles help create a more consistent user experience, incorporate the best possible web accessibility accordance, and allow for ease of development across themes, while individual themes built upon it allows for customizations and brand identity.

## Usage

### Directories and Files
TBD

#### Sass Files
TBD

#### JavaScript Files
TBD


## Installing the project

Note: `gulp-scss-lint` (https://www.npmjs.com/package/gulp-scss-lint) requires Ruby and the Ruby Gem `scss_lint`. For consistency, use version `2.6.x` of Ruby.

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