import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    var _this = this;
    var apikey = this.get('storage').getValue('apikey');
    if (apikey) {
      return new Ember.RSVP.Promise(function(resolve, reject) {
        Ember.$.ajax({
          type: 'GET',
          url: 'https://api.byfirebepurged.com/account',
          headers: {
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
          error: reject
        });
      });
    } else {
      return Ember.RSVP.resolve({
        apikey: undefined,
        user: undefined
      });
    }
  },

  setupController: function(controller, model) {
    controller.set('apikey', model.apikey);
    controller.set('user', model.user);
  },

  actions: {
    loadUser: function() {
      console.log('Refreshing');
      this.refresh();
    }
  }
});
