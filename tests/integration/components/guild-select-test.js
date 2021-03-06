import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('guild-select', 'Integration | Component | guild select', {
  integration: true
});

var AccountStub = Ember.Object.create({
  characters: []
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });"

  this.set('account', AccountStub);

  this.render(hbs`{{guild-select account=account}}`);

  assert.equal(this.$().text().trim(), 'None');
});
