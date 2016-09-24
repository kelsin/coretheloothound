import Ember from 'ember';

export default Ember.Controller.extend({
  indexController: Ember.inject.controller('raids/index'),
  applicationController: Ember.inject.controller('application'),
  currentAccount: Ember.computed.alias('applicationController.account'),
  roles: Ember.computed.alias('indexController.roles'),
  rolesSorting: ['slug:desc'],
  sortedRoles: Ember.computed.sort('roles', 'rolesSorting'),

  seatedByRole: Ember.computed('sortedRoles.[].id', 'seated.[].role', function() {
    var _this = this;

    return this.get('sortedRoles').map(function(role) {
      return Ember.Object.create({
        role: role,
        signups: _this.get('seated').filterBy('role.id', role.get('id'))
      });
    });
  }),

  characters: Ember.computed('currentAccount.characters', 'signedUpCharacterIds', function() {
    var ids = this.get('signedUpCharacterIds');
    return this.get('currentAccount.characters')
      .filter(function(character) {
        return !ids.includes(character.get('id'));
      })
      .sort(function(a,b) {
        var diff = b.get('level') - a.get('level');
        if(diff) {
          return diff;
        } else {
          return a.get('name').localeCompare(b.get('name'));
        }
      });
  }),

  accountSeated: Ember.computed('model.seated.[].character', 'currentAccount.id', function() {
    var accountId = this.get('currentAccount.id').toString();
    return this.get('model.seated').findBy('character.account.id', accountId);
  }),

  accountSignedUp: Ember.computed('model.signups.[].character', 'currentAccount.id', function() {
    var accountId = this.get('currentAccount.id').toString();
    return this.get('model.signups').filterBy('character.account.id', accountId);
  })
});
