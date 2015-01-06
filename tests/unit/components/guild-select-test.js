import Ember from "ember";

import {
  moduleForComponent,
  test
} from 'ember-qunit';

moduleForComponent('guild-select', 'GuildSelectComponent', {
  // specify the other units that are required for this test
  // needs: ['component:foo', 'helper:bar']
  needs: ['controller:application'],
  setup: function(container) {
    container.register('view:select', Ember.Select, { instantiate: false });
  }
});

test('it renders', function() {
  expect(2);

  // creates the component instance
  var component = this.subject();
  equal(component._state, 'preRender');

  // appends the component to the page
  this.append();
  equal(component._state, 'inDOM');
});
