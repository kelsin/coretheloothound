import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('date-time', 'Integration | Component | date time', {
  integration: true
});

test('it renders', function() {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });"

  this.render(hbs`{{date-time}}`);

  expect(0);
  // assert.equal(this.$().text().trim(), '');
});
