import Ember from 'ember';

export default Ember.ObjectController.extend({
  armoryUrl: function() {
    return 'http://us.battle.net/wow/character/' + this.get('realm') + '/' + this.get('name') + '/simple';
  }.property('name', 'realm'),

  robotUrl: function() {
    return 'http://www.askmrrobot.com/wow/player/us/' + this.get('realm') + '/' + this.get('name');
  }.property('name', 'realm'),

  wowheadUrl: function() {
    return 'http://www.wowhead.com/list/us-' + this.get('realm') + '-' + this.get('name');
  }.property('name', 'realm')
});
