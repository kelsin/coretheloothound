import Ember from 'ember';

export default Ember.Component.extend({
  adminPermissions: Ember.computed.filterBy('raid.permissions', 'level', 'admin'),
  memberPermissions: Ember.computed.filterBy('raid.permissions', 'level', 'member'),

  actions: {
    newAdminPermission: function() {
      this.sendAction('newPermission',
                      'admin',
                      'Account|' + this.get('adminAccount'));
    },

    newMemberAccountPermission: function() {
      this.sendAction('newPermission',
                      'member',
                      'Account|' + this.get('memberAccount'));
    },

    newMemberCharacterPermission: function() {
      this.sendAction('newPermission',
                      'member',
                      'Character|'
                      + this.get('characterName')
                      + this.get('characterRealm'));
    },

    newMemberGuildPermission: function() {
      this.sendAction('newPermission',
                      'member',
                      'Guild|'
                      + this.get('guildName')
                      + this.get('guildRealm'));
    },

    deletePermission: function(permission) {
      this.sendAction('deletePermission',
                      permission);
    }
  }
});
