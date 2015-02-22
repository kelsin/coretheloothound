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
      var role_ids = this.get('roles').mapBy('id');
      this.sendAction("action",
                      this.get('character'),
                      this.get('note'),
                      role_ids);
      this.set('note', '');
    }
  }
});
