import Ember from 'ember';

export default Ember.ArrayController.extend({
  sortProperties: ['date:desc', 'name', 'created_at'],
  arrangedContent: Ember.computed.sort('model', 'sortProperties')
});
