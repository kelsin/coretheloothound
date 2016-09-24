import Ember from 'ember';

export default Ember.Component.extend({
  label: Ember.computed('permission.type', 'permission.args', function() {
    var type = this.get('permission.type');
    switch (type) {
    case 'Guild':
    case 'Character':
      return this.get('permission.name');
    default:
      return this.get('permission.args');
    }
  }),

  ownAccount: Ember.computed('permission.key', 'account.battletag', function() {
    return this.get('permission.key') === ('Account|' + this.get('account.battletag'));
  }),

  actions: {
    deletePermission() {
      this.sendAction('deletePermission',
                      this.get('permission'));
    }
  }
});
