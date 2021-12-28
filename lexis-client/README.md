```
 _               _            _ _            _
| |             (_)          | (_)          | |
| |     _____  ___ ___    ___| |_  ___ _ __ | |_
| |    / _ \ \/ / / __|  / __| | |/ _ \ '_ \| __|
| |___|  __/>  <| \__ \ | (__| | |  __/ | | | |_
\_____/\___/_/\_\_|___/  \___|_|_|\___|_| |_|\__|
```

## Content

---

<ul type="none">
<li>- <a href="#about-technology">About Technology</a></li>
<li>- <a href="#structure">Structure</a></li>
  <ul type="none">
  <li><code>/cypress</code> - <a href="#cypress"><a href="#cypress"> End-to-end tests</a></a></li>
  <li><code>/public</code> - <a href="#public">Static files and index.html</a></li>
  <li><code>/src</code> - Application files</li>
    <ul type="none">
    <li><code>./__tests__</code> - <a href="#cypress">Files with tests for cypress</a></li>
    <li><code>./config</code> - <a href="#configuration-files">Configuration files</a></li>
    <li><code>./modules</code> - <a href="#modules">Modules</a></li>
        <ul type="none">
            <li><code>./api</code> - <a href="#api">Api</a></li>
            <li><code>./auth</code> - <a href="#auth">Auth</a></li>
            <li><code>./data-sets</code> - <a href="#data-sets">Data Sets</a></li>
            <li><code>./entity-repository</code> - <a href="#entity-repository">Entity Repository</a></li>
            <li><code>./forms</code> - <a href="#forms">Forms</a></li>
            <li><code>./organizations</code> - <a href="#organizations">Organizations</a></li>
            <li><code>./projects</code> - <a href="#projects">Projects</a> + <a href="#projects-ui-files-with-resources-usage-and-billing-costs">Projects' resources and billing</a></li>
            <li><code>./root</code> - <a href="#root">Root</a></li>
            <li><code>./routing</code> - <a href="#routing">Routing</a></li>
            <li><code>./user</code> - <a href="#user">User</a></li>
            <li><code>./users</code> - <a href="#users">Users</a></li>
        </ul>
        <li><code>./</code> - <a href="#initialization-files">Initialization Files</a></li>
    </ul>
  </ul>
</ul>

---

---

# About Technology

The Lexis client is based on JavaScript framework [React](https://reactjs.org/). It connects libraries, which we could find in `package.json`. The most important ones are [Redux](https://redux.js.org), [redux-saga](https://redux-saga.js.org), [reduxsauce](https://github.com/jkeam/reduxsauce), [reselect](https://github.com/reduxjs/reselect) and [router5](https://router5.js.org/).

## Best practice

We try to use following best practice:

<ul>
  <li>Immutability.</li>
  <li>Stateless functions.</li>
  <li>UI and state decomposion (data down actions up)</li>
</ul>

## React

[Main JS library](https://reactjs.org/).

<ul>
  <li>It's a mainstream.</li>
  <li>Simple small JS library.</li>
  <li>Virtual DOM.</li>
  <li>State and </li>
</ul>

This is really good book about react+redux basics: https://www.amazon.com/Learning-React-Functional-Development-Redux/dp/1491954620

## Redux

[State management](https://redux.js.org)

<ul>
  <li>All application state at one place.</li>
  <li>Event sourcing (actions, store, reducers).</li>
</ul>

## Redux sauce

[Redux code improvement](https://github.com/jkeam/reduxsauce)

<ul>
  <li>Improve redux code organization.</li>
  <li>Simplify redux code complexity.</li>
</ul>

Nice presentation: https://blog.smartlogic.io/redux-design-patterns-reduxsauce/

## Redux saga

[redux-saga](https://redux-saga.js.org)

Based on [generators](https://github.com/gajus/gajus.com-blog/blob/master/posts/the-definitive-guide-to-the-javascript-generators/index.md). The generator function is expected to utilize yield keyword. yield suspends execution of a generator and returns control to the iterator.

## Reselect

[Redux store selection improvement](https://github.com/reduxjs/reselect)

## Router5

[Router5](https://router5.js.org) is part of a new generation of routers: instead of rendering "views" or "pages", router5 outputs its state. The main idea behind router5 is to treat routing state like any other application data or state.

# Public

In `public` folder we can find `index.html`. Thats the first file which the browser receives, when somebody opens Lexis FE. In this file is loaded our JS app from `./src/index.js`. In `src` folder are all application files and the [initialization files](#initialization-files).

# Structure

The application structure is divided into two folders `src` and `public`. In `public` folder we can find `index.html`. Thats the first file which browser achieve, when somebody opens Lexis FE. In this file is loaded our JS app from `./src/index.js`. In `src` folder are all application files and the [initialization files](#initialization-files).

# Cypress

We use [cypress](https://www.cypress.io/) library for tests. It is easy to use and it provides unit testing and end-to-end testing. Open it with `npm run cypress`. Tests are saved in folder `cypress/integration`.

---

## Configuration files

The configuration files are situated in `src/config/`. It is required to create your own `default.json` before launching the application. `default.json` file look like this:

```
{
  "url": {
    "base": "http://localhost:3000",
    "api": "http://localhost:3001",
    "auth": "http://localhost:3001"
  },
  "portalActions": {
    "login": "/login"
  }
}
```

In the variable `url -> base` is defined FE URL, where is FE served. In the `url -> portal` is defined Portal URL, which are used for communication with BE.

`PortalActions` defines login endpoint, where FE forwards users for login flow.

For better edibility in the application is `default.json` exported in `src/config.js`.

### Version info

Version info is mentioned in package.json file. The application automatically reads the version parameter.

---

## Modules

Every module usually consist of redux parts, which are `saga`, `actions`, `reducer` and `selectors`. They have also `ui` folder with UI parts of module. CSS files are in folder `style`.

#### Saga

`*-saga.js`

The saga commonly takes an action and assynchronously does side effects. For example it could take a button event and run a function with a request to BE for some data. When a response comes it could pass the data to redux-store or somewhere else, while the app still running.

#### Actions

`*-actions.js`

The actions are used for events changing the store or catching a user interaction. [Read more...](https://redux.js.org/basics/actions)

#### Reducer

`*-reducer.js`

In the reducer is defined part of redux store, which is module working with. The events interacting with this part of store are handled here. [Read more...](https://github.com/jkeam/reduxsauce)

#### Selectors

`*-selectors.js`

In this file are links following on data in redux store.

---

### Api

`src/modules/api/`

The api module are special module for communication between FE and BE. It contains common files except the folder `exceptions` and files `client.js` and `schema.js`.

#### `exceptions`

In folder `exceptions` are defined type of error, which are handled in the application.

#### `client.js`

This file contains definition of [axios](https://github.com/axios/axios) adapter and all api requests.

#### `schema.js`

It normalizes response before saving to redux store. [Read more...](https://github.com/paularmstrong/normalizr)

---

### Auth

`src/modules/auth/`

The auth module are special module handling authentication. It contains common files except files `authClient.js` and `auth-credentials.js`.

#### `authClient.js`

This file contains definition of [axios](https://github.com/axios/axios) adapter and handle authentification requests.

#### `auth-credentials.js`

It is parsing authentication token from the localStorage of browser.

#### UI Files

`user-profile-header.js`

It shows info about logged user and logout button. In the other case it shows login button.

---

### Data Sets

`src/modules/data-sets/`

The `data-sets` module is common module with ordinary files. It handles data sets and it allows user to view them.

#### UI Files

`data-sets-detail.js`

It contains UI of page with data set detail.

`data-sets-list.js`

It contains UI of page for listing all data sets.

---

### Entity Repository

`src/modules/entity-repository/`

Entity repository handles data, which comes from BE. This module works just with redux store.

---

### Forms

`src/modules/forms/`

This module contains pattern for displaying forms UI in other modules like in [organization-form](./src/modules/organizations/ui/organization-form.js).

---

### Organizations

`src/modules/organizations/`

The organisations module is common module with ordinary files. This module handles creating organizations, editing, listing and removing them.

#### `form-validation.js`

This file checks entered characters in forms.

#### UI Files

`organization-create.js`

It is a page with form for creating organization.

`organization.js`

It is a "dummy" component used only for routing user either to component for creating organization and assigning him/her to it, or to component with organization details.

`organization-detail.js`

It is a page with organization details.

`organization-edit.js`

It is a page with form for editing organization.

`organization-form.js`

It is a layout of form for editing and creating organization.

---

### Projects

`src/modules/projects/`

The projects module is common module with ordinary files. This module handles creating LEXIS projects, listing and editing them.

#### `projects-form-validation.js`

This file checks entered inputs in project form creation/edit.

#### Project's UI Files

`project-create.js`

It is a page with form for creating project.

`project-edit.js`

It is a page with form for editing project.

`project-form.js`

It is a layout of form for editing and creating project.

`project-users-management.js`

It's a page with a table listing users assigned to the given project.

`project-users-manager-add-form.js`

In project users management page there's button leading to this form where users can be assigned to project.

`project-detail.js`

It is a page with project details.

`projects-list.js`

A page listing all available projects.

#### Project's UI files with resources usage and billing costs

`/project-detail-piechart`

In this subfolder there are files rendering pie chart (at project detail page) with spent vs. available core hours.

`project-usage.js`

This is a page listing tables with each HPC project (which are part of particular LEXIS project) - its resources names and ids, billing costs and usages.

---

### Root

Root module is root module of everything.

`root-saga.js` combines all sagas of each module.

`root-reducer.js` combines all reducers of each module.

`root-selectors.js` export selectors to parts of central store of each module.

#### UI Files

`about-page.js`

This page is displayed when user come to Lexis FE.

`main-menu.js`

It contains main menu _( left side menu )_ layout.

`root-component.js`

It handles page displaying. Router5 checks which URL is entered and display demanded page with content.

`root-template.js`

It is wrapping page content with menu panels and loader wrapper.

---

### Routing

`src/modules/routing/`

Routing module is special module for handling url with library [router5](https://router5.js.org/).

#### `build-router.js`

This defines setting of router5 middleware and setting up router5 plugins for listening URL changes.

#### `on-route-enter.js`

Function in this file is checking events in URL and passing them to redux store.

#### `routes.js`

It specifies routes and parameters of the application.

---

### User

`src/modules/user/`

The user module is common module with ordinary files. This module handles editing user profile and displaying them.

#### `form-validation.js`

This file checks entered characters in forms.

#### UI Files

`user-page.js`

It is a page with user profile details.

`user-edit.js`

It is a page with form for editing user profile.

`user-form.js`

It is a layout of form for editing user profile.

---

### Users

`src/modules/users/`

The organisations module is common module with ordinary files. This module handles creating users, editing, listing and removing them.

#### `form-validation.js`

This file checks entered characters in forms.

#### UI Files

`user-create.js`

It is a page with form for creating user.

`user-detail.js`

It is a page with user details.

`user-edit.js`

It is a page with form for editing user.

`user-form.js`

It is a layout of form for editing and creating user.

`user-list.js`

It is a page with list of users.

---

## Initialization Files

The core of the application is builded in `src/index.js`. There are content of FE wrapped by `RouterProvider`, which control actions of `router5`. In `RouterProvider` is `Provider`, which provide redux store _(central store of application)_. The `ToastContainer` control pop up windows with errors, warnings and other alerts.

### Redux store

The Redux store is defined in `src/build-store.js`. It applies all middlewares _(part of application which control assynchronously events after user interaction)_ and reducers _(parts of central store separated for modules of appllication)_ there and it creates the store.

### Setup Proxy

File `src/setupProxy.js` contains setup of proxy for local development environment. If does it exist, the React use the file automatically. We need to use the proxy, because the React development server forward all URLs requests to `index.js` and aftewards to `router5` _(which control it)_ as default. But we dont want it, because we need to use an endpoints for communication with Portal.

### Styles

- `index.css` contains default CSS style of application.
- [icons](https://www.creative-tim.com/learning-lab/material-ui/icons/argon-dashboard)

### Browsers support

List of supported browsers can be found in `package.json` in section `browserslist`. Can be modified. Recommended [tool](https://browserslist.dev/) for veryfying queries.

# How to make it running locally

Be aware that this front-end will on initialization and on login redirect the user to /auth/*, which is served by
the code at
https://code.it4i.cz/lexis/wp8/go-revel-test


1. Make sure node is installed (using nvm ideally).
2. If you need fake backend then go to `lexis-be` and run there:

```
npm install
npm run start
```

3. go to lexis client:

```
cd lexis-client
npm install

```

4. Rename src/config/config.default.json to default.json and change configuration as you want

5. Go to src/includes/ and run there

```
git clone https://github.com/lexis-project/jszip
```

6. Start development server

```
npm run start
```

# Code style
Code style is important in case of sustainability and readability of code. We are usinf ESLint for linting not corresponding part of code. For list all code style violating issues run 
`npm run lint:warn` after installing all necessary packages by command `npm install`. For listing just error issues execute `npm run lint`.

# How to connect to testing portal

1. Run the proxy

```
ssh -D 8081 youraccountname@keycloak.lrz.lexis-project.eu
```

If you don't have access to the keycloak service then contact Fred Donnat (fdo@outpost24.com) or Rubén García (garcia@lrz.de).

2. Configure proxy in you system

```
- manual proxy
- socks host: localhost
- socks port: 8081
```

3. Go to portal URL

https://portal.dev.lrz.lexis-project.eu:8443/

# How to run an alternative service behind apache2

You will need a reverse proxy for the service, and in addition, one for websockets. Use e.g. this guide: https://gist.github.com/mortenege/91ec6fe02dca6f736303a00f8cea2731
