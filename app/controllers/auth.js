import Ember from 'ember';

/**
 * Controller for the login/logout view
 */
export default Ember.Controller.extend({
  application: Ember.inject.controller(),
  session: Ember.inject.service(),

  account: Ember.computed.alias('application.model'),
  apikey: Ember.computed.alias('session.apikey'),
  loggedIn: Ember.computed.alias('session.loggedIn'),

  actions: {
    logout() {
      var _this = this;
      this.get('session').logout()
        .then(function() {
          _this.transitionToRoute('index');
        });
    }
  }
});
