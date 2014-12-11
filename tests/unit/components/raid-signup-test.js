import Ember from "ember";

import {
  moduleForComponent,
  test
} from 'ember-qunit';

moduleForComponent('raid-signup', 'RaidSignupComponent', {
  // specify the other units that are required for this test
  needs: ['controller:role'],
  setup: function(container) {
    container.register('controller:array', Ember.ArrayController, { instantiate: false });
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
