import {
  moduleForModel,
  test
} from 'ember-qunit';

moduleForModel('character', 'Character', {
  // Specify the other units that are required for this test.
  needs: ['model:account', 'model:guild', 'model:signup', 'model:raid', 'model:role']
});

test('it exists', function() {
  var model = this.subject();
  // var store = this.store();
  ok(!!model);
});
