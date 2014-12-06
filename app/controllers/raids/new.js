import Ember from 'ember';

/* global moment */
export default Ember.ObjectController.extend({
  actions: {
    create: function() {
      var _this = this;

      this.get('model').save().then(function(raid) {
        _this.transitionToRoute('raid', raid);
      });
    }
  }
});
