import Ember from 'ember';

export default Ember.ArrayController.extend({
  sortProperties: ['date', 'name'],
  itemController: 'raid'
});
