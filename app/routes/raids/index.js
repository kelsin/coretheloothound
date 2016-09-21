import Ember from 'ember';

/* global moment */
export default Ember.Route.extend({
  model() {
    return this.store.filter('raid', {}, function(raid) {
      return moment(raid.get('date')).add(6, 'hours').isAfter();
    });
  },

  setupController(controller, model) {
    controller.set('model', model);
    controller.set('roles', this.store.peekAll('role'));
  }
});
