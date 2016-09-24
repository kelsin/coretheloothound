import Ember from 'ember';

export default Ember.Route.extend({
  model(params) {
    return params.apikey;
  },

  afterModel(apikey, transition) {
    this.get('storage').setValue('apikey', apikey);
    transition.send('loadUser');
    this.transitionTo('raids.index');
  }
});
