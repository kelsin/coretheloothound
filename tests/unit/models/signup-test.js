import {
  moduleForModel,
  test
} from 'ember-qunit';

moduleForModel('signup', 'Signup', {
  // Specify the other units that are required for this test.
  needs: ['model:account', 'model:character', 'model:guild', 'model:permission', 'model:raid', 'model:role']
});

test('it exists', function() {
  var model = this.subject();
  // var store = this.store();
  ok(!!model);
});
