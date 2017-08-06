import Ember from 'ember';

/* global moment */

export default Ember.Controller.extend({
  session: Ember.inject.service(),
  apikey: Ember.computed.alias('session.apikey'),
  loggedIn: Ember.computed.alias('session.loggedIn'),
  currentYear: Ember.computed(function(){
    return moment().format('YYYY');
  }).volatile()
});
