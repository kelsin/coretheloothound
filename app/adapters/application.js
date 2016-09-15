import ENV from 'coretheloothound/config/environment';
import ActiveModelAdapter from 'active-model-adapter';

export default ActiveModelAdapter.extend({
  host: ENV.api,

  headers: function() {
    return {
      'Accept': 'application/json+ember',
      'Authorization': 'apikey ' + this.get('storage').getValue('apikey')
    };
  }.property().volatile()
});
