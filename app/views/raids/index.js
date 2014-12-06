import Ember from 'ember';

export default Ember.View.extend({
  didInsertElement: function() {
    $('[data-toggle="popover"]').popover({trigger: 'hover'});
  }
});
