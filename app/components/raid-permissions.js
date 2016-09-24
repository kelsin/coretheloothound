import Ember from 'ember';

export default Ember.Component.extend({
  adminPermissions: Ember.computed.filterBy('raid.permissions', 'level', 'admin'),
  memberPermissions: Ember.computed.filterBy('raid.permissions', 'level', 'member'),

  actions: {
    newAdminPermission() {
      this.sendAction('newPermission',
                      'admin',
                      'Account|' + this.get('adminAccount'));
    },

    newMemberAccountPermission() {
      this.sendAction('newPermission',
                      'member',
                      'Account|' + this.get('memberAccount'));
    },

    newMemberCharacterPermission() {
      this.sendAction('newPermission',
                      'member',
                      'Character|' + this.get('characterName') + ':' + this.get('characterRealm'));
    },

    newMemberGuildPermission() {
      this.sendAction('newPermission',
                      'member',
                      'Guild|' + this.get('guildName') + ':' + this.get('guildRealm'));
    },

    deletePermission(permission) {
      this.sendAction('deletePermission',
                      permission);
    }
  }
});
