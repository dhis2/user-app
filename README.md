# User-app

[![Build Status](https://travis-ci.org/dhis2/user-app.svg)](https://travis-ci.org/dhis2/user-app)
[![Test Coverage](https://codeclimate.com/github/dhis2/user-app/badges/coverage.svg)](https://codeclimate.com/github/dhis2/user-app/coverage)
[![Code Climate](https://codeclimate.com/github/dhis2/user-app/badges/gpa.svg)](https://codeclimate.com/github/dhis2/user-app)

This repo contains the user app first released in DHIS2 version 2.30.

It was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app), and later ejected.

## Developer guide

### Prerequisites

To use the user-app in development mode, it is necessary to have a running DHIS2 instance, and be logged in to it. This is because the app requests resources, like react and react-dom, from the DHIS2 core resources. Most developers use their local DHIS2 instance. If you haven't configured your DHIS2_HOME env variable and set up a config.json, then the app will default to using localhost:8080 with the admin user (see
[config/webpack.config.dev.js](config/webpack.config.dev.js#L35)).

### Installation

First clone the repo, then:

```
yarn install
yarn start
```

The webpack-dev-server will start up on localhost:3000, by default.

### Running tests

`yarn test or yarn coverage`

### Other useful things to know

#### eslint/prettier

The user-app uses **eslint** for code correctness checking, and **prettier** for formatting, and the build will fail if any of the checks fail. To make life easier, we suggest that you add the eslint and prettier plugins to your editor. But if you prefer, you can run the following before pushing your code:

```
yarn lint
yarn prettify
```

#### d2/d2-ui

The user-app uses the d2 library for communicating with the DHIS2 api. And as much as possible, we use d2-ui components, rather than using material-ui directly. Make sure to upgrade these dependencies regularly, and contribute to them.

### Deploy

#### Local deployment

In order to test the build of the user-app (rather than just the dev server), deploy it to your local dhis2 build. The instructions here assume a good understanding of building DHIS2 locally.

From the root of the user-app, build the user-app locally

```
yarn build
```

Then run the command below to install the built project to the `/repository/org/hisp/dhis/dhis-app-user` folder your .m2 directory:

```
mvn install
```

Navigate to your local dhis2 repo, `/dhis-2/dhis-web` directory. Then run the command below to build a `dhis.war` file under `dhis-web/dhis-web-portal/target`

```
mvn clean install -o
```

Finally, paste the built `dhis.war` file into you Tomcat `/webapps` directory

#### Deploy to production

Every commit to master is automatically deployed. To deploy a build to an older user-app version, e.g., 2.29, a tag needs to be created. Do the following:

```
git checkout 2.29
git pull
yarn version (interactive, will ask you for a new version number, eg. 29.0.22)
git push origin master
git push origin v29.0.22 (pushes the v29.0.22 tag)
```

To deploy a major upgrade, it is necessary to branch the current version, and update the pom.xml on master. Details of this will be provided elsewhere.

## License

The software is open source and released under the [BSD 2-Clause License](https://github.com/dhis2/user-app/blob/master/license).
