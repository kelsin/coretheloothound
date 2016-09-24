import Ember from 'ember';
import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  realm: DS.attr('string'),

  level: DS.attr('number'),
  item_level: DS.attr('number'),

  class_id: DS.attr('number'),
  race_id: DS.attr('number'),
  gender_id: DS.attr('number'),

  image_url: DS.attr('string'),

  account: DS.belongsTo('account', {
    async: false
  }),
  guild: DS.belongsTo('guild', {
    async: false
  }),
  signups: DS.hasMany('signup', {
    async: false
  }),
  roles: DS.hasMany('role', {
    async: false
  }),

  dashedName: Ember.computed('name', function() {
    return this.get('name').dasherize();
  }),

  dashedRealm: Ember.computed('realm', function() {
    return this.get('realm').dasherize();
  }),

  className: Ember.computed('class_id', function() {
    switch(this.get('class_id')) {
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
    case 12: return 'Demon Hunter';
    default: return '';
    }
  }),

  label: Ember.computed('level', 'className', 'name', 'realm', function() {
    return this.get('level') +
      ': '  + this.get('name') +
      ' - ' + this.get('className') +
      ' - ' + this.get('realm');
  }),
  armoryUrl: Ember.computed('dashedName', 'dashedRealm', function() {
    return 'http://us.battle.net/wow/character/' + this.get('dashedRealm') + '/' + this.get('dashedName') + '/simple';
  }),

  robotUrl: Ember.computed('dashedName', 'dashedRealm', function() {
    return 'http://www.askmrrobot.com/wow/gear/us/' + this.get('dashedRealm') + '/' + this.get('dashedName');
  }),

  wowheadUrl: Ember.computed('dashedName', 'dashedRealm', function() {
    return 'http://www.wowhead.com/list/us-' + this.get('dashedRealm') + '-' + this.get('dashedName');
  })
});
