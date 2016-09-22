import Ember from 'ember';

export default Ember.Component.extend({
  character: Ember.computed('characters.[]', function() {
    return this.get('characters').get('firstObject');
  }),

  roleCheckboxes: Ember.computed.map('character.model.roles', function(role){
    return Ember.ObjectProxy.create({
      content: role,
      checked: true
    });
  }),

  checkedRoles: Ember.computed.filterBy('roleCheckboxes', 'checked', true),

  roles: Ember.computed.mapBy('checkedRoles', 'content'),

  actions: {
    signup() {
      var role_ids = this.get('roles').mapBy('id');
      this.sendAction("action",
                      this.get('character'),
                      this.get('note'),
                      role_ids);
      this.set('note', '');
    }
  }
});
