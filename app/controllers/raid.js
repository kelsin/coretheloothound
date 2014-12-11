import Ember from 'ember';
import CharacterController from './character';

/* global moment */
/* global _ */
export default Ember.ObjectController.extend({
  needs: ['application'],
  account: Ember.computed.alias('controllers.application.account'),

  moreThanOneGroup: function() {
    return this.get('groups.number') > 1;
  }.property('groups.number'),

  signedUpCharacterIds: function() {
    return this.get('signups').map(function(signup) {
      return signup.get('character.id');
    });
  }.property('signups.@each'),

  rolesSorting: ['slug:desc'],
  sortedRoles: Ember.computed.sort('roles', 'rolesSorting'),

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

  accountSignups: function() {
    return this.get('signups').map(function(signup) {
      return signup.get('character.account.id');
    }).uniq().get('length');
  }.property('signups.@each'),

  accountWaitingList: function() {
    return this.get('waitingList').map(function(signup) {
      return signup.get('character.account.id');
    }).uniq().get('length');
  }.property('waitingList.@each'),

  accountSeated: function() {
    return this.get('seated').map(function(signup) {
      return signup.get('character.account.id');
    }).uniq().get('length');
  }.property('seated.@each'),

  totalSlots: function() {
    var groups = this.get('groups');
    return groups.size * groups.number;
  }.property('groups'),

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

  seated: Ember.computed.filterBy('signups', 'seated', true),
  unseated: Ember.computed.filterBy('signups', 'seated', false),
  // Waiting list doesn't include anyone from an account that has been seated
  waitingList: function() {
    var seated = this.get('seated');
    var unseated = this.get('unseated');
    var account_ids = seated.map(function(signup) {
      return signup.get('character.account.id');
    }).uniq();
    return unseated.filter(function(signup) {
      return !account_ids.contains(signup.get('character.account.id'));
    });
  }.property('seated.@each', 'unseated.@each'),

  seatedClassData: function() {
    var className = this.get('className');
    var signups = this.get('seated');
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
      var to = cur + ((value / total) || 0);
      cur = to;
      return {
        number: value,
        id: class_id,
        name: className(class_id),
        className: 'class-' + class_id,
        from: from,
        to: to
      };
    });
  }.property('seated.@each'),

  classData: function () {
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
      var to = cur + ((value / total) || 0);
      cur = to;
      return {
        number: value,
        id: class_id,
        name: className(class_id),
        className: 'class-' + class_id,
        from: from,
        to: to
      };
    });
  }.property('signups.@each'),

  seatedRoleData: function() {
    var signups = this.get('seated');
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
      var to = cur + ((value / total) || 0);
      cur = to;
      return {
        number: value,
        name: name,
        className: name.toLowerCase(),
        from: from,
        to: to
      };
    });
  }.property('seated.@each.role'),

  roleData: function() {
    var signups = this.get('signups');
    var total = 0;
    var totals = signups.reduce(function(totals, signup) {
      signup.get('roles').forEach(function(role) {
        var name = role.get('name');
        var num = totals[name] || 0;
        totals[name] = num + 1;
        total++;
      });
      return totals;
    }, {});

    var cur = 0.0;
    return _.map(['Tank', 'Healing', 'DPS'], function(name) {
      var value = totals[name] || 0;
      var from = cur;
      var to = cur + ((value / total) || 0);
      cur = to;
      return {
        number: value,
        name: name,
        className: name.toLowerCase(),
        from: from,
        to: to
      };
    });
  }.property('signups.@each.roles')
});
