import React from 'react'
import { render } from 'react-dom'
import App from './App'
import * as serviceWorker from './serviceWorker'
import { config, getUserSettings, init } from 'd2/lib/d2'
import i18n from './locales'

const { REACT_APP_DHIS2_BASE_URL } = process.env

/**
 * @module index
 */

/**
 * Sets baseUrl, schemas and sources on the d2 config object and then initializes d2
 * @function
 */

const setupD2 = () => {
    const baseUrl = `${REACT_APP_DHIS2_BASE_URL}/api/`
    const initConfig = {
        baseUrl,
        schemas: [
            'userRole',
            'user',
            'userGroup',
            'userCredentials',
            'organisationUnit',
        ],
    }
    config.baseUrl = baseUrl

    return getUserSettings()
        .then(configI18n)
        .then(({ i18n }) => init({ ...initConfig, i18n }))
}

/**
 * Adds translation sources to the d2 config object for deprecated translation methods used by d2-ui
 * And sets language for new i18n module from "@dhis2/d2-i18n"
 * @param {Object} userSettings - user settings object returned by the d2 getUserSettings promise
 * @function
 */

const configI18n = userSettings => {
    const uiLocale = userSettings.keyUiLocale
    const sources = config.i18n.sources
    // Using the old style of translations for the d2-ui components
    if (uiLocale !== 'en') {
        sources.add(`i18n/i18n_module_${uiLocale}.properties`)
    }
    sources.add('i18n/i18n_module_en.properties')
    i18n.changeLanguage(uiLocale)
    return config
}

/**
 * Renders app into root element
 * @function
 */
const renderAppInDOM = d2 => {
    const rootEl = document.getElementById('root')
    render(<App d2={d2} />, rootEl)
}

setupD2().then(renderAppInDOM)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA

serviceWorker.register()
