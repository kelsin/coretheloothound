import {
  moduleForModel,
  test
} from 'ember-qunit';

moduleForModel('account', 'Account', {
  // Specify the other units that are required for this test.
  needs: ['model:character', 'model:guild', 'model:permission', 'model:raid', 'model:role', 'model:signup']
});

test('it exists', function() {
  var model = this.subject();
  // var store = this.store();
  ok(!!model);
});
