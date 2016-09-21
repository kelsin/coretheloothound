import DS from 'ember-data';

export default DS.RESTSerializer.extend({
  isNewSerializerAPI: true,
  keyForAttribute: function(attr, method) {
    return Ember.String.underscore(attr);
  }
});
