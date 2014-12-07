import Ember from 'ember';

export default Ember.Route.extend({
  model: function(params) {
    return this.store.find('raid', params.raid_id);
  },

  actions: {
    signup: function(character, roles) {
      var _this = this;
      var raid = this.currentModel;

      var signup = this.store.createRecord('signup', {
        character: character.get('model'),
        raid: raid
      });

      this.store.find('role', 1)
        .then(function(role) {
          signup.get('roles').addObject(role);
          console.log(signup);
          signup.save();
        });
    },
    unsignup: function(signup) {
      signup.destroyRecord();
    }
  }
});
