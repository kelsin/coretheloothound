import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  // Login
  this.route('apikey', { path: '/apikey/:apikey' });

  // Raiding!
  this.route('raids', {
    resetNamespace: true
  }, function() {
    this.route('new');
  });
  this.route('raid', {
    path: '/raid/:raid_id',
    resetNamespace: true
  }, function() {
    this.route('edit');
  });

  // User Preference Pages
  this.route('account', {
    resetNamespace: true
  }, function() {
    this.route('characters', {
      resetNamespace: true
    }, function() {});
  });
  this.route('authenticated');
});

export default Router;
