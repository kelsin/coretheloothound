import { moduleForModel, test } from 'ember-qunit';

moduleForModel('permission', 'Unit | Serializer | permission', {
  // Specify the other units that are required for this test.
  needs: ['model:permissioned', 'serializer:permission']
});

// Replace this with your real tests.
test('it serializes records', function(assert) {
  let record = this.subject();

  let serializedRecord = record.serialize();

  assert.ok(serializedRecord);
});
