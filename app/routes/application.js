import ENV from 'coretheloothound/config/environment';
import Ember from 'ember';

export default Ember.Route.extend({
  session: Ember.inject.service(),

  model() {
    var _this = this;
    var session = this.get('session');

    if (session.get('loggedIn')) {
      var apikey = session.get('apikey');

      return new Ember.RSVP.Promise(function(resolve) {
        Ember.$.ajax({
          type: 'GET',
          url: ENV.api + '/account',
          headers: {
            Accept: 'application/json+ember',
            Authorization: 'apikey ' + apikey
          },
          success(data) {
            delete data.permissions;
            _this.store.pushPayload('account', data);

            var account = _this.store.peekRecord('account', data.account.id);

            resolve(account);
          },
          error() {
            return session.logout();
          }
        });
      });
    } else {
      return undefined;
    }
  },

  actions: {
    refresh() {
      this.refresh();
    }
  }
});
