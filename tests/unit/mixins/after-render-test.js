import Ember from 'ember';
import AfterRenderMixin from 'coretheloothound/mixins/after-render';

module('AfterRenderMixin');

// Replace this with your real tests.
test('it works', function() {
  var AfterRenderObject = Ember.Object.extend(AfterRenderMixin);
  var subject = AfterRenderObject.create();
  ok(subject);
});
