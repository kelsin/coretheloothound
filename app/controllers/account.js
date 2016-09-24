import Ember from 'ember';

export default Ember.Controller.extend({
  applicationController: Ember.inject.controller('application'),
  account: Ember.computed.alias('applicationController.account')
});
