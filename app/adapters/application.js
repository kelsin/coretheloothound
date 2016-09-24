import Ember from 'ember';
import DS from 'ember-data';
import ENV from 'coretheloothound/config/environment';

export default DS.RESTAdapter.extend({
  host: ENV.api,

  headers: Ember.computed(function() {
    return {
      'Accept': 'application/json+ember',
      'Authorization': 'apikey ' + this.get('storage').getValue('apikey')
    };
  }).volatile()
});
