import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('raid-row', 'Integration | Component | raid row', {
  integration: true
});

var AccountStub = Ember.Object.create({
  id: "1"
});

var RaidStub = Ember.Object.create({
  seated: [],
  signups: []
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +
  this.set('account', AccountStub);
  this.set('raid', RaidStub);

  this.render(hbs`{{raid-row raid=raid account=account}}`);

  assert.equal(this.$().text().trim(), 'Not Signed Up!');

  // Template block usage:" + EOL +
  this.render(hbs`
    {{#raid-row raid=raid account=account}}
      template block text
    {{/raid-row}}
  `);

  assert.equal(this.$().text().trim(), 'Not Signed Up!');
});
