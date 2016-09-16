import Ember from 'ember';

export default Ember.Controller.extend({
  // This signup can be seated if they are currently in the waiting list
  canBeSeated: function() {
    var waitingList = this.get('parentController.model.waitingList');
    return waitingList.map(function(signup) {
      return signup.get('id');
    }).contains(this.get('model.id'));
  }.property('parentController.model.waitingList.@each')
});
