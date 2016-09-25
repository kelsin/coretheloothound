import Ember from 'ember';
import ENV from 'coretheloothound/config/environment';

export default Ember.Service.extend({
  storage: Ember.inject.service(),

  // Logged In State
  loggedIn: false,

  // API Key
  apikey: null,

  init() {
    var apikey = this.get('storage').getValue('apikey');
    if(!Ember.isBlank(apikey)) {
      this.set('loggedIn', true);
      this.set('apikey', apikey);
    }
  },

  login() {
    return Ember.$.ajax({
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
      success(data) {
        window.location = data.href;
      }
    });
  },

  setApikey(apikey) {
    this.set('loggedIn', true);
    this.set('apikey', apikey);
    this.get('storage').setValue('apikey', apikey);
  },

  logout() {
    if(this.get('loggedIn')) {
      var apikey = this.get('apikey');
      var _this = this;

      return Ember.$.ajax({
        type: 'GET',
        url: ENV.api + '/logout',
        headers: {
          Authorization: 'apikey ' + apikey
        },
        complete() {
          _this.set('loggedIn', false);
          _this.set('apikey', null);
          _this.get('storage').removeValue('apikey');
        }
      });
    } else {
      return Ember.RSVP.resolve(true);
    }
  }
});
