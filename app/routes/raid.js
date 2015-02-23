import Ember from 'ember';

/* global _ */
export default Ember.Route.extend({
  model: function(params) {
    return this.store.find('raid', params.raid_id);
  },

  setupController: function (controller, model) {
    controller.set('model', model);
    controller.set('roles', this.store.all('role'));
  },

  actions: {
    hide: function() {
      var raid = this.currentModel;
      raid.set('hidden', true);
      raid.save();
    },

    unhide: function() {
      var raid = this.currentModel;
      raid.set('hidden', false);
      raid.save();
    },

    finalize: function() {
      var raid = this.currentModel;
      raid.set('finalized', true);
      raid.save();
    },

    unfinalize: function() {
      var raid = this.currentModel;
      raid.set('finalized', false);
      raid.save();
    },

    seat: function(signup, role) {
      signup.set('seated', true);
      signup.set('role', role);
      signup.save();
    },

    unseat: function(signup) {
      signup.set('seated', false);
      signup.save();
    },

    signup: function(character, note, role_ids) {
      var _this = this;
      var raid = this.currentModel;

      var signup = this.store.createRecord('signup', {
        character: character.get('model'),
        note: note,
        raid: raid
      });

      Ember.RSVP.all(_.map(role_ids, function(role_id) {
        return _this.store.find('role', role_id);
      })).then(function(roles) {
        return _.each(roles, function(role) {
          signup.get('roles').addObject(role);
        });
      }).then(function() {
        signup.save();
      });
    },

    unsignup: function(signup) {
      signup.destroyRecord();
    },

    newPermission: function(level, key) {
      var raid = this.currentModel;

      var permission = this.store.createRecord('permission', {
        level: level,
        key: key,
        permissioned: raid
      });

      permission.save();
    },

    deletePermission: function(permission) {
      permission.destroyRecord();
    }
  }
});
