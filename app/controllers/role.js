import Ember from 'ember';

export default Ember.Controller.extend({
  number: Ember.computed('parentController.seated.[].role', function() {
    var id = this.get('id');
    return this.get('parentController.seated').filter(function(signup) {
      return signup.get('role.id') === id;
    }).get('length');
  }),

  statClasses: Ember.computed('iconClasses', function() {
    return 'stat ' + this.get('iconClasses');
  }),

  iconClasses: Ember.computed('slug', function() {
    return 'role ' + this.get('slug');
  })
});
