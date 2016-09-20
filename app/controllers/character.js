import Ember from 'ember';

export default Ember.ObjectController.extend({
  dashedName: function() {
    return this.get('name').dasherize();
  }.property('name'),

  dashedRealm: function() {
    return this.get('realm').dasherize();
  }.property('realm'),

  className: function() {
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
    }
  }.property('class_id'),

  label: function() {
    return this.get('level') +
      ': '  + this.get('name') +
      ' - ' + this.get('className') +
      ' - ' + this.get('realm');
  }.property('name', 'realm'),

  canHeal: function() {
    return [2, 5, 7, 10, 11].contains(this.get('class_id'));
  }.property('class_id'),

  canTank: function() {
    return [1, 2, 6, 10, 11].contains(this.get('class_id'));
  }.property('class_id'),

  armoryUrl: function() {
    return 'http://us.battle.net/wow/character/' + this.get('dashedRealm') + '/' + this.get('dashedName') + '/simple';
  }.property('dashedName', 'dashedRealm'),

  robotUrl: function() {
    return 'http://www.askmrrobot.com/wow/gear/us/' + this.get('dashedRealm') + '/' + this.get('dashedName');
  }.property('dashedName', 'dashedRealm'),

  wowheadUrl: function() {
    return 'http://www.wowhead.com/list/us-' + this.get('dashedRealm') + '-' + this.get('dashedName');
  }.property('dashedName', 'dashedRealm')
});
