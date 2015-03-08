import ENV from 'coretheloothound/config/environment';
import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    var _this = this;
    var apikey = this.get('storage').getValue('apikey');

    if (apikey) {
      return new Ember.RSVP.Promise(function(resolve) {
        Ember.$.ajax({
          type: 'GET',
          url: ENV.api + '/account',
          headers: {
            Accept: 'application/json+ember',
            Authorization: 'apikey ' + apikey
          },
          success: function(data) {
            delete data.permissions;
            _this.store.pushPayload('account', data);

            _this.store.find('account', data.account.id).then(function(account) {
              resolve({
                apikey: apikey,
                account: account
              });
            });
          },
          error: function() {
            // Bad API key
            resolve({
              apikey: undefined,
              account: undefined
            });
          }
        });
      });
    } else {
      return {
        apikey: undefined,
        account: undefined
      };
    }
  },

  setupController: function(controller, model) {
    controller.set('apikey', model.apikey);
    controller.set('account', model.account);
  },

  actions: {
    loadUser: function() {
      this.refresh();
    },

    login: function() {
      Ember.$.ajax({
        type: 'GET',
        url: ENV.api + '/login',
        headers: {
          Accept: 'application/json+ember'
        },
        data: {
          redirect: window.location.protocol +
            '//' + window.location.host +
            '/#/apikey/'
        },
        success: function(data) {
          window.location = data.href;
        }
      });
    }
  }
});
