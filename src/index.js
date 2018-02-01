import React from 'react';
import ReactDOM from 'react-dom';
import UserApp from './UserApp';
import registerServiceWorker from './registerServiceWorker';
import { config, getUserSettings, getManifest } from 'd2/lib/d2';

const updateConfig = manifest => {
    // TODO
    // Webpack needs to add a stringified version of DHIS_HOME/config.json
    // to process.env. This is probably not possible until we have ejected.
    // For now we hardcode it
    const dhisDevConfig = {
        baseUrl: 'http://localhost:8080/dhis/api',
        authorization: 'Basic YWRtaW46ZGlzdHJpY3Q=', // admin:district
    };

    const isProd = process.env.NODE_ENV === 'production';
    const baseUrl = isProd ? manifest.getBaseUrl() : dhisDevConfig.baseUrl;

    config.baseUrl = baseUrl;
    config.schemas = ['userRole', 'user', 'userGroup'];
};

const configI18n = userSettings => {
    const uiLocale = userSettings.keyUiLocale;
    const sources = config.i18n.sources;
    if (uiLocale !== 'en') {
        sources.add(`i18n/module/i18n_module_${uiLocale}.properties`);
    }
    sources.add('i18n/module/i18n_module_en.properties');
};

const renderAppInDOM = () => {
    const rootEl = document.getElementById('root');
    ReactDOM.render(<UserApp config={config} />, rootEl);
};

getManifest('manifest.json')
    .then(updateConfig)
    .then(getUserSettings)
    .then(configI18n)
    .then(renderAppInDOM)
    .then(registerServiceWorker);
