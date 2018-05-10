# dcf
Digital Campus Framework

## Objective
DCF contains core scripts and styles which are used as 'plumbing' and a foundation to build a theme. The core scripts and styles create a more consistent user experience and ease of development across themes, while each individual theme allows for customizations and brand identity.

## Structure


// TODO talk about folder structure, decisions made about scss compilation, mustard and such 
placed in the `assets/src` folder and outputs the production-ready files in the `assets/dist` folder

* The `/assets` directory contains the core scripts and files for DCF.
* There are three folders under `/assets/js` for the following JS files:
    * `vendor`: Contains third-party vendor JS files that are required by DCF
    * `mustard`: Contains third-party vendor polyfills that will be pulled in if browser doesn't cut the mustard
    * `app`: Custom written JS that includes common distributed and optional files 
    
DCF uses Gulp to build out its production files.  


## Installing the project

Run `npm install` to install the required node modules.

You are good to go!

// TODO Create a separate readme for documenting the gulp build process