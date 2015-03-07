import DS from 'ember-data';
import Ember from 'ember';
import Permissioned from './permissioned';

/* global moment */
export default Permissioned.extend({
  name: DS.attr('string'),
  date: DS.attr('date'),
  note: DS.attr('string'),
  account: DS.belongsTo('account'),
  groups: DS.attr(),
  admin: DS.attr(),
  guild: DS.belongsTo('guild'),
  signups: DS.hasMany('signup'),
  finalized: DS.attr(),
  hidden: DS.attr(),

  moreThanOneGroup: function() {
    return this.get('groups.number') > 1;
  }.property('groups.number'),

  signedUpCharacterIds: function() {
    return this.get('signups').map(function(signup) {
      return signup.get('character.id');
    });
  }.property('signups.@each.character'),

  hiddenAndNotFinalized: function() {
    return this.get('hidden') && !this.get('finalized');
  }.property('hidden', 'finalized'),

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
  }.property('signups.@each.character'),

  accountWaitingList: function() {
    return this.get('waitingList').map(function(signup) {
      return signup.get('character.account.id');
    }).uniq().get('length');
  }.property('waitingList.@each.character'),

  accountSeated: function() {
    return this.get('seated').map(function(signup) {
      return signup.get('character.account.id');
    }).uniq().get('length');
  }.property('seated.@each.character'),

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

  hasWaitingList: function() {
    return this.get('waitingList.length') > 0;
  }.property('waitingList.length'),

  hasSeated: function() {
    return this.get('seated.length') > 0;
  }.property('seated.length'),

  seatedUnsorted: Ember.computed.filterBy('signups', 'seated', true),
  seatedSortFields: ['name'],
  seated: Ember.computed.sort('seatedUnsorted', 'seatedSortFields'),
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
    }).sortBy('character.account.battletag');
  }.property('seated.@each.character', 'unseated.@each.character'),

  waitingListByAccount: function() {
    var _this = this;

    return this.get('waitingList').mapBy('character.account').uniq().map(function(account) {
      return Ember.Object.create({
        account: account,
        signups: _this.get('waitingList').filterBy('character.account.id', account.get('id'))
      });
    });
  }.property('waitingList.@each.account')
});
