import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    return this.store.find('account', '1').then(function(account) {
      return account.get('characters');
    });
  }
});
