import Ember from 'ember';

export default Ember.Route.extend({
  model: function(params) {
    return this.store.find('raid', params.raid_id);
  },

  actions: {
    seat: function(signup, role) {
      signup.set('seated', true);
      signup.set('role', role);
      signup.save();
    },

    unseat: function(signup) {
      signup.set('seated', false);
      signup.save();
    },

    signup: function(character, role_ids) {
      var _this = this;
      var raid = this.currentModel;

      var signup = this.store.createRecord('signup', {
        character: character.get('model'),
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
    }
  }
});
