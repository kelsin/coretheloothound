import Ember from 'ember';

export default Ember.Component.extend({
  guild: undefined,

  guilds: Ember.computed('account.characters.[].guild', function() {
    return (this.get('account.characters') || Ember.A([])).mapBy('guild').compact().uniq().sortBy('name').toArray();
  }),

  actions: {
    change(event) {
      const guilds = this.get('guilds');
      const selectedIndex = event.target.selectedIndex;
      const guild = guilds[selectedIndex - 1];
      this.set('guild', guild);
      this.sendAction('changeGuild', guild);
    }
  }
});
