import Ember from 'ember';
import DS from 'ember-data';

export default DS.Model.extend({
  permissioned: DS.belongsTo('permissioned', {
    polymorphic: true,
    async: false
  }),
  level: DS.attr('string'),
  key: DS.attr('string'),

  type: Ember.computed('key', function() {
    return this.get('key').split('|')[0];
  }),

  args: Ember.computed('key', function() {
    return this.get('key').split('|')[1];
  }),

  name: Ember.computed('args', function() {
    return this.get('args').split(':')[0];
  }),

  realm: Ember.computed('args', function() {
    return this.get('args').split(':')[1];
  })
});
