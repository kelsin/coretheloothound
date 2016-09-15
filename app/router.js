import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  // Login
  this.route('apikey', { path: '/apikey/:apikey' });

  // Raiding!
  this.route('raids', function() {
    this.route('new');
  });
  this.route('raid', { path: '/raid/:raid_id' }, function() {
    this.route('edit');
  });

  // User Preference Pages
  this.route('account', function() {
    this.route('characters', function() {});
  });
});

export default Router;
