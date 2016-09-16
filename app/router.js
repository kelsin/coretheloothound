import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

export default Router.map(function() {
  // Login
  this.route('apikey', { path: '/apikey/:apikey' });

  // Raiding!
  this.resource('raids', function() {
    this.route('new');
  });
  this.resource('raid', { path: '/raid/:raid_id' }, function() {
    this.route('edit');
  });

  // User Preference Pages
  this.resource('account', function() {
    this.resource('characters', function() {});
  });
});
