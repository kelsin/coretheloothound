import DS from 'ember-data';

export default DS.Model.extend({
  permissions: DS.hasMany('permission', {
    async: false
  }),

  hasPermission(level, key) {
    var found = false;
    this.get('permissions').forEach(function(permission) {
      if(permission.get('level') === level && permission.get('key') === key) {
        found = true;
        return;
      }
    });
    return found;
  }
});
