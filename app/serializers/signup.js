import DS from 'ember-data';

export default DS.RESTSerializer.extend({
  attrs: {
    roles: { serialize: 'ids' }
  }
});
