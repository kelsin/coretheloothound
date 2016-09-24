import {
  moduleForModel,
  test
} from 'ember-qunit';

moduleForModel('guild', 'Guild', {
  // Specify the other units that are required for this test.
  needs: ['model:account', 'model:character', 'model:signup', 'model:raid', 'model:role']
});

test('it exists', function(assert) {
  var model = this.subject();
  // var store = this.store();
  assert.ok(!!model);
});
