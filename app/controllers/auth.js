/* global $ */

import Ember from 'ember';

/**
 * Controller for the login/logout view
 */
export default Ember.Controller.extend({
  needs: ['application'],

  apikey: Ember.computed.alias('controllers.application.apikey'),
  account: Ember.computed.alias('controllers.application.account'),
  loggedIn: Ember.computed.alias('controllers.application.loggedIn'),

  actions: {
    login: function() {
      Ember.$.ajax({
        type: 'GET',
        url: 'https://api.byfirebepurged.com/login',
        data: {
          redirect: window.location.protocol +
            '//' + window.location.host +
            '/#/apikey/'
        },
        success: function(data) {
          window.location = data.href;
        }
      });
    },

    logout: function() {
      Ember.$.ajax({
        type: 'GET',
        url: 'https://api.byfirebepurged.com/logout',
        headers: {
          Authorization: 'apikey ' + this.get('apikey')
        },
        success: function(data) {
          this.get('storage').removeValue('apikey');
          this.set('apikey', undefined);
          this.set('account', undefined);
          this.transitionToRoute('index');
        }
      });
    }
  }
});
