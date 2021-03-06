import Ember from 'ember';

/* global moment */
export default Ember.Controller.extend({
  applicationController: Ember.inject.controller('application'),
  currentAccount: Ember.computed.alias('applicationController.model'),

  raidSorting: ['date', 'name'],

  filteredRaids: Ember.computed('model.[]', function() {
    return this.get('model').filter(function(raid) {
      return moment(raid.get('date')).add(6, 'hours').isAfter();
    });
  }),

  sortedRaids: Ember.computed.sort('filteredRaids', 'raidSorting')
});
