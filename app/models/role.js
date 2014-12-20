import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr(),
  slug: DS.attr(),
  icon: DS.attr(),
  class_ids: DS.attr(),

  iconClasses: function() {
    return 'fa fa-' + this.get('icon') + ' fa-fw ' + this.get('slug');
  }.property('icon', 'slug')
});
