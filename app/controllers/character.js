import Ember from 'ember';

export default Ember.Controller.extend({
  dashedName: Ember.computed('model.name', function() {
    return this.get('model.name').dasherize();
  }),

  dashedRealm: Ember.computed('model.realm', function() {
    return this.get('model.realm').dasherize();
  }),

  className: Ember.computed('model.class_id', function() {
    switch(this.get('model.class_id')) {
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

  label: Ember.computed('model.level', 'className', 'model.name', 'model.realm', function() {
    return this.get('model.level') +
      ': '  + this.get('model.name') +
      ' - ' + this.get('className') +
      ' - ' + this.get('model.realm');
  }),

  canHeal: Ember.computed('model.class_id', function() {
    return [2, 5, 7, 10, 11].contains(this.get('model.class_id'));
  }),

  canTank: Ember.computed('model.class_id', function() {
    return [1, 2, 6, 10, 11, 12].contains(this.get('model.class_id'));
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
