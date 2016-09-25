import Ember from 'ember';

export default Ember.Controller.extend({
  session: Ember.inject.service(),
  apikey: Ember.computed.alias('session.apikey'),
  loggedIn: Ember.computed.alias('session.loggedIn')
});
