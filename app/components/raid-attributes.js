import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    editRaidName() {
      this.sendAction('editRaidName', this.get('newRaidName'));
    }
  }
});