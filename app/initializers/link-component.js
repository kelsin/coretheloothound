import Ember from 'ember';

export function initialize() {
  Ember.LinkComponent.reopen({
    attributeBindings: ['data-content', 'data-toggle']
  });
}

export default {
  name: 'link-component',
  initialize: initialize
};
