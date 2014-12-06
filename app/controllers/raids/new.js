import Ember from 'ember';

/* global moment */
export default Ember.ObjectController.extend({
  init: function() {
    this._super();
    this.set('name', '');
    this.set('date',
             moment().endOf('isoWeek').hour(19).minute(0).second(0).add(2, 'days').toDate());
  },

  actions: {
    create: function() {
      var _this = this;

      var raid = this.store.createRecord('raid', {
        name: this.get('name'),
        date: this.get('date')
      });

      raid.save().then(function(raid) {
        _this.init();
        _this.transitionToRoute('raid', raid);
      });
    }
  }
});
