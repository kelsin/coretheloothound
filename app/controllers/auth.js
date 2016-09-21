import ENV from 'coretheloothound/config/environment';
import Ember from 'ember';

/**
 * Controller for the login/logout view
 */
export default Ember.Controller.extend({
  applicationController: Ember.inject.controller('application'),

  apikey: Ember.computed.alias('applicationController.apikey'),
  account: Ember.computed.alias('applicationController.account'),
  loggedIn: Ember.computed.alias('applicationController.loggedIn'),

  actions: {
    logout() {
      var _this = this;

      Ember.$.ajax({
        type: 'GET',
        url: ENV.api + '/logout',
        headers: {
          Authorization: 'apikey ' + _this.get('apikey')
        },
        success() {
          _this.get('storage').removeValue('apikey');
          _this.set('apikey', undefined);
          _this.set('account', undefined);
          _this.transitionToRoute('index');
        }
      });
    }
  }
});
