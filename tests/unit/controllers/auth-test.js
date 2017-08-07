import {
  moduleFor,
  test
} from 'ember-qunit';

moduleFor('controller:auth', 'AuthController', {
  needs: ['controller:application', 'service:session']
});

// Replace this with your real tests.
test('it exists', function(assert) {
  var controller = this.subject();
  assert.ok(controller);
});
