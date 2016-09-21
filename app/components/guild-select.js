import Ember from 'ember';

export default Ember.Component.extend({
  guilds: Ember.computed('account.characters.@each.guild', function() {
    return (this.get('account.characters') || Ember.A([])).mapBy('guild').compact().uniq().sortBy('name').toArray();
  })
});
