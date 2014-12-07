import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr(),
  slug: DS.attr(),
  icon: DS.attr(),
  class_ids: DS.attr()
});
