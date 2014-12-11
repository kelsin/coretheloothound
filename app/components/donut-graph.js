import Ember from 'ember';

/* global d3 */
/* global Math */
export default Ember.Component.extend({
  classNames: ['graph-container'],

  angle: function() {
    return d3.scale.linear()
      .domain([0.0, 1.0])
      .range([0.0, 2.0 * Math.PI]);
  }.property(),

  arc: function(inner, outer) {
    var angle = this.get('angle');
    return d3.svg.arc()
      .innerRadius(inner)
      .outerRadius(outer)
      .startAngle(function (d) {
        return angle(d.from);
      })
      .endAngle(function (d) {
        return angle(d.to);
      });
  },

  arcInner: function() {
    return this.arc(34, 56);
  }.property('angle'),

  arcOuter: function() {
    return this.arc(30, 60);
  }.property('angle'),

  update: function() {
    var svg = this.get('svg');
    var data = this.get('data');
    var arcOuter = this.get('arcOuter');
    var arcInner = this.get('arcInner');

    var dataOuter = svg.selectAll('path.outer').data(data, function(d) {
      return d.name;
    });
    dataOuter.enter()
      .append('path')
      .attr('class', function(d) {
        return 'outer border-' + d.className;
      })
      .attr('transform', 'translate(60,60)')
      .append("title")
      .text(function(d) {
        return d.name + ': ' + d.number;
      });
    dataOuter.exit().remove();
    dataOuter.attr('d', arcOuter);

    var dataInner = svg.selectAll('path.inner').data(data, function(d) {
      return d.name;
    });
    dataInner.enter()
      .append('path')
      .attr('class', function(d) {
        return 'inner ' + d.className;
      })
      .attr('transform', 'translate(60,60)')
      .append("title")
      .text(function(d) {
        return d.name + ': ' + d.number;
      });
    dataInner.exit().remove();
    dataInner.attr('d', arcInner);

  }.observes('data.@each'),

  didInsertElement: function() {
    var element = d3.select('#' + this.get('elementId') + ' .graph');

    var svg = element.append('svg')
          .attr('height', '120')
          .attr('width', '120');
    this.set('svg', svg);

    this.update();
  }
});
