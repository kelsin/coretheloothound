import Ember from 'ember';

export default Ember.ObjectController.extend({
  classes: function() {
    var classes = 'class-' + this.get('character.class_id');
    if(this.get('preferred')) {
      classes += ' preferred';
    }
    return classes;
  }.property('character.class_id')
});
