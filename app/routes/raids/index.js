import Ember from 'ember';

/* global moment */
export default Ember.Route.extend({
  model() {
    return this.store.findAll('raid');
  },

  setupController(controller, model) {
    controller.set('model', model);
    controller.set('roles', this.store.peekAll('role'));
  }
});
