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
      $.ajax({
        type: 'POST',
        url: 'https://api.byfirebepurged.com/login',
        data:JSON.stringify({
          redirect: window.location.protocol + '//' +
            window.location.host + '/#/apikey/'
        }),
        contentType:'application/json',
        success: function(data) {
          window.location = data.href;
        }
      });
    },

    logout: function() {
      this.get('storage').removeValue('apikey');
      this.set('apikey', undefined);
      this.set('account', undefined);
      this.transitionToRoute('index');
    }
  }
});
