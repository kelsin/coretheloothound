import Ember from 'ember';

export default Ember.Route.extend({
  session: Ember.inject.service(),

  beforeModel() {
    if(this.get('session.loggedIn')) {
      this.transitionTo('raids.index');
    } else {
      this.get('session').login();
    }
  }
});
