import Ember from 'ember';

export default Ember.Component.extend({
  character: Ember.computed('characters', {
    get() {
      return this.get('characters').get('firstObject');
    },
    set(key, value) {
      return value;
    }
  }),

  roleCheckboxes: Ember.computed.map('character.roles', function(role){
    return Ember.ObjectProxy.create({
      content: role,
      checked: true
    });
  }),

  checkedRoles: Ember.computed.filterBy('roleCheckboxes', 'checked', true),

  roles: Ember.computed.mapBy('checkedRoles', 'content'),

  actions: {
    change(event) {
      const characters = this.get('characters');
      const selectedIndex = event.target.selectedIndex;
      const character = characters[selectedIndex];
      this.set('character', character);
    },
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
