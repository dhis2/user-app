module.exports = {
    setupFilesAfterEnv: ['<rootDir>/src/test-utils/setup-tests.js'],
    transformIgnorePatterns: ['/node_modules/(?!(lodash-es)/)'],
}
