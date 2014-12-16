import Ember from 'ember';

export default Ember.Component.extend({
  classNames: 'signup',

  classes: function() {
    var classes = 'class-' + this.get('signup.character.class_id');
    if(this.get('preferred')) {
      classes += ' preferred';
    }
    return classes;
  }.property('signup.character.class_id'),

  iconClasses: function() {
    return 'fa fa-' + this.get('signup.role.icon') + ' fa-fw';
  }.property('signup.role.icon'),

  mine: function() {
    return this.get('account.id') === this.get('signup.character.account.id');
  }.property('account', 'signup.character.account'),

  actions: {
    unsignup: function() {
      this.sendAction("unsignup",
                      this.get('signup.content'));
    },
    seat: function(role) {
      this.sendAction("seat",
                      this.get('signup.content'),
                      role);
    },
    unseat: function() {
      this.sendAction("unseat",
                      this.get('signup.content'));
    }
  }
});
