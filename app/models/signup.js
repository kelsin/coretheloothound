import DS from 'ember-data';

export default DS.Model.extend({
  raid: DS.belongsTo('raid'),
  character: DS.belongsTo('character'),
  role: DS.belongsTo('role'),
  roles: DS.hasMany('role'),
  seated: DS.attr(),
  preferred: DS.attr()
});
