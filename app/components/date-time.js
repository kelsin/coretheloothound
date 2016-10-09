import Ember from 'ember';

/* global moment */
export default Ember.Component.extend({
  picktime: Ember.computed('date', 'pickdate', {
    get() {
      return moment(this.get('date')).format('h:mm A');
    },
    set(key, value) {
      /*jshint unused: vars */
      this.set('date', moment(this.get('pickdate') + ' ' + value, 'D MMMM, YYYY h:mm A').toDate());
      return moment(this.get('date')).format('h:mm A');
    }
  }),

  pickdate: Ember.computed('date', 'picktime', {
    get() {
      return moment(this.get('date')).format('D MMMM, YYYY');
    },
    set(key, value) {
      /*jshint unused: vars */
      this.set('date', moment(value + ' ' + this.get('picktime'), 'D MMMM, YYYY h:mm A').toDate());
      return moment(this.get('date')).format('D MMMM, YYYY');
    }
  }),

  dateAgo: Ember.computed('date', function() {
    return moment(this.get('date')).fromNow();
  }),

  calendarDate: Ember.computed('date', function() {
    return moment(this.get('date')).calendar();
  }),

  didInsertElement() {
    Ember.$('.datepicker').pickadate();
    Ember.$('.timepicker').pickatime();
  }
});
