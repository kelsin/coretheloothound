import Ember from 'ember';
import AfterRender from '../../mixins/after-render';

export default Ember.View.extend(AfterRender, {
  afterRenderEvent: function() {
    Ember.$('[data-toggle="popover"]').popover({trigger: 'hover'});
  }
});
