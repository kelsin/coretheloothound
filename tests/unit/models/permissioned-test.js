import {
  moduleForModel,
  test
} from 'ember-qunit';

moduleForModel('permissioned', 'Permissioned', {
  // Specify the other units that are required for this test.
  needs: ['model:permission']
});

test('it exists', function(assert) {
  var model = this.subject();
  // var store = this.store();
  assert.ok(!!model);
});
