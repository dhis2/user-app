/* global DHIS_CONFIG, manifest */
import React from 'react';
import ReactDOM from 'react-dom';
import UserApp from './UserApp';
import registerServiceWorker from './registerServiceWorker';
import { config, getUserSettings } from 'd2/lib/d2';
import i18n from '@dhis2/d2-i18n'; './locales';

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

const renderAppInDOM = () => {
    const rootEl = document.getElementById('root');
    ReactDOM.render(<UserApp config={config} />, rootEl);
};

const init = () => {
    updateConfig();
    getUserSettings()
        .then(configI18n)
        .then(renderAppInDOM)
        .then(registerServiceWorker);
};

init();
