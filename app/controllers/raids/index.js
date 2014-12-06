import Ember from 'ember';

export default Ember.ArrayController.extend({
  needs: ['application'],
  itemController: 'raid',

  sortProperties: ['date:desc', 'title', 'created_at'],
  arrangedContent: Ember.computed.sort('model', 'sortProperties')
});
