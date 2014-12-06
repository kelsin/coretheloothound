export function initialize() {
  Ember.LinkView.reopen({
    attributeBindings: ['data-content', 'data-toggle']
  });
}

export default {
  name: 'link-view',
  initialize: initialize
};
