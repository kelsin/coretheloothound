import DS from 'ember-data';

export default DS.Model.extend({
  raid: DS.belongsTo('raid'),
  character: DS.belongsTo('character'),
  seated: DS.attr(),
  preferred: DS.attr(),
  role: DS.attr()
});
