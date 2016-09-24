import DS from 'ember-data';

export default DS.Model.extend({
  raid: DS.belongsTo('raid', {
    async: false
  }),
  character: DS.belongsTo('character', {
    async: false
  }),
  role: DS.belongsTo('role', {
    async: false
  }),
  roles: DS.hasMany('role', {
    async: false
  }),
  seated: DS.attr(),
  preferred: DS.attr(),
  note: DS.attr()
});
