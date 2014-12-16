import Ember from 'ember';

export default Ember.Component.extend({
  label: function() {
    var type = this.get('permission.type');
    switch (type) {
    case 'Guild':
    case 'Character':
      return this.get('permission.name');
    default:
      return this.get('permission.args');
    }
  }.property('permission.type', 'permission.args'),

  ownAccount: function() {
    return this.get('permission.key') === ('Account|' + this.get('account.battletag'));
  }.property('permission.key', 'account.battletag'),

  actions: {
    deletePermission: function() {
      this.sendAction('deletePermission',
                      this.get('permission'));
    }
  }
});
