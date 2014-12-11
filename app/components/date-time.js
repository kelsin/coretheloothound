import Ember from 'ember';

/* global moment */
export default Ember.Component.extend({
  picktime: function(key, value) {
    if (arguments.length > 1) {
      this.set('date', moment(this.get('pickdate') + ' ' + value, 'D MMMM, YYYY h:mm A').toDate());
    }

    return moment(this.get('date')).format('h:mm A');
  }.property('date', 'pickdate'),

  pickdate: function(key, value) {
    if (arguments.length > 1) {
      this.set('date', moment(value + ' ' + this.get('picktime'), 'D MMMM, YYYY h:mm A').toDate());
    }

    return moment(this.get('date')).format('D MMMM, YYYY');
  }.property('date', 'picktime'),

  dateAgo: function() {
    return moment(this.get('date')).fromNow();
  }.property('date'),

  calendarDate: function() {
    return moment(this.get('date')).calendar();
  }.property('date'),

  didInsertElement: function() {
    Ember.$('.datepicker').pickadate();
    Ember.$('.timepicker').pickatime();
  }
});
