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
  }.property('signups.@each'),

  className: function(class_id) {
    switch(class_id) {
    case 1: return 'Warrior';
    case 2: return 'Paladin';
    case 3: return 'Hunter';
    case 4: return 'Rogue';
    case 5: return 'Priest';
    case 6: return 'Death Knight';
    case 7: return 'Shaman';
    case 8: return 'Mage';
    case 9: return 'Warlock';
    case 10: return 'Monk';
    case 11: return 'Druid';
    default: return '';
    }
  },

  data: function () {
    var className = this.get('className');
    var signups = this.get('signups');
    var total = 0;
    var totals = signups.reduce(function(totals, signup) {
      var id = parseInt(signup.get('character.class_id'));
      var num = totals[id] || 0;
      totals[id] = num + 1;
      total++;
      return totals;
    }, {});

    var cur = 0.0;
    return _.map([1,2,3,4,5,6,7,8,9,10,11], function(class_id) {
      var value = totals[class_id] || 0;
      var from = cur;
      var to = cur + (value / total);
      cur = to;
      return {
        id: class_id,
        name: className(class_id),
        className: 'class-' + class_id,
        from: from,
        to: to
      };
    });
  }.property('signups.@each'),

  roleData: function() {
    var signups = this.get('signups');
    var total = 0;
    var totals = signups.reduce(function(totals, signup) {
      var role = signup.get('role');
      if (role) {
        var name = role.get('name');
        var num = totals[name] || 0;
        totals[name] = num + 1;
        total++;
      }
      return totals;
    }, {});

    var cur = 0.0;
    return _.map(['Tank', 'Healing', 'DPS'], function(name) {
      var value = totals[name] || 0;
      var from = cur;
      var to = cur + (value / total);
      cur = to;
      return {
        name: name,
        className: name.toLowerCase(),
        from: from,
        to: to
      };
    });
  }.property('signups.@each')
});
