import Ember from 'ember';

export default Ember.Component.extend({
  tagName: "tr",

  accountSeated: Ember.computed('raid.seated.[].character', 'account.id', function() {
    var accountId = this.get('account.id').toString();
    return this.get('raid.seated').findBy('character.account.id', accountId);
  }),

  accountSignedUp: Ember.computed('raid.signups.[].character', 'account.id', function() {
    var accountId = this.get('account.id').toString();
    return this.get('raid.signups').filterBy('character.account.id', accountId);
  })
});
