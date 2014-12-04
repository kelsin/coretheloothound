import Ember from 'ember';

export default Ember.Route.extend({
  model: function(params) {
    return params.apikey;
  },

  afterModel: function(apikey, transition) {
    this.get('storage').setValue('apikey', apikey);
    transition.send('loadUser');
    this.transitionTo('index');
  }
});
