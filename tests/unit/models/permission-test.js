import {
  moduleForModel,
  test
} from 'ember-qunit';

moduleForModel('permission', 'Permission', {
  // Specify the other units that are required for this test.
  needs: ['model:permissioned']
});

test('it exists', function(assert) {
  var model = this.subject();
  // var store = this.store();
  assert.ok(!!model);
});
