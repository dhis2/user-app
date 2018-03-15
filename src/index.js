import React from 'react';
import ReactDOM from 'react-dom';
import UserApp from './UserApp';
import registerServiceWorker from './registerServiceWorker';
import { config, getUserSettings, getManifest } from 'd2/lib/d2';
import i18next from 'i18next';
import Backend from 'i18next-xhr-backend';

const API_VERSION = '29';

const updateConfig = manifest => {
    // TODO
    // Webpack needs to add a stringified version of DHIS_HOME/config.json
    // to process.env. This is probably not possible until we have ejected.
    // For now we hardcode it
    const dhisDevConfig = {
        baseUrl: 'http://localhost:8080/dhis/api/',
        authorization: 'Basic YWRtaW46ZGlzdHJpY3Q=', // admin:district
    };

    const isProd = process.env.NODE_ENV === 'production';
    const baseUrl = isProd
        ? manifest.getBaseUrl() + API_VERSION
        : dhisDevConfig.baseUrl + API_VERSION;

    config.baseUrl = baseUrl;
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
        sources.add(`i18n/module/i18n_module_${uiLocale}.properties`);
    }
    sources.add('i18n/module/i18n_module_en.properties');

    // But for direct translations use i18Next
    i18next.use(Backend).init(
        {
            returnEmptyString: false,
            fallbackLng: false,
            keySeparator: '|',
            backend: {
                loadPath: '/public/i18n/{{lng}}.json',
            },
        },
        function(err, t) {
            if (uiLocale && uiLocale !== 'en') {
                i18next.changeLanguage(uiLocale);
            }
        }
    );
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
