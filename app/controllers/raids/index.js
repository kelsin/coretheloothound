import Ember from 'ember';

export default Ember.Controller.extend({
  needs: ['application'],

  sortProperties: ['date:desc', 'title', 'created_at'],

  user: Ember.computed.alias('controllers.application.user'),
  sorted: Ember.computed.sort('model', 'sortProperties'),

  created: function() {
    var user = this.get('user');
    return _.filter(this.get('sorted'), function(raid) {
      return raid.get('creator')._id === user._id;
    });
  }.property('@each'),

  signed_up: function() {
    var user = this.get('user');
    return _.filter(this.get('sorted'), function(raid) {
      return _.any(raid.get('signups'), function(signup) {
        return signup.user._id === user._id;
      });
    });
  }.property('@each'),

  available: function() {
    var user = this.get('user');
    return _.filter(this.get('sorted'), function(raid) {
      return raid.get('creator')._id !== user._id &&
        _.all(raid.get('signups'), function(signup) {
          return signup.user._id !== user._id;
        });
    });
  }.property('@each')
});
