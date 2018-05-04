/* global DHIS_CONFIG, manifest */
import React from 'react';
import ReactDOM from 'react-dom';
import UserApp from './UserApp';
import registerServiceWorker from './registerServiceWorker';
import { config, getUserSettings } from 'd2/lib/d2';
import i18n from './locales';

/**
 * @module index
 */

/**
 * Sets baseUrl and schemas on the d2 config object
 * @function
 */
const updateConfig = () => {
    let baseUrl;
    const isProd = process.env.NODE_ENV === 'production';
    const apiVersion = manifest.dhis2.apiVersion || '29';

    if (!isProd) {
        const fallbackDevConfig = {
            baseUrl: 'http://localhost:8080/dhis/api/',
            authorization: 'Basic YWRtaW46ZGlzdHJpY3Q=', // admin:district
        };
        const dhisDevConfig = DHIS_CONFIG || fallbackDevConfig;
        baseUrl = dhisDevConfig.baseUrl;
    } else {
        baseUrl = manifest.activities.dhis.href;
    }

    config.baseUrl = `${baseUrl}/api/${apiVersion}`;
    config.schemas = [
        'userRole',
        'user',
        'userGroup',
        'userCredentials',
        'organisationUnit',
    ];
};

/**
 * Adds translation sources to the d2 config object for deprecated translation methods used by d2-ui
 * And sets language for new i18n module from "@dhis2/d2-i18n"
 * @param {Object} userSettings - user settings object returned by the d2 getUserSettings promise
 * @function
 */
const configI18n = userSettings => {
    const uiLocale = userSettings.keyUiLocale;
    const sources = config.i18n.sources;
    // Using the old style of translations for the d2-ui components
    if (uiLocale !== 'en') {
        sources.add(`i18n/i18n_module_${uiLocale}.properties`);
    }
    sources.add('i18n/i18n_module_en.properties');
    i18n.changeLanguage(uiLocale);
};

/**
 * Renders app into root element
 * @function
 */
const renderAppInDOM = () => {
    const rootEl = document.getElementById('root');
    ReactDOM.render(<UserApp config={config} />, rootEl);
};

/**
 * Starts the app
 * @function
 */
const init = () => {
    updateConfig();
    getUserSettings()
        .then(configI18n)
        .then(renderAppInDOM)
        .then(registerServiceWorker);
};

init();
