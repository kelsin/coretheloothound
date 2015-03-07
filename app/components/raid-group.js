import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['draggableDropzone', 'group'],
  classNameBindings: ['dragClass'],
  dragClass: '',

  dragStart: function(event) {
    alert('Dragging started');
    event.preventDefault();
    this.set('dragClass', 'dragging');
  },

  dragOver: function(event) {
    alert('Dragging Over');
    event.preventDefault();
    this.set('dragClass', '');
  }
});
