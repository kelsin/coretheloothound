import Ember from 'ember';

export default Ember.Route.extend({
  session: Ember.inject.service(),

  model(params) {
    return params.apikey;
  },

  afterModel(apikey, transition) {
    this.get('session').setApikey(apikey);
    transition.send('refresh');
    this.transitionTo('raids.index');
  }
});
