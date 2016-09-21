import Ember from 'ember';
import DS from 'ember-data';

export default DS.RESTSerializer.extend({
  isNewSerializerAPI: true,
  keyForAttribute: function(attr) {
    return Ember.String.underscore(attr);
  }
});
