import Ember from 'ember';

export default Ember.Component.extend({
  guild: Ember.computed('guilds', {
    get() {
      return this.get('guilds').get('firstObject');
    },
    set(key, value) {
      return value;
    }
  }),

  guilds: Ember.computed('account.characters.[].guild', function() {
    return (this.get('account.characters') || Ember.A([])).mapBy('guild').compact().uniq().sortBy('name').toArray();
  }),

  init() {
    this._super(...arguments);
    this.sendAction('changeGuild', this.get('guild'));
  },

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
