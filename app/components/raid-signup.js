import Ember from 'ember';

export default Ember.Component.extend({
  classNames: 'signup',

  rolesSorting: ['slug:desc'],
  sortedRoles: Ember.computed.sort('signup.model.roles', 'rolesSorting'),

  attributeBindings: ['draggable:draggable', 'note:title'],
  draggable: true,

  note: Ember.computed('signup.model.note', function() {
    return this.get('signup.model.note');
  }),

  classes: Ember.computed('signup.model.character.class_id', function() {
    var classes = 'class class-' + this.get('signup.model.character.class_id');
    if(this.get('preferred')) {
      classes += ' preferred';
    }
    return classes;
  }),

  iconClasses: Ember.computed('signup.role.slug', function() {
    return 'role ' + this.get('signup.role.slug');
  }),

  mine: Ember.computed('currentAccount.id', 'signup.model.character.account.id', function() {
    return this.get('currentAccount.id') === this.get('signup.model.character.account.id');
  }),

  actions: {
    unsignup() {
      this.sendAction("unsignup",
                      this.get('signup.content'));
    },
    seat(role) {
      this.sendAction("seat",
                      this.get('signup.content'),
                      role);
    },
    unseat() {
      this.sendAction("unseat",
                      this.get('signup.content'));
    }
  }
});
