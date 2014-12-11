import Ember from 'ember';

export default Ember.ObjectController.extend({
  number: function() {
    var id = this.get('id');
    return this.get('parentController.seated').filter(function(signup) {
      return signup.get('role.id') === id;
    }).get('length');
  }.property('parentController.seated.@each.role'),

  statClasses: function() {
    return 'stat role-' + this.get('slug');
  }.property('slug'),

  iconClasses: function() {
    return 'fa fa-' + this.get('icon') + ' fa-fw';
  }.property('icon')
});
