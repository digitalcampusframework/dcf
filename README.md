# dcf
Digital Campus Framework

## Objective
DCF contains core scripts and styles which are used as 'plumbing' and a foundation to build a theme. The core scripts and styles create a more consistent user experience and ease of development across themes, while each individual theme allows for customizations and brand identity.

## Structure
DCF uses Gulp to build out its production files.  

// TODO talk about folder structure, decisions made about scss compilation, mustard and such 
placed in the `assets/src` folder and outputs the production-ready files in the `assets/dist` folder

* The `/assets` directory contains the core scripts and files for DCF.
* There are three folders under `/assets/js` for the following JS files:
    * `vendor`: Contains third-party vendor JS files that are required by DCF
    * `mustard`: Contains third-party vendor polyfills that will be pulled in if browser doesn't cut the mustard
    * `app`: Custom written JS that includes common distributed and optional files 
    

### required theme directories and files

* The `/theme/name/css` directory is where generated css will be placed.
* The `/theme/name/js` directory is where generated js will be placed.

## Installing the project

Run `npm install` to install the required node modules.

You are good to go!

## Building a theme

Run the following command to build the development files:

```
npm run dev -- --env.theme your_theme_name
```

for example: `npm run dev -- --env.theme example` will build the example theme that lives in `/theme/example`.

Run the following command to build the production files:
```
npm run dev -- --env.theme your_theme_name
```

## Adding JS Files to your Theme

Webpack has entry points for head and body js. After writing your JS (or during), add a require statement for it in the
appropriate `/theme/theme_name/js/loaders/` file. 