import Ember from 'ember';
import ENV from 'coretheloothound/config/environment';
import ActiveModelAdapter from 'active-model-adapter';

export default ActiveModelAdapter.extend({
  host: ENV.api,

  headers: Ember.computed(function() {
    return {
      'Accept': 'application/json+ember',
      'Authorization': 'apikey ' + this.get('storage').getValue('apikey')
    };
  }).volatile()
});
