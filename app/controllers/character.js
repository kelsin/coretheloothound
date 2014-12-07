import Ember from 'ember';

export default Ember.ObjectController.extend({
  dashedName: function() {
    return this.get('name').dasherize();
  }.property('name'),

  dashedRealm: function() {
    return this.get('realm').dasherize();
  }.property('realm'),

  label: function() {
    return this.get('level') + ': ' + this.get('name') + ' - ' + this.get('realm');
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
    return 'http://www.askmrrobot.com/wow/player/us/' + this.get('dashedRealm') + '/' + this.get('dashedName');
  }.property('dashedName', 'dashedRealm'),

  wowheadUrl: function() {
    return 'http://www.wowhead.com/list/us-' + this.get('dashedRealm') + '-' + this.get('dashedName');
  }.property('dashedName', 'dashedRealm')
});
