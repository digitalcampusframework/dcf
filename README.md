# dcf
Digital Campus Framework

## Structure

DCF contains core scripts and styles which are used as 'plumbing' and a foundation to build a theme. The core scripts and styles create a more consistent user experience and ease of development across themes, while each individual theme allows for customizations and brand identity.

* The `/core` directory contains the core scripts and files for DCF.
* The `/theme` directory contains sub-directories for each theme. Individual themes are not bundled with this project, and should instead be placed in the `/theme` directory during development to build it.

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
