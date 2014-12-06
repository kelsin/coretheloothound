import Ember from 'ember';

/* global moment */
export default Ember.ObjectController.extend({
  dateAgo: function() {
    return moment(this.get('date')).fromNow();
  }.property('date'),

  dateCalendar: function() {
    return moment(this.get('date')).calendar();
  }.property('date'),

  totalSignups: 0,

  totalSlots: 0
});
