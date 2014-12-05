import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  realm: DS.attr('string'),

  characters: DS.hasMany('character')
});
