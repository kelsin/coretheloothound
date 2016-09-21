import Ember from 'ember';

export default Ember.Controller.extend({
  raidSorting: ['date', 'name'],

  filteredRaids: Ember.computed('model.@each', function() {
    return this.get('model').filter(function(raid) {
      return moment(raid.get('date')).add(6, 'hours').isAfter();
    });
  }),

  sortedRaids: Ember.computed.sort('filteredRaids', 'raidSorting')
});
