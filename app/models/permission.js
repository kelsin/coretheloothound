import DS from 'ember-data';

export default DS.Model.extend({
  permissioned: DS.belongsTo('permissioned', { polymorphic: true }),
  level: DS.attr('string'),
  key: DS.attr('string'),

  type: function() {
    return this.get('key').split('|')[0];
  }.property('key'),

  args: function() {
    return this.get('key').split('|')[1];
  }.property('key'),

  name: function() {
    return this.get('args').split(':')[0];
  }.property('args'),

  realm: function() {
    return this.get('args').split(':')[1];
  }.property('args')
});
