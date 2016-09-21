import Ember from 'ember';
import DS from 'ember-data';

/* global _ */
export default DS.Model.extend({
  name: DS.attr('string'),
  realm: DS.attr('string'),

  icon: DS.attr('number'),
  border: DS.attr('number'),

  iconPadded: Ember.computed('icon', function() {
    var icon = this.get('icon');
    return _.pad(icon, 2, '0');
  }),

  iconColor: DS.attr('string'),
  borderColor: DS.attr('string'),
  backgroundColor: DS.attr('string'),

  iconHexColor: Ember.computed('iconColor', function() {
    return '#' + this.get('iconColor').substring(2,8);
  }),

  borderHexColor: Ember.computed('borderColor', function() {
    return '#' + this.get('borderColor').substring(2,8);
  }),

  backgroundHexColor: Ember.computed('backgroundColor', function() {
    console.log(this.get('name'));
    console.log(this.get('id'));
    console.log(this.get('backgroundColor'));
    return '#' + this.get('backgroundColor').substring(2,8);
  }),

  backgroundStyle: Ember.computed('backgroundHexColor', 'borderHexColor', function() {
    return Ember.String.htmlSafe('background-color: ' + this.get('backgroundHexColor') + '; border-color: ' + this.get('borderHexColor') + ';');
  }),

  iconStyle: Ember.computed('iconHexColor', 'iconPadded', function() {
    return Ember.String.htmlSafe('background-color: ' + this.get('iconHexColor') + "; -webkit-mask-box-image: url('https://us.battle.net/wow/static/images/guild/tabards/emblem_" + this.get('iconPadded') + ".png');");
  }),

  characters: DS.hasMany('character', {
    async: false
  }),

  fullName: Ember.computed('name', 'realm', function() {
    return this.get('name') + ' - ' + this.get('realm');
  }),

  url: Ember.computed('name', 'realm', function() {
    return 'http://us.battle.net/wow/guild/' +
      encodeURIComponent(this.get('realm')) + '/' +
      encodeURIComponent(this.get('name')) + '/';
  })
});
