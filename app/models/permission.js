import DS from 'ember-data';

export default DS.Model.extend({
  permissioned: DS.hasMany('permissioned', { polymorphic: true }),
  level: DS.attr('string'),
  key: DS.attr('string')
});
