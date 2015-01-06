import Ember from 'ember';

export default Ember.Component.extend({
  guilds: function() {
    return (this.get('account.characters') || Ember.A([])).mapBy('guild').compact().uniq().sortBy('name').toArray();
  }.property('account.characters.@each.guild')
});
