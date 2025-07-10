# DCF

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

TBD

## Theme implementation

TDB

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
