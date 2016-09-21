import {
  moduleForModel,
  test
} from 'ember-qunit';

moduleForModel('raid', 'Raid', {
  // Specify the other units that are required for this test.
  needs: ['model:account', 'model:character', 'model:guild', 'model:permission', 'model:permissioned', 'model:role', 'model:signup']
});

test('it exists', function(assert) {
  var model = this.subject();
  // var store = this.store();
  assert.ok(!!model);
});
