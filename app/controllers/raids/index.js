import Ember from 'ember';

export default Ember.ArrayController.extend({
  sortProperties: ['date', 'name', 'created_at'],
  itemController: 'raid'
});
