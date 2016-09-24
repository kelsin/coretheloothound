import Ember from 'ember';

export default Ember.Component.extend({
  classNames: 'signup',

  rolesSorting: ['slug:desc'],
  sortedRoles: Ember.computed.sort('signup.roles', 'rolesSorting'),

  attributeBindings: ['draggable:draggable', 'note:title'],
  draggable: true,

  note: Ember.computed('signup.note', function() {
    return this.get('signup.note');
  }),

  classes: Ember.computed('signup.character.class_id', function() {
    var classes = 'class class-' + this.get('signup.character.class_id');
    if(this.get('preferred')) {
      classes += ' preferred';
    }
    return classes;
  }),

  iconClasses: Ember.computed('signup.role.slug', function() {
    return 'role ' + this.get('signup.role.slug');
  }),

  mine: Ember.computed('currentAccount.id', 'signup.character.account.id', function() {
    return this.get('currentAccount.id') === this.get('signup.character.account.id');
  }),

  canBeSeated: Ember.computed('signup.raid.waitingList.[]', function() {
    var waitingList = this.get('signup.raid.waitingList');
    return waitingList.mapBy('id').includes(this.get('signup.id'));
  }),

  actions: {
    unsignup() {
      this.sendAction("unsignup",
                      this.get('signup'));
    },
    seat(role) {
      this.sendAction("seat",
                      this.get('signup'),
                      role);
    },
    unseat() {
      this.sendAction("unseat",
                      this.get('signup'));
    }
  }
});
