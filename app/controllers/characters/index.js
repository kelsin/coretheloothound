import Ember from 'ember';

/* global _ */
export default Ember.Controller.extend({
  realm: 'All',
  onlyMax: true,

  updateRealm: function() {
    var realm = this.get('realm');

    if (realm) {
      window.localStorage.setItem('coretheloothound_realm', realm);
    }
  }.observes('realm'),

  realms: function() {
    this.set('realm', window.localStorage.getItem('coretheloothound_realm') || 'All');

    return ['All'].concat(_.uniq(_.map(this.get('model').toArray(), function(character) {
      return character.get('realm');
    })).sort());
  }.property('model.@each.realm'),

  sortProperties: ['level:desc', 'name'],
  sorted: Ember.computed.sort('model', 'sortProperties'),

  filtered: function() {
    var realm = this.get('realm');
    var onlyMax = this.get('onlyMax');

    return this.get('sorted').filter(function(character) {
      if(onlyMax && character.get('level') < 100) {
        return false;
      }

      if(!realm || realm === 'All') {
        return true;
      } else {
        return realm === character.get('realm');
      }
    });
  }.property('sorted', 'onlyMax', 'realm')
});
