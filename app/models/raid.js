import DS from 'ember-data';
import Ember from 'ember';
import Permissioned from './permissioned';

/* global moment */
export default Permissioned.extend({
  name: DS.attr('string'),
  date: DS.attr('date'),
  note: DS.attr('string'),
  account: DS.belongsTo('account', {
    async: false
  }),
  groups: DS.attr(),
  admin: DS.attr(),
  guild: DS.belongsTo('guild', {
    async: false
  }),
  signups: DS.hasMany('signup', {
    async: false
  }),
  finalized: DS.attr(),
  hidden: DS.attr(),

  moreThanOneGroup: Ember.computed('groups.number', function() {
    return this.get('groups.number') > 1;
  }),

  signedUpCharacterIds: Ember.computed('signups.[].character', function() {
    return this.get('signups').mapBy('character.id');
  }),

  hiddenAndNotFinalized: Ember.computed('hidden', 'finalized', function() {
    return this.get('hidden') && !this.get('finalized');
  }),

  dateAgo: Ember.computed('date', function() {
    return moment(this.get('date')).fromNow();
  }),

  dateCalendar: Ember.computed('date', function() {
    return moment(this.get('date')).calendar();
  }),

  accountSignups: Ember.computed('signups.[].character', function() {
    return this.get('signups').mapBy('character.account.id').uniq().get('length');
  }),

  accountWaitingList: Ember.computed('waitingList.[].character', function() {
    return this.get('waitingList').mapBy('character.account.id').uniq().get('length');
  }),

  accountSeated: Ember.computed('seated.[].character', function() {
    return this.get('seated').mapBy('character.account.id').uniq().get('length');
  }),

  totalSlots: Ember.computed('groups', function() {
    var groups = this.get('groups');
    return groups.size * groups.number;
  }),

  className(class_id) {
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

  hasWaitingList: Ember.computed('waitingList.length', function() {
    return this.get('waitingList.length') > 0;
  }),

  hasSeated: Ember.computed('seated.length', function() {
    return this.get('seated.length') > 0;
  }),

  seatedUnsorted: Ember.computed.filterBy('signups', 'seated', true),
  seatedSortFields: ['name'],
  seated: Ember.computed.sort('seatedUnsorted', 'seatedSortFields'),
  unseated: Ember.computed.filterBy('signups', 'seated', false),

  // Waiting list doesn't include anyone from an account that has been seated
  waitingList: Ember.computed('seated.[].character', 'unseated.[].character', function() {
    var seated = this.get('seated');
    var unseated = this.get('unseated');
    var account_ids = seated.mapBy('character.account.id').uniq();
    return unseated.filter(function(signup) {
      return !account_ids.contains(signup.get('character.account.id'));
    }).sortBy('character.account.battletag');
  }),

  waitingListByAccount: Ember.computed('waitingList.[].account', function() {
    var _this = this;

    return this.get('waitingList').mapBy('character.account').uniq().map(function(account) {
      return Ember.Object.create({
        account: account,
        signups: _this.get('waitingList').filterBy('character.account.id', account.get('id'))
      });
    });
  })
});
