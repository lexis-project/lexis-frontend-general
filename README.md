# lexis-frontend-general

<a href="https://doi.org/10.5281/zenodo.6080535"><img src="https://zenodo.org/badge/DOI/10.5281/zenodo.6080535.svg" alt="DOI"></a>

This repository contains Lexis portal GUI components for managing workflows, datasets, users and organizations.

## Acknowledgement
This code repository is a result / contains results of the LEXIS project. The project has received funding from the European Union’s Horizon 2020 Research and Innovation programme (2014-2020) under grant agreement No. 825532.

## Getting the components to run

Start by reading lexis-client/README.md to get everything running.

1. Make sure node is installed (using nvm ideally, see https://nodesource.com/blog/installing-node-js-tutorial-using-nvm-on-mac-os-x-and-ubuntu/ for details). Node version 14 is recommended.
2. Ensure your version of npm is recent enough. npm v3.5.2 (Ubuntu 18.04.4 LTS) will not work. npm 6.10.3, 6.14.5 and 6.14.11 are known to work.
3. If you need fake backend then go to `lexis-be` and run there:
```
npm install
npm run start
```

4. go to lexis client:

```
cd lexis-client
npm install

```

5. Rename src/config/config.default.json to default.json and change configuration as you want

6. Start development server

```
npm run start

```

## Issues on npm run build

If you get 
```ENOENT: no such file or directory, scandir '**/node_modules/node-sass/vendor'```
run
```
nodejs node_modules/node-sass/scripts/install.js
npm rebuild node-sass
```
and try again

## Cypress tests:

See cypress.md in this directory.
