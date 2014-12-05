import DS from 'ember-data';

export default DS.ActiveModelAdapter.extend({
  host: 'https://api.byfirebepurged.com',

  headers: function() {
    return {
      'Authorization': 'apikey ' + this.get('storage').getValue('apikey')
    };
  }.property().volatile()
});
