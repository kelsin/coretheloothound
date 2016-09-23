import Ember from 'ember';
import ENV from 'coretheloothound/config/environment';

/* global _ */
export default Ember.Controller.extend({
  realm: 'All',
  onlyMax: true,

  init() {
    this.set('realm', window.localStorage.getItem('coretheloothound_realm') || 'All');
    console.log(typeof this.get('realm'));
  },

  updateRealm: Ember.observer('realm', function() {
    var realm = this.get('realm');

    if (realm) {
      window.localStorage.setItem('coretheloothound_realm', realm);
    }
  }),

  realms: Ember.computed('model.[].realm', function() {
    return ['All'].concat(_.uniq(this.get('model').mapBy('realm')).sort());
  }),

  characterSorting: ['level:desc', 'name'],
  sorted: Ember.computed.sort('model', 'characterSorting'),

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
  }),

  actions: {
    changeRealm(realm) {
      this.set('realm', realm);
    }
  }
});
