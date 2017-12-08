import Ember from 'ember';

export default Ember.Component.extend({
  didInsertElement() {
    this.set('newRaidName', this.get('raid.name'))
  },
  trimmedName: Ember.computed('newRaidName', function(){
    return this.get('newRaidName').trim()
  }),
  actions: {
    editRaidName() {
      if(this.get('trimmedName').length > 0){
        this.sendAction('editRaidName', this.get('newRaidName'));
      }
      
    }
  }
});