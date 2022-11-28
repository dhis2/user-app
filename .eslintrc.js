const { config } = require('@dhis2/cli-style')

module.exports = {
    extends: [config.eslintReact],
    globals: {
        cy: 'readonly',
        Cypress: 'readonly',
    },
    rules: {
        'react/display-name': 'off',
        'react/no-unknown-property': ['error', { ignore: ['jsx'] }],
    },
}
