import Ember from 'ember';
import CharacterController from './character';

export default Ember.Controller.extend({
  indexController: Ember.inject.controller('raids/index'),
  applicationController: Ember.inject.controller('application'),
  currentAccount: Ember.computed.alias('applicationController.account'),
  roles: Ember.computed.alias('indexController.roles'),
  rolesSorting: ['slug:desc'],
  sortedRoles: Ember.computed.sort('roles', 'rolesSorting'),

  seatedByRole: Ember.computed('sortedRoles.@each.id', 'seated.@each.role', function() {
    var _this = this;

    return this.get('sortedRoles').map(function(role) {
      return Ember.Object.create({
        role: role,
        signups: _this.get('seated').filterBy('role.id', role.get('id'))
      });
    });
  }),

  currentAccountSeated: Ember.computed('model.seated.@each.character', 'currentAccount.id', function() {
    var accountId = this.get('currentAccount.id').toString();
    return this.get('model.seated').findBy('character.account.id', accountId);
  }),

  currentAccountSignedUp: Ember.computed('model.signups.@each.character', 'currentAccount.id', function() {
    var accountId = this.get('currentAccount.id').toString();
    return this.get('model.signups').filterBy('character.account.id', accountId);
  }),

  characters: Ember.computed('currentAccount.characters', 'signedUpCharacterIds', function() {
    var ids = this.get('signedUpCharacterIds');
    return this.get('currentAccount.characters')
      .filter(function(character) {
        return !ids.contains(character.get('model.id'));
      })
      .map(function(character) {
        return CharacterController.create({
          model: character
        });
      })
      .sort(function(a,b) {
        var diff = b.get('model.level') - a.get('model.level');
        if(diff) {
          return diff;
        } else {
          return a.get('model.name').localeCompare(b.get('model.name'));
        }
      });
  })
});
