import Ember from 'ember';

export default Ember.Controller.extend({
  loggedIn: function() {
    return !!this.get('account');
  }.property('account')
});
