import Ember from 'ember';
import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr(),
  slug: DS.attr(),
  icon: DS.attr(),
  class_ids: DS.attr(),

  iconClasses: Ember.computed('slug', function() {
    // return 'fa fa-fw fa-' + icon;
    return 'role ' + this.get('slug');
  })
});
