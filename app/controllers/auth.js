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
      var _this = this;

      Ember.$.ajax({
        type: 'GET',
        url: 'https://api.byfirebepurged.com/logout',
        headers: {
          Authorization: 'apikey ' + this.get('apikey')
        },
        success: function(data) {
          _this.get('storage').removeValue('apikey');
          _this.set('apikey', undefined);
          _this.set('account', undefined);
          _this.transitionToRoute('index');
        }
      });
    }
  }
});
