/* global DHIS_CONFIG, manifest */
import React from 'react';
import { render } from 'react-dom';
import UserApp from './UserApp';
import registerServiceWorker from './registerServiceWorker';
import { config, getUserSettings, init } from 'd2/lib/d2';
import i18n from './locales';

/**
 * @module index
 */

/**
 * Sets baseUrl, schemas and sources on the d2 config object and then initializes d2
 * @function
 */
const setupD2 = () => {
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

    return getUserSettings()
        .then(configI18n)
        .then(init);
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
    return config;
};

/**
 * Renders app into root element
 * @function
 */
const renderAppInDOM = d2 => {
    const rootEl = document.getElementById('root');
    render(<UserApp d2={d2} baseUrl={d2.system.systemInfo.contextPath} />, rootEl);
};

setupD2()
    .then(renderAppInDOM)
    .then(registerServiceWorker);
