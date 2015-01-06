import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  realm: DS.attr('string'),

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
