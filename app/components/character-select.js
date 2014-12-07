import Ember from 'ember';

export default Ember.Component.extend({
  character: function() {
    return this.get('characters').get('firstObject');
  }.property('characters.@each'),

  roleCheckboxes: Ember.computed.map('character.roles', function(role){
    return Ember.ObjectProxy.create({
      content: role,
      checked: false
    });
  }),

  checkedRoles: Ember.computed.filterBy('roleCheckboxes', 'checked', true),

  roles: Ember.computed.mapBy('checkedRoles', 'content'),

  actions: {
    signup: function() {
      this.sendAction("action",
                      this.get('character'),
                      this.get('roles'));
    }
  }
});
