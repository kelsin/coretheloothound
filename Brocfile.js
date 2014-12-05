/* global require, module */

var EmberApp = require('ember-cli/lib/broccoli/ember-app');

var app = new EmberApp();

// Modernizr
app.import('vendor/modernizr.js');

// Bootstrap
app.import('bower_components/bootstrap/dist/js/bootstrap.min.js');
app.import('bower_components/bootstrap/dist/fonts/glyphicons-halflings-regular.eot', { destDir: 'fonts' });
app.import('bower_components/bootstrap/dist/fonts/glyphicons-halflings-regular.svg', { destDir: 'fonts' });
app.import('bower_components/bootstrap/dist/fonts/glyphicons-halflings-regular.ttf', { destDir: 'fonts' });
app.import('bower_components/bootstrap/dist/fonts/glyphicons-halflings-regular.woff', { destDir: 'fonts' });

// Font-awesome
app.import('bower_components/font-awesome/fonts/fontawesome-webfont.eot', { destDir: 'fonts' });
app.import('bower_components/font-awesome/fonts/fontawesome-webfont.svg', { destDir: 'fonts' });
app.import('bower_components/font-awesome/fonts/fontawesome-webfont.ttf', { destDir: 'fonts' });
app.import('bower_components/font-awesome/fonts/fontawesome-webfont.woff', { destDir: 'fonts' });

// Lodash
app.import('bower_components/lodash/dist/lodash.js');

// Moment
app.import('bower_components/moment/moment.js');

// Pickadate
app.import('bower_components/pickadate/lib/picker.js');
app.import('bower_components/pickadate/lib/picker.date.js');
app.import('bower_components/pickadate/lib/picker.time.js');
app.import('bower_components/pickadate/lib/legacy.js');

// Use `app.import` to add additional libraries to the generated
// output files.
//
// If you need to use different assets in different
// environments, specify an object as the first parameter. That
// object's keys should be the environment name and the values
// should be the asset to use in that environment.
//
// If the library that you are including contains AMD or ES6
// modules that you would like to import into your application
// please specify an object with the list of modules as keys
// along with the exports of each module as its value.

module.exports = app.toTree();
