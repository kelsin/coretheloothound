/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'coretheloothound',
    environment: environment,
    baseURL: '/',
    locationType: 'hash',

    contentSecurityPolicy: {
      'connect-src': "'self' https://staging.byfirebepurged.com https://api.byfirebepurged.com ws://localhost:35729 ws://0.0.0.0:35729",
      'img-src': "'self' https://render-api-us.worldofwarcraft.com https://us.battle.net",
      'style-src': "'self' 'unsafe-inline'"
    },

    EmberENV: {
      EXTEND_PROTOTYPES: {
        Date: false,
        String: true,
        Array: true,
        Function: true
      },
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    },

    maxLevel: 110
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    ENV.APP.LOG_TRANSITIONS = true;
    ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    ENV.APP.LOG_VIEW_LOOKUPS = true;
    ENV.api = 'https://staging.byfirebepurged.com';
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.baseURL = '/';
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  if (environment === 'production') {
    ENV.api = 'https://api.byfirebepurged.com';
  }

  return ENV;
};
