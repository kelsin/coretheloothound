import Ember from 'ember';

export default Ember.Component.extend({
  storage: Ember.inject.service(),
  adminPermissions: Ember.computed.filterBy('raid.permissions', 'level', 'admin'),
  memberPermissions: Ember.computed.filterBy('raid.permissions', 'level', 'member'),

  init() {
    this._super(...arguments);
    var storedPermissions = this.get('storage').getValue('permissions') || '{}';
    var allPermissions = JSON.parse(storedPermissions);
    this.set('permissionSets', Object.keys(allPermissions));
  },

  actions: {
    savePermissions() {
      var name = this.get('layoutName');
      var storedPermissions = this.get('storage').getValue('permissions') || '{}';
      var permissions = JSON.parse(storedPermissions);

      var newPermission = this.get('memberPermissions').map(function(record) {
        return record.toJSON();
      });

      permissions[name] = newPermission;

      this.get('storage').setValue('permissions', JSON.stringify(permissions));
      this.set('layoutName', undefined);
    },

    applyPermissions(name) {
      var _this = this;
      var storedPermissions = this.get('storage').getValue('permissions') || '{}';
      var permissions = JSON.parse(storedPermissions);

      if(permissions[name]) {
        permissions[name].forEach(function(permission) {
          _this.sendAction('newPermission',
                           permission.level,
                           permission.key);
        });
      }
    },

    deletePermissions(name) {
      var storedPermissions = this.get('storage').getValue('permissions') || '{}';
      var permissions = JSON.parse(storedPermissions);
      delete permissions[name];
      this.get('storage').setValue('permissions', JSON.stringify(permissions));
    },

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
