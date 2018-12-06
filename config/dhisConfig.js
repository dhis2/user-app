const dhisConfigPath = process.env.DHIS2_HOME && `${process.env.DHIS2_HOME}/config`;

let dhisConfig;
try {
    dhisConfig = require(dhisConfigPath);
} catch (e) {
    // Failed to load config file - use default config
    console.warn(`\nWARNING! Failed to load DHIS config:`, e.message);
    dhisConfig = {
        baseUrl: 'http://localhost:8080',
        authorization: 'Basic YWRtaW46ZGlzdHJpY3Q=', // admin:district
    };
}

module.exports = dhisConfig;
