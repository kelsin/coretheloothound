import Ember from 'ember';

export default Ember.ObjectController.extend({
  number: function() {
    var id = this.get('id');
    return this.get('parentController.seated').filter(function(signup) {
      return signup.get('role.id') === id;
    }).get('length');
  }.property('parentController.seated.@each.role'),

  statClasses: function() {
    return 'stat ' + this.get('iconClasses');
  }.property('iconClasses'),

  iconClasses: function() {
    return 'role ' + this.get('slug');
  }.property('slug')
});
