import Ember from 'ember';

export default Ember.Controller.extend({
  needs: ['application'],
  account: Ember.computed.alias('controllers.application.account')
});
