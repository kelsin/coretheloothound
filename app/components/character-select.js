import Ember from 'ember';

export default Ember.Component.extend({
  character: function() {
    return this.get('characters').get('firstObject');
  }.property('characters.@each'),

  roleCheckboxes: Ember.computed.map('character.roles', function(role){
    return Ember.ObjectProxy.create({
      content: role,
      checked: true
    });
  }),

  checkedRoles: Ember.computed.filterBy('roleCheckboxes', 'checked', true),

  roles: Ember.computed.mapBy('checkedRoles', 'content'),

  actions: {
    signup: function() {
      var roles = this.get('roles').map(function(role) {
        return role.get('id');
      });
      this.sendAction("action",
                      this.get('character'),
                      roles);
    }
  }
});
