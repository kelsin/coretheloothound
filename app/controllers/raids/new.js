import Ember from 'ember';

/* global moment */
export default Ember.Controller.extend({
  needs: ['application'],
  account: Ember.computed.alias('controllers.application.account'),

  init: function() {
    this._super();
    this.set('name', '');
    this.set('date',
             moment().endOf('isoWeek').hour(19).minute(0).second(0).add(2, 'days').toDate());
    this.set('hidden', true);
  },

  actions: {
    create: function() {
      var _this = this;

      var raid = this.store.createRecord('raid', {
        name: this.get('name'),
        guild: this.get('guild'),
        date: this.get('date'),
        hidden: this.get('hidden')
      });

      raid.save().then(function(raid) {
        _this.init();
        _this.transitionToRoute('raid', raid);
      });
    }
  }
});
