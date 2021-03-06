import DS from 'ember-data';

export default DS.Model.extend({
  accountId: DS.attr('string'),
  battletag: DS.attr('string'),
  characters: DS.hasMany('character', {
    async: false
  }),
  raids: DS.hasMany('raid', {
    async: false
  })
});
