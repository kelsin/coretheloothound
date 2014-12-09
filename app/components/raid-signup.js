import Ember from 'ember';

export default Ember.Component.extend({
  classes: function() {
    var classes = 'class-' + this.get('character.class_id');
    if(this.get('preferred')) {
      classes += ' preferred';
    }
    return classes;
  }.property('signup.character.class_id'),

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
