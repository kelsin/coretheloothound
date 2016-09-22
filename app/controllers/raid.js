import Ember from 'ember';
import CharacterController from './character';

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
