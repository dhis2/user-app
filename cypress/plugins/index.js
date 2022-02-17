const {
    networkShim,
    chromeAllowXSiteCookies,
    cucumberPreprocessor,
} = require('@dhis2/cypress-plugins')

module.exports = (on, config) => {
    networkShim(on)
    chromeAllowXSiteCookies(on)
    cucumberPreprocessor(on, config)
}
