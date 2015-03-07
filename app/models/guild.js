import DS from 'ember-data';

/* global _ */
export default DS.Model.extend({
  name: DS.attr('string'),
  realm: DS.attr('string'),

  icon: DS.attr('number'),
  border: DS.attr('number'),

  iconPadded: function() {
    var icon = this.get('icon');
    return _.pad(icon, 2, '0');
  }.property('icon'),

  iconColor: DS.attr('string'),
  borderColor: DS.attr('string'),
  backgroundColor: DS.attr('string'),

  iconHexColor: function() {
    return '#' + this.get('iconColor').substring(2,8);
  }.property('iconColor'),

  borderHexColor: function() {
    return '#' + this.get('borderColor').substring(2,8);
  }.property('borderColor'),

  backgroundHexColor: function() {
    return '#' + this.get('backgroundColor').substring(2,8);
  }.property('backgroundColor'),

  backgroundStyle: function() {
    return 'background-color: ' + this.get('backgroundHexColor') + '; border-color: ' + this.get('borderHexColor') + ';';
  }.property('backgroundHexColor', 'borderHexColor'),

  iconStyle: function() {
    return 'background-color: ' + this.get('iconHexColor') + "; -webkit-mask-box-image: url('https://us.battle.net/wow/static/images/guild/tabards/emblem_" + this.get('iconPadded') + ".png');";
  }.property('iconHexColor', 'iconPadded'),

  characters: DS.hasMany('character'),

  fullName: function() {
    return this.get('name') + ' - ' + this.get('realm');
  }.property('name', 'realm'),

  url: function() {
    return 'http://us.battle.net/wow/guild/' +
      encodeURIComponent(this.get('realm')) + '/' +
      encodeURIComponent(this.get('name')) + '/';
  }.property('name', 'realm')
});
