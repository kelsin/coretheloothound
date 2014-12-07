import Ember from 'ember';

export default Ember.Component.extend({
  roles: function() {
    var character = this.get('character');
    var roles = ['DPS'];
    if(character && character.get('canHeal')) {
      roles.push('Healer');
    }
    if(character && character.get('canTank')) {
      roles.push('Tank');
    }
    return roles;1
  }.property('character'),

  character: function() {
    return this.get('characters').get('firstObject');
  }.property('characters.@each'),

  actions: {
    signup: function() {
      this.sendAction("action",
                      this.get('character'),
                      this.get('role'));
    }
  }
});
