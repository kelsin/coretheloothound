import Ember from 'ember';

export function characterRace(race_id) {
  var faction = function(race_id) {
    switch(race_id) {
    case 1:
    case 3:
    case 4:
    case 7:
    case 11:
    case 22:
    case 25:
      return 'alliance';
    case 2:
    case 5:
    case 6:
    case 8:
    case 9:
    case 10:
    case 26:
      return 'horde';
    case 24:
      return 'neutral';
    default:
      return 'neutral';
    }
  };

  var races = {
    1: 'Human',
    2: 'Orc',
    3: 'Dwarf',
    4: 'Night Elf',
    5: 'Undead',
    6: 'Tauren',
    7: 'Gnome',
    8: 'Troll',
    9: 'Goblin',
    10: 'Blood Elf',
    11: 'Draenei',
    22: 'Worgen',
    24: 'Pandaren',
    25: 'Pandaren',
    26: 'Pandaren'
  };

  return new Ember.Handlebars.SafeString('<span class="' + faction(race_id) + '">' + races[race_id] + '</span>');
}

export default Ember.Handlebars.makeBoundHelper(characterRace);
