import Ember from 'ember';

export default Ember.Controller.extend({
  raid: Ember.inject.controller(),

  // This signup can be seated if they are currently in the waiting list
  canBeSeated: Ember.computed('raid.model.waitingList.@each', function() {
    var waitingList = this.get('raid.model.waitingList');
    return waitingList.map(function(signup) {
      return signup.get('id');
    }).contains(this.get('model.id'));
  })
});
