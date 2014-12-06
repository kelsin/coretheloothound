import DS from 'ember-data';
import Permissioned from './permissioned';

export default Permissioned.extend({
  name: DS.attr('string'),
  date: DS.attr('date'),
  note: DS.attr('string'),
  account: DS.belongsTo('account'),
  groups: DS.attr(),
  signups: DS.hasMany('signup')
});
