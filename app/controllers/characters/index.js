import Ember from 'ember';
import ENV from 'coretheloothound/config/environment';

/* global _ */
export default Ember.Controller.extend({
  realm: 'All',
  onlyMax: true,

  updateRealm: Ember.observer('realm', function() {
    var realm = this.get('realm');

    if (realm) {
      window.localStorage.setItem('coretheloothound_realm', realm);
    }
  }),

  realms: Ember.computed('model.@each.realm', function() {
    this.set('realm', window.localStorage.getItem('coretheloothound_realm') || 'All');

    return ['All'].concat(_.uniq(this.get('model').mapBy('realm')).sort());
  }),

  sortProperties: ['level:desc', 'name'],
  sorted: Ember.computed.sort('model', 'sortProperties'),

  filtered: Ember.computed('sorted', 'onlyMax', 'realm', function() {
    var realm = this.get('realm');
    var onlyMax = this.get('onlyMax');

    return this.get('sorted').filter(function(character) {
      if(onlyMax && character.get('level') < ENV.maxLevel) {
        return false;
      }

      if(!realm || realm === 'All') {
        return true;
      } else {
        return realm === character.get('realm');
      }
    });
  })
});
