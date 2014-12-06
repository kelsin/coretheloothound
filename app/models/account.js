import DS from 'ember-data';

export default DS.Model.extend({
  battleTag: DS.attr('string'),
  characters: DS.hasMany('character')
});
