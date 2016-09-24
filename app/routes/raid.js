import Ember from 'ember';

/* global _ */
export default Ember.Route.extend({
  model(params) {
    return this.store.find('raid', params.raid_id);
  },

  setupController(controller, model) {
    controller.set('model', model);
    controller.set('roles', this.store.peekAll('role'));
  },

  actions: {
    hide() {
      var raid = this.currentModel;
      raid.set('hidden', true);
      raid.save();
    },

    unhide() {
      var raid = this.currentModel;
      raid.set('hidden', false);
      raid.save();
    },

    finalize() {
      var raid = this.currentModel;
      raid.set('finalized', true);
      raid.save();
    },

    unfinalize() {
      var raid = this.currentModel;
      raid.set('finalized', false);
      raid.save();
    },

    delete() {
      var _this = this;
      var raid = this.currentModel;
      if(window.confirm('Are you sure you want to delete "' + raid.get('name') + '"?')) {
        raid.destroyRecord().then(function() {
          _this.transitionTo('raids.index');
        });
      }
    },

    signup(character, note, role_ids) {
      var _this = this;
      var raid = this.currentModel;

      var signup = this.store.createRecord('signup', {
        character: character,
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

    newPermission(level, key) {
      var raid = this.currentModel;

      var permission = this.store.createRecord('permission', {
        level: level,
        key: key,
        permissioned: raid
      });

      permission.save();
    },

    deletePermission(permission) {
      permission.destroyRecord();
    }
  }
});
