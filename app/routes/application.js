import ENV from 'coretheloothound/config/environment';
import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    var _this = this;
    var apikey = this.get('storage').getValue('apikey');

    if (apikey) {
      return new Ember.RSVP.Promise(function(resolve, reject) {
        Ember.$.ajax({
          type: 'GET',
          url: ENV.api + '/account',
          headers: {
            Accept: 'application/json+ember',
            Authorization: 'apikey ' + apikey
          },
          success: function(data) {
            _this.store.push('account', data.account);

            Ember.$.each(data.characters, function(index, character) {
              _this.store.push('character', character);
            });

            Ember.$.each(data.guilds, function(index, guild) {
              _this.store.push('guild', guild);
            });

            resolve({
              apikey: apikey,
              account: data.account
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
    }
  }
});
