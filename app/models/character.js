import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  realm: DS.attr('string'),

  level: DS.attr('number'),
  item_level: DS.attr('number'),

  class_id: DS.attr('number'),
  race_id: DS.attr('number'),
  gender_id: DS.attr('number'),

  image_url: DS.attr('string'),

  account: DS.belongsTo('account', {
    async: false
  }),
  guild: DS.belongsTo('guild', {
    async: false
  }),
  signups: DS.hasMany('signup', {
    async: false
  }),
  roles: DS.hasMany('role', {
    async: false
  })
});
