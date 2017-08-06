import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('character-select', 'Integration | Component | character select', {
  integration: true
});

var CharactersStub = [];

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });"
  this.set('characters', CharactersStub);

  this.render(hbs`{{character-select characters=characters}}`);

  assert.expect(0);
  // assert.equal(this.$().text().trim(), '');
});
