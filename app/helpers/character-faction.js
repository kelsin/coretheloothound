import Ember from 'ember';

export function characterFaction(race_id) {
  switch(race_id) {
  case 1:
  case 3:
  case 4:
  case 7:
  case 11:
  case 22:
  case 25:
    return 'Alliance';
    break;
  case 2:
  case 5:
  case 6:
  case 8:
  case 9:
  case 10:
  case 26:
    return 'Horde';
    break;
  case 24:
  default:
    return 'Neutral';
    break;
  }
}

export default Ember.Handlebars.makeBoundHelper(characterFaction);
