import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    return this.store.find('raid');
  },

  setupController: function (controller, model) {
    controller.set('model', model);
    controller.set('roles', this.store.all('role'));
  }
});
