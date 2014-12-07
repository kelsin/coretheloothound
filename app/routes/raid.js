import Ember from 'ember';

export default Ember.Route.extend({
  model: function(params) {
    return this.store.find('raid', params.raid_id);
  },

  actions: {
    signup: function(character, role) {
      var _this = this;
      var raid = this.currentModel;

      var signup = this.store.createRecord('signup', {
        character: character.get('model'),
        raid: raid,
        role: role.toLowerCase()
      });

      signup.save();
    },
    unsignup: function(signup) {
      signup.destroyRecord();
    }
  }
});
