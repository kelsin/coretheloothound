import Ember from 'ember';

export default Ember.ObjectController.extend({
  dashedName: function() {
    return this.get('name').dasherize();
  }.property('name'),

  dashedRealm: function() {
    return this.get('realm').dasherize();
  }.property('realm'),

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
