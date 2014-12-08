import Ember from 'ember';

export default Ember.ObjectController.extend({
  // This signup can be seated if they are currently in the waiting list
  canBeSeated: function() {
    var waitingList = this.get('parentController.waitingList');
    return waitingList.map(function(signup) {
      return signup.get('id');
    }).contains(this.get('id'));
  }.property('parentController.waitingList.@each')
});
