const {
    chromeAllowXSiteCookies,
    cucumberPreprocessor,
    networkShim,
} = require('@dhis2/cypress-plugins')
const { defineConfig } = require('cypress')

async function setupNodeEvents(on, config) {
    await cucumberPreprocessor(on, config)
    networkShim(on)
    chromeAllowXSiteCookies(on)
    return config
}

module.exports = defineConfig({
    video: false,
    projectId: '48zztu',
    experimentalInteractiveRunEvents: true,
    env: {
        dhis2BaseUrl: 'http://localhost:8080',
        dhis2Username: 'admin',
        dhis2Password: 'district',
        dhis2DataTestPrefix: '',
        networkMode: 'live',
        dhis2ApiVersion: '42',
    },
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    e2e: {
        setupNodeEvents,
        baseUrl: 'http://localhost:3000',
        specPattern: 'cypress/e2e/**/*.feature',
        excludeSpecPattern: ['**/*-wip/*.feature'],
    },
})
