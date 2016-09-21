import {
  moduleForComponent,
  test
} from 'ember-qunit';

moduleForComponent('character-select', 'CharacterSelectComponent', {
  // specify the other units that are required for this test
  // needs: ['view:select']
});

test('it renders', function(assert) {
  assert.expect(2);

  // creates the component instance
  var component = this.subject({
    characters: []
  });
  assert.equal(component._state, 'preRender');

  // appends the component to the page
  this.append();
  assert.equal(component._state, 'inDOM');
});
