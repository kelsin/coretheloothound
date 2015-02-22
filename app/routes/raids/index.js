import Ember from 'ember';

/* global moment */
export default Ember.Route.extend({
  model: function() {
    return this.store.filter('raid', {}, function(raid) {
      return moment(raid.get('date')).subtract(6, 'hours').isAfter();
    });
  },

  setupController: function (controller, model) {
    controller.set('model', model);
    controller.set('roles', this.store.all('role'));
  }
});
