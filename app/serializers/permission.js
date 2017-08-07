import ApplicationSerializer from './application';
import Ember from 'ember';
import DS from 'ember-data';

export default ApplicationSerializer.extend({
  keyForAttribute: function(attr) {
    return Ember.String.underscore(attr);
  },
  keyForRelationship: function(key) {
    return Ember.String.underscore(key) + '_id';
  },
  keyForPolymorphicType: function(key) {
    return Ember.String.underscore(key) + '_type';
  },
  payloadTypeFromModelName: function(modelName) {
    return Ember.String.classify(modelName);
  },
  serializePolymorphicType(snapshot, json, relationship) {
    var key = relationship.key;
    var belongsTo = snapshot.belongsTo(key);
    var typeKey = this.keyForPolymorphicType(key, relationship.type, 'serialize');

    // old way of getting the key for the polymorphic type
    key = this.keyForAttribute ? this.keyForAttribute(key, "serialize") : key;
    key = `${key}Type`;

    // The old way of serializing the type of a polymorphic record used
    // `keyForAttribute`, which is not correct. The next code checks if the old
    // way is used and if it differs from the new way of using
    // `keyForPolymorphicType`. If this is the case, a deprecation warning is
    // logged and the old way is restored (so nothing breaks).
    if (key !== typeKey && this.keyForPolymorphicType === DS.RESTSerializer.prototype.keyForPolymorphicType) {
      typeKey = key;
    }

    if (Ember.isNone(belongsTo)) {
      json[typeKey] = null;
    } else {
      // if (isEnabled("ds-payload-type-hooks")) {
        json[typeKey] = this.payloadTypeFromModelName(belongsTo.modelName);
      // } else {
      //   json[typeKey] = camelize(belongsTo.modelName);
      // }
    }
  }
});
