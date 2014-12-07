import Ember from 'ember';
import CharacterController from './character';

/* global moment */
export default Ember.ObjectController.extend({
  needs: ['application'],
  account: Ember.computed.alias('controllers.application.account'),

  signedUpCharacterIds: function() {
    return this.get('signups').map(function(signup) {
      return signup.get('character.id');
    });
  }.property('signups.@each'),

  characters: function() {
    var ids = this.get('signedUpCharacterIds');
    return this.get('account.characters')
      .filter(function(character) {
        return !ids.contains(character.get('id'));
      })
      .map(function(character) {
        return CharacterController.create({
          model: character
        });
      })
      .sort(function(a,b) {
        var diff = b.get('level') - a.get('level');
        if(diff) {
          return diff;
        } else {
          return a.get('name').localeCompare(b.get('name'));
        }
      });
  }.property('account.characters', 'signedUpCharacterIds'),

  dateAgo: function() {
    return moment(this.get('date')).fromNow();
  }.property('date'),

  dateCalendar: function() {
    return moment(this.get('date')).calendar();
  }.property('date'),

  totalSignups: function() {
    return this.get('signups').get('length');
  }.property('signups.@each'),

  totalSlots: function() {
    var groups = this.get('groups');
    return groups.size * groups.number;
  }.property('groups'),

  totalTanks: function() {
    return this.get('signups').reduce(function(total, signup) {
      if(signup.get('role') === 'tank') {
        return total + 1;
      } else {
        return total;
      }
    }, 0);
  }.property('signups.@each'),

  totalHealers: function() {
    return this.get('signups').reduce(function(total, signup) {
      if(signup.get('role') === 'healer') {
        return total + 1;
      } else {
        return total;
      }
    }, 0);
  }.property('signups.@each'),

  waitingList: function() {
    return this.get('signups').filter(function(signup) {
      return !signup.get('seated');
    });
  }.property('signups.@each')
});
