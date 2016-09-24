import Ember from 'ember';

export default Ember.Component.extend({
  backgroundStyle: Ember.computed('guild.backgroundHexColor', 'guild.borderHexColor', function() {
    return Ember.String.htmlSafe('background-color: ' + this.get('guild.backgroundHexColor') + '; border-color: ' + this.get('guild.borderHexColor') + ';');
  }),

  iconStyle: Ember.computed('guild.iconHexColor', 'guild.iconPadded', function() {
    return Ember.String.htmlSafe('background-color: ' + this.get('guild.iconHexColor') + "; -webkit-mask-box-image: url('https://us.battle.net/wow/static/images/guild/tabards/emblem_" + this.get('guild.iconPadded') + ".png');");
  })
});
