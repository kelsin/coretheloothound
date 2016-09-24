import Ember from 'ember';

export default Ember.Controller.extend({
  loggedIn: Ember.computed('account', function() {
    return !!this.get('account');
  })
});
