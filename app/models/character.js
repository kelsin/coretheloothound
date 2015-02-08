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

  account: DS.belongsTo('account'),
  guild: DS.belongsTo('guild'),
  signups: DS.hasMany('signup'),
  roles: DS.hasMany('role')
});
