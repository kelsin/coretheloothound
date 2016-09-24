"use strict";

/* jshint ignore:start */



/* jshint ignore:end */

define('coretheloothound/adapters/application', ['exports', 'ember', 'ember-data', 'coretheloothound/config/environment'], function (exports, _ember, _emberData, _coretheloothoundConfigEnvironment) {
  exports['default'] = _emberData['default'].RESTAdapter.extend({
    host: _coretheloothoundConfigEnvironment['default'].api,

    headers: _ember['default'].computed(function () {
      return {
        'Accept': 'application/json+ember',
        'Authorization': 'apikey ' + this.get('storage').getValue('apikey')
      };
    }).volatile()
  });
});
define('coretheloothound/app', ['exports', 'ember', 'coretheloothound/resolver', 'ember-load-initializers', 'coretheloothound/config/environment'], function (exports, _ember, _coretheloothoundResolver, _emberLoadInitializers, _coretheloothoundConfigEnvironment) {

  var App = undefined;

  _ember['default'].MODEL_FACTORY_INJECTIONS = true;

  App = _ember['default'].Application.extend({
    modulePrefix: _coretheloothoundConfigEnvironment['default'].modulePrefix,
    podModulePrefix: _coretheloothoundConfigEnvironment['default'].podModulePrefix,
    Resolver: _coretheloothoundResolver['default']
  });

  (0, _emberLoadInitializers['default'])(App, _coretheloothoundConfigEnvironment['default'].modulePrefix);

  exports['default'] = App;
});
define('coretheloothound/components/app-version', ['exports', 'ember-cli-app-version/components/app-version', 'coretheloothound/config/environment'], function (exports, _emberCliAppVersionComponentsAppVersion, _coretheloothoundConfigEnvironment) {

  var name = _coretheloothoundConfigEnvironment['default'].APP.name;
  var version = _coretheloothoundConfigEnvironment['default'].APP.version;

  exports['default'] = _emberCliAppVersionComponentsAppVersion['default'].extend({
    version: version,
    name: name
  });
});
define('coretheloothound/components/character-select', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend({
    character: _ember['default'].computed('characters', {
      get: function get() {
        return this.get('characters').get('firstObject');
      },
      set: function set(key, value) {
        return value;
      }
    }),

    roleCheckboxes: _ember['default'].computed.map('character.roles', function (role) {
      return _ember['default'].ObjectProxy.create({
        content: role,
        checked: true
      });
    }),

    checkedRoles: _ember['default'].computed.filterBy('roleCheckboxes', 'checked', true),

    roles: _ember['default'].computed.mapBy('checkedRoles', 'content'),

    actions: {
      change: function change(event) {
        var characters = this.get('characters');
        var selectedIndex = event.target.selectedIndex;
        var character = characters[selectedIndex];
        this.set('character', character);
      },
      signup: function signup() {
        var role_ids = this.get('roles').mapBy('id');
        this.sendAction("action", this.get('character'), this.get('note'), role_ids);
        this.set('note', '');
      }
    }
  });
});
define('coretheloothound/components/date-time', ['exports', 'ember'], function (exports, _ember) {

  /* global moment */
  exports['default'] = _ember['default'].Component.extend({
    picktime: _ember['default'].computed('date', 'pickdate', function (key, value) {
      if (arguments.length > 1) {
        this.set('date', moment(this.get('pickdate') + ' ' + value, 'D MMMM, YYYY h:mm A').toDate());
      }

      return moment(this.get('date')).format('h:mm A');
    }),

    pickdate: _ember['default'].computed('date', 'picktime', function (key, value) {
      if (arguments.length > 1) {
        this.set('date', moment(value + ' ' + this.get('picktime'), 'D MMMM, YYYY h:mm A').toDate());
      }

      return moment(this.get('date')).format('D MMMM, YYYY');
    }),

    dateAgo: _ember['default'].computed('date', function () {
      return moment(this.get('date')).fromNow();
    }),

    calendarDate: _ember['default'].computed('date', function () {
      return moment(this.get('date')).calendar();
    }),

    didInsertElement: function didInsertElement() {
      _ember['default'].$('.datepicker').pickadate();
      _ember['default'].$('.timepicker').pickatime();
    }
  });
});
define('coretheloothound/components/guild-icon', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend({
    backgroundStyle: _ember['default'].computed('guild.backgroundHexColor', 'guild.borderHexColor', function () {
      return _ember['default'].String.htmlSafe('background-color: ' + this.get('guild.backgroundHexColor') + '; border-color: ' + this.get('guild.borderHexColor') + ';');
    }),

    iconStyle: _ember['default'].computed('guild.iconHexColor', 'guild.iconPadded', function () {
      return _ember['default'].String.htmlSafe('background-color: ' + this.get('guild.iconHexColor') + "; -webkit-mask-box-image: url('https://us.battle.net/wow/static/images/guild/tabards/emblem_" + this.get('guild.iconPadded') + ".png');");
    })
  });
});
define('coretheloothound/components/guild-select', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend({
    guild: _ember['default'].computed('guilds', {
      get: function get() {
        return this.get('guilds').get('firstObject');
      },
      set: function set(key, value) {
        return value;
      }
    }),

    guilds: _ember['default'].computed('account.characters.[].guild', function () {
      return (this.get('account.characters') || _ember['default'].A([])).mapBy('guild').compact().uniq().sortBy('name').toArray();
    }),

    actions: {
      change: function change(event) {
        var guilds = this.get('guilds');
        var selectedIndex = event.target.selectedIndex;
        var guild = guilds[selectedIndex - 1];
        this.set('guild', guild);
      }
    }
  });
});
define("coretheloothound/components/illiquid-model", ["exports", "liquid-fire/components/illiquid-model"], function (exports, _liquidFireComponentsIlliquidModel) {
  Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function get() {
      return _liquidFireComponentsIlliquidModel["default"];
    }
  });
});
define("coretheloothound/components/liquid-bind", ["exports", "liquid-fire/components/liquid-bind"], function (exports, _liquidFireComponentsLiquidBind) {
  Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function get() {
      return _liquidFireComponentsLiquidBind["default"];
    }
  });
});
define("coretheloothound/components/liquid-child", ["exports", "liquid-fire/components/liquid-child"], function (exports, _liquidFireComponentsLiquidChild) {
  Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function get() {
      return _liquidFireComponentsLiquidChild["default"];
    }
  });
});
define("coretheloothound/components/liquid-container", ["exports", "liquid-fire/components/liquid-container"], function (exports, _liquidFireComponentsLiquidContainer) {
  Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function get() {
      return _liquidFireComponentsLiquidContainer["default"];
    }
  });
});
define("coretheloothound/components/liquid-if", ["exports", "liquid-fire/components/liquid-if"], function (exports, _liquidFireComponentsLiquidIf) {
  Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function get() {
      return _liquidFireComponentsLiquidIf["default"];
    }
  });
});
define("coretheloothound/components/liquid-measured", ["exports", "liquid-fire/components/liquid-measured"], function (exports, _liquidFireComponentsLiquidMeasured) {
  Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function get() {
      return _liquidFireComponentsLiquidMeasured["default"];
    }
  });
  Object.defineProperty(exports, "measure", {
    enumerable: true,
    get: function get() {
      return _liquidFireComponentsLiquidMeasured.measure;
    }
  });
});
define("coretheloothound/components/liquid-outlet", ["exports", "liquid-fire/components/liquid-outlet"], function (exports, _liquidFireComponentsLiquidOutlet) {
  Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function get() {
      return _liquidFireComponentsLiquidOutlet["default"];
    }
  });
});
define("coretheloothound/components/liquid-spacer", ["exports", "liquid-fire/components/liquid-spacer"], function (exports, _liquidFireComponentsLiquidSpacer) {
  Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function get() {
      return _liquidFireComponentsLiquidSpacer["default"];
    }
  });
});
define('coretheloothound/components/liquid-sync', ['exports', 'liquid-fire/components/liquid-sync'], function (exports, _liquidFireComponentsLiquidSync) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _liquidFireComponentsLiquidSync['default'];
    }
  });
});
define("coretheloothound/components/liquid-unless", ["exports", "liquid-fire/components/liquid-unless"], function (exports, _liquidFireComponentsLiquidUnless) {
  Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function get() {
      return _liquidFireComponentsLiquidUnless["default"];
    }
  });
});
define("coretheloothound/components/liquid-versions", ["exports", "liquid-fire/components/liquid-versions"], function (exports, _liquidFireComponentsLiquidVersions) {
  Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function get() {
      return _liquidFireComponentsLiquidVersions["default"];
    }
  });
});
define('coretheloothound/components/raid-group', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend({
    classNames: ['draggableDropzone', 'group'],
    classNameBindings: ['dragClass'],
    dragClass: '',

    dragStart: function dragStart(event) {
      alert('Dragging started');
      event.preventDefault();
      this.set('dragClass', 'dragging');
    },

    dragOver: function dragOver(event) {
      alert('Dragging Over');
      event.preventDefault();
      this.set('dragClass', '');
    }
  });
});
define('coretheloothound/components/raid-permission', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend({
    label: _ember['default'].computed('permission.type', 'permission.args', function () {
      var type = this.get('permission.type');
      switch (type) {
        case 'Guild':
        case 'Character':
          return this.get('permission.name');
        default:
          return this.get('permission.args');
      }
    }),

    ownAccount: _ember['default'].computed('permission.key', 'account.battletag', function () {
      return this.get('permission.key') === 'Account|' + this.get('account.battletag');
    }),

    actions: {
      deletePermission: function deletePermission() {
        this.sendAction('deletePermission', this.get('permission'));
      }
    }
  });
});
define('coretheloothound/components/raid-permissions', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend({
    adminPermissions: _ember['default'].computed.filterBy('raid.permissions', 'level', 'admin'),
    memberPermissions: _ember['default'].computed.filterBy('raid.permissions', 'level', 'member'),

    actions: {
      newAdminPermission: function newAdminPermission() {
        this.sendAction('newPermission', 'admin', 'Account|' + this.get('adminAccount'));
      },

      newMemberAccountPermission: function newMemberAccountPermission() {
        this.sendAction('newPermission', 'member', 'Account|' + this.get('memberAccount'));
      },

      newMemberCharacterPermission: function newMemberCharacterPermission() {
        this.sendAction('newPermission', 'member', 'Character|' + this.get('characterName') + ':' + this.get('characterRealm'));
      },

      newMemberGuildPermission: function newMemberGuildPermission() {
        this.sendAction('newPermission', 'member', 'Guild|' + this.get('guildName') + ':' + this.get('guildRealm'));
      },

      deletePermission: function deletePermission(permission) {
        this.sendAction('deletePermission', permission);
      }
    }
  });
});
define('coretheloothound/components/raid-row', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend({
    tagName: "tr",

    accountSeated: _ember['default'].computed('raid.seated.[].character', 'account.id', function () {
      var accountId = this.get('account.id').toString();
      return this.get('raid.seated').findBy('character.account.id', accountId);
    }),

    accountSignedUp: _ember['default'].computed('raid.signups.[].character', 'account.id', function () {
      var accountId = this.get('account.id').toString();
      return this.get('raid.signups').filterBy('character.account.id', accountId);
    })
  });
});
define('coretheloothound/components/raid-signup', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend({
    classNames: 'signup',

    rolesSorting: ['slug:desc'],
    sortedRoles: _ember['default'].computed.sort('signup.roles', 'rolesSorting'),

    attributeBindings: ['draggable:draggable', 'note:title'],
    draggable: true,

    note: _ember['default'].computed('signup.note', function () {
      return this.get('signup.note');
    }),

    classes: _ember['default'].computed('signup.character.class_id', function () {
      var classes = 'class class-' + this.get('signup.character.class_id');
      if (this.get('preferred')) {
        classes += ' preferred';
      }
      return classes;
    }),

    iconClasses: _ember['default'].computed('signup.role.slug', function () {
      return 'role ' + this.get('signup.role.slug');
    }),

    mine: _ember['default'].computed('currentAccount.id', 'signup.character.account.id', function () {
      return this.get('currentAccount.id') === this.get('signup.character.account.id');
    }),

    canBeSeated: _ember['default'].computed('signup.raid.waitingList.[]', function () {
      var waitingList = this.get('signup.raid.waitingList');
      return waitingList.mapBy('id').includes(this.get('signup.id'));
    }),

    actions: {
      unsignup: function unsignup() {
        this.sendAction("unsignup", this.get('signup'));
      },
      seat: function seat(role) {
        this.sendAction("seat", this.get('signup'), role);
      },
      unseat: function unseat() {
        this.sendAction("unseat", this.get('signup'));
      }
    }
  });
});
define('coretheloothound/controllers/account', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Controller.extend({
    applicationController: _ember['default'].inject.controller('application'),
    account: _ember['default'].computed.alias('applicationController.account')
  });
});
define('coretheloothound/controllers/application', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Controller.extend({
    loggedIn: _ember['default'].computed('account', function () {
      return !!this.get('account');
    })
  });
});
define('coretheloothound/controllers/auth', ['exports', 'coretheloothound/config/environment', 'ember'], function (exports, _coretheloothoundConfigEnvironment, _ember) {

  /**
   * Controller for the login/logout view
   */
  exports['default'] = _ember['default'].Controller.extend({
    applicationController: _ember['default'].inject.controller('application'),

    apikey: _ember['default'].computed.alias('applicationController.apikey'),
    account: _ember['default'].computed.alias('applicationController.account'),
    loggedIn: _ember['default'].computed.alias('applicationController.loggedIn'),

    actions: {
      logout: function logout() {
        var _this = this;

        _ember['default'].$.ajax({
          type: 'GET',
          url: _coretheloothoundConfigEnvironment['default'].api + '/logout',
          headers: {
            Authorization: 'apikey ' + _this.get('apikey')
          },
          success: function success() {
            _this.get('storage').removeValue('apikey');
            _this.set('apikey', undefined);
            _this.set('account', undefined);
            _this.transitionToRoute('index');
          }
        });
      }
    }
  });
});
define('coretheloothound/controllers/characters/index', ['exports', 'ember', 'coretheloothound/config/environment'], function (exports, _ember, _coretheloothoundConfigEnvironment) {

  /* global _ */
  exports['default'] = _ember['default'].Controller.extend({
    realm: 'All',
    onlyMax: true,

    init: function init() {
      this.set('realm', window.localStorage.getItem('coretheloothound_realm') || 'All');
    },

    updateRealm: _ember['default'].observer('realm', function () {
      var realm = this.get('realm');

      if (realm) {
        window.localStorage.setItem('coretheloothound_realm', realm);
      }
    }),

    realms: _ember['default'].computed('model.[].realm', function () {
      return ['All'].concat(_.uniq(this.get('model').mapBy('realm')).sort());
    }),

    characterSorting: ['level:desc', 'name'],
    sorted: _ember['default'].computed.sort('model', 'characterSorting'),

    filtered: _ember['default'].computed('sorted', 'onlyMax', 'realm', function () {
      var realm = this.get('realm');
      var onlyMax = this.get('onlyMax');

      return this.get('sorted').filter(function (character) {
        if (onlyMax && character.get('level') < _coretheloothoundConfigEnvironment['default'].maxLevel) {
          return false;
        }

        if (!realm || realm === 'All') {
          return true;
        } else {
          return realm === character.get('realm');
        }
      });
    }),

    actions: {
      changeRealm: function changeRealm(realm) {
        this.set('realm', realm);
      }
    }
  });
});
define('coretheloothound/controllers/raid', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Controller.extend({
    indexController: _ember['default'].inject.controller('raids/index'),
    applicationController: _ember['default'].inject.controller('application'),
    currentAccount: _ember['default'].computed.alias('applicationController.account'),
    roles: _ember['default'].computed.alias('indexController.roles'),
    rolesSorting: ['slug:desc'],
    sortedRoles: _ember['default'].computed.sort('roles', 'rolesSorting'),

    seatedByRole: _ember['default'].computed('sortedRoles.[].id', 'seated.[].role', function () {
      var _this = this;

      return this.get('sortedRoles').map(function (role) {
        return _ember['default'].Object.create({
          role: role,
          signups: _this.get('seated').filterBy('role.id', role.get('id'))
        });
      });
    }),

    characters: _ember['default'].computed('currentAccount.characters', 'signedUpCharacterIds', function () {
      var ids = this.get('signedUpCharacterIds');
      return this.get('currentAccount.characters').filter(function (character) {
        return !ids.includes(character.get('id'));
      }).sort(function (a, b) {
        var diff = b.get('level') - a.get('level');
        if (diff) {
          return diff;
        } else {
          return a.get('name').localeCompare(b.get('name'));
        }
      });
    })
  });
});
define('coretheloothound/controllers/raid/index', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Controller.extend({
    indexController: _ember['default'].inject.controller('raids/index'),
    applicationController: _ember['default'].inject.controller('application'),
    currentAccount: _ember['default'].computed.alias('applicationController.account'),
    roles: _ember['default'].computed.alias('indexController.roles'),
    rolesSorting: ['slug:desc'],
    sortedRoles: _ember['default'].computed.sort('roles', 'rolesSorting'),

    seatedByRole: _ember['default'].computed('sortedRoles.[].id', 'model.seated.[].role', function () {
      var _this = this;

      return this.get('sortedRoles').map(function (role) {
        return _ember['default'].Object.create({
          role: role,
          signups: _this.get('model.seated').filterBy('role.id', role.get('id'))
        });
      });
    }),

    currentAccountSeated: _ember['default'].computed('model.seated.[].character', 'currentAccount.id', function () {
      var accountId = this.get('currentAccount.id').toString();
      return this.get('model.seated').findBy('character.account.id', accountId);
    }),

    currentAccountSignedUp: _ember['default'].computed('model.signups.[].character', 'currentAccount.id', function () {
      var accountId = this.get('currentAccount.id').toString();
      return this.get('model.signups').filterBy('character.account.id', accountId);
    }),

    characters: _ember['default'].computed('currentAccount.characters', 'model.signedUpCharacterIds', function () {
      var ids = this.get('model.signedUpCharacterIds');
      return this.get('currentAccount.characters').filter(function (character) {
        return !ids.includes(character.get('id'));
      }).sort(function (a, b) {
        var diff = b.get('level') - a.get('level');
        if (diff) {
          return diff;
        } else {
          return a.get('name').localeCompare(b.get('name'));
        }
      });
    }),

    actions: {
      seat: function seat(signup, role) {
        signup.set('seated', true);
        signup.set('role', role);
        signup.save();
      },

      unseat: function unseat(signup) {
        signup.set('seated', false);
        signup.save();
      },

      unsignup: function unsignup(signup) {
        signup.destroyRecord();
      }
    }
  });
});
define('coretheloothound/controllers/raids/index', ['exports', 'ember'], function (exports, _ember) {

  /* global moment */
  exports['default'] = _ember['default'].Controller.extend({
    applicationController: _ember['default'].inject.controller('application'),
    currentAccount: _ember['default'].computed.alias('applicationController.account'),

    raidSorting: ['date', 'name'],

    filteredRaids: _ember['default'].computed('model.[]', function () {
      return this.get('model').filter(function (raid) {
        return moment(raid.get('date')).add(6, 'hours').isAfter();
      });
    }),

    sortedRaids: _ember['default'].computed.sort('filteredRaids', 'raidSorting')
  });
});
define('coretheloothound/controllers/raids/new', ['exports', 'ember'], function (exports, _ember) {

  /* global moment */
  exports['default'] = _ember['default'].Controller.extend({
    applicationController: _ember['default'].inject.controller('application'),
    account: _ember['default'].computed.alias('applicationController.account'),

    init: function init() {
      this._super();
      this.set('name', '');
      this.set('date', moment().endOf('isoWeek').hour(19).minute(0).second(0).add(2, 'days').toDate());
      this.set('hidden', true);
    },

    actions: {
      create: function create() {
        var _this = this;

        var raid = this.store.createRecord('raid', {
          name: this.get('name'),
          guild: this.get('guild'),
          date: this.get('date'),
          hidden: this.get('hidden')
        });

        raid.save().then(function (raid) {
          _this.init();
          _this.transitionToRoute('raid', raid);
        });
      }
    }
  });
});
define('coretheloothound/controllers/role', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Controller.extend({
    number: _ember['default'].computed('parentController.seated.[].role', function () {
      var id = this.get('id');
      return this.get('parentController.seated').filter(function (signup) {
        return signup.get('role.id') === id;
      }).get('length');
    }),

    statClasses: _ember['default'].computed('iconClasses', function () {
      return 'stat ' + this.get('iconClasses');
    }),

    iconClasses: _ember['default'].computed('slug', function () {
      return 'role ' + this.get('slug');
    })
  });
});
define('coretheloothound/helpers/and', ['exports', 'ember', 'ember-truth-helpers/helpers/and'], function (exports, _ember, _emberTruthHelpersHelpersAnd) {

  var forExport = null;

  if (_ember['default'].Helper) {
    forExport = _ember['default'].Helper.helper(_emberTruthHelpersHelpersAnd.andHelper);
  } else if (_ember['default'].HTMLBars.makeBoundHelper) {
    forExport = _ember['default'].HTMLBars.makeBoundHelper(_emberTruthHelpersHelpersAnd.andHelper);
  }

  exports['default'] = forExport;
});
define('coretheloothound/helpers/character-class', ['exports', 'ember'], function (exports, _ember) {
  exports.characterClass = characterClass;

  function characterClass(class_id) {
    var classes = {
      1: 'Warrior',
      2: 'Paladin',
      3: 'Hunter',
      4: 'Rogue',
      5: 'Priest',
      6: 'Death Knight',
      7: 'Shaman',
      8: 'Mage',
      9: 'Warlock',
      10: 'Monk',
      11: 'Druid',
      12: 'Demon Hunter'
    };

    return new _ember['default'].String.htmlSafe('<span class="class-' + class_id + '">' + classes[class_id] + '</span>');
  }

  exports['default'] = _ember['default'].Helper.helper(characterClass);
});
define('coretheloothound/helpers/character-faction', ['exports', 'ember'], function (exports, _ember) {
  exports.characterFaction = characterFaction;

  function characterFaction(race_id) {
    switch (race_id) {
      case 1:
      case 3:
      case 4:
      case 7:
      case 11:
      case 22:
      case 25:
        return 'Alliance';
      case 2:
      case 5:
      case 6:
      case 8:
      case 9:
      case 10:
      case 26:
        return 'Horde';
      case 24:
        return 'Neutral';
      default:
        return 'Neutral';
    }
  }

  exports['default'] = _ember['default'].Helper.helper(characterFaction);
});
define('coretheloothound/helpers/character-race', ['exports', 'ember'], function (exports, _ember) {
  exports.characterRace = characterRace;

  function characterRace(race_id) {
    var faction = function faction(race_id) {
      switch (race_id) {
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

    return new _ember['default'].String.htmlSafe('<span class="' + faction(race_id) + '">' + races[race_id] + '</span>');
  }

  exports['default'] = _ember['default'].Helper.helper(characterRace);
});
define('coretheloothound/helpers/eq', ['exports', 'ember', 'ember-truth-helpers/helpers/equal'], function (exports, _ember, _emberTruthHelpersHelpersEqual) {

  var forExport = null;

  if (_ember['default'].Helper) {
    forExport = _ember['default'].Helper.helper(_emberTruthHelpersHelpersEqual.equalHelper);
  } else if (_ember['default'].HTMLBars.makeBoundHelper) {
    forExport = _ember['default'].HTMLBars.makeBoundHelper(_emberTruthHelpersHelpersEqual.equalHelper);
  }

  exports['default'] = forExport;
});
define('coretheloothound/helpers/gt', ['exports', 'ember', 'ember-truth-helpers/helpers/gt'], function (exports, _ember, _emberTruthHelpersHelpersGt) {

  var forExport = null;

  if (_ember['default'].Helper) {
    forExport = _ember['default'].Helper.helper(_emberTruthHelpersHelpersGt.gtHelper);
  } else if (_ember['default'].HTMLBars.makeBoundHelper) {
    forExport = _ember['default'].HTMLBars.makeBoundHelper(_emberTruthHelpersHelpersGt.gtHelper);
  }

  exports['default'] = forExport;
});
define('coretheloothound/helpers/gte', ['exports', 'ember', 'ember-truth-helpers/helpers/gte'], function (exports, _ember, _emberTruthHelpersHelpersGte) {

  var forExport = null;

  if (_ember['default'].Helper) {
    forExport = _ember['default'].Helper.helper(_emberTruthHelpersHelpersGte.gteHelper);
  } else if (_ember['default'].HTMLBars.makeBoundHelper) {
    forExport = _ember['default'].HTMLBars.makeBoundHelper(_emberTruthHelpersHelpersGte.gteHelper);
  }

  exports['default'] = forExport;
});
define('coretheloothound/helpers/is-array', ['exports', 'ember', 'ember-truth-helpers/helpers/is-array'], function (exports, _ember, _emberTruthHelpersHelpersIsArray) {

  var forExport = null;

  if (_ember['default'].Helper) {
    forExport = _ember['default'].Helper.helper(_emberTruthHelpersHelpersIsArray.isArrayHelper);
  } else if (_ember['default'].HTMLBars.makeBoundHelper) {
    forExport = _ember['default'].HTMLBars.makeBoundHelper(_emberTruthHelpersHelpersIsArray.isArrayHelper);
  }

  exports['default'] = forExport;
});
define('coretheloothound/helpers/lt', ['exports', 'ember', 'ember-truth-helpers/helpers/lt'], function (exports, _ember, _emberTruthHelpersHelpersLt) {

  var forExport = null;

  if (_ember['default'].Helper) {
    forExport = _ember['default'].Helper.helper(_emberTruthHelpersHelpersLt.ltHelper);
  } else if (_ember['default'].HTMLBars.makeBoundHelper) {
    forExport = _ember['default'].HTMLBars.makeBoundHelper(_emberTruthHelpersHelpersLt.ltHelper);
  }

  exports['default'] = forExport;
});
define('coretheloothound/helpers/lte', ['exports', 'ember', 'ember-truth-helpers/helpers/lte'], function (exports, _ember, _emberTruthHelpersHelpersLte) {

  var forExport = null;

  if (_ember['default'].Helper) {
    forExport = _ember['default'].Helper.helper(_emberTruthHelpersHelpersLte.lteHelper);
  } else if (_ember['default'].HTMLBars.makeBoundHelper) {
    forExport = _ember['default'].HTMLBars.makeBoundHelper(_emberTruthHelpersHelpersLte.lteHelper);
  }

  exports['default'] = forExport;
});
define('coretheloothound/helpers/not-eq', ['exports', 'ember', 'ember-truth-helpers/helpers/not-equal'], function (exports, _ember, _emberTruthHelpersHelpersNotEqual) {

  var forExport = null;

  if (_ember['default'].Helper) {
    forExport = _ember['default'].Helper.helper(_emberTruthHelpersHelpersNotEqual.notEqualHelper);
  } else if (_ember['default'].HTMLBars.makeBoundHelper) {
    forExport = _ember['default'].HTMLBars.makeBoundHelper(_emberTruthHelpersHelpersNotEqual.notEqualHelper);
  }

  exports['default'] = forExport;
});
define('coretheloothound/helpers/not', ['exports', 'ember', 'ember-truth-helpers/helpers/not'], function (exports, _ember, _emberTruthHelpersHelpersNot) {

  var forExport = null;

  if (_ember['default'].Helper) {
    forExport = _ember['default'].Helper.helper(_emberTruthHelpersHelpersNot.notHelper);
  } else if (_ember['default'].HTMLBars.makeBoundHelper) {
    forExport = _ember['default'].HTMLBars.makeBoundHelper(_emberTruthHelpersHelpersNot.notHelper);
  }

  exports['default'] = forExport;
});
define('coretheloothound/helpers/or', ['exports', 'ember', 'ember-truth-helpers/helpers/or'], function (exports, _ember, _emberTruthHelpersHelpersOr) {

  var forExport = null;

  if (_ember['default'].Helper) {
    forExport = _ember['default'].Helper.helper(_emberTruthHelpersHelpersOr.orHelper);
  } else if (_ember['default'].HTMLBars.makeBoundHelper) {
    forExport = _ember['default'].HTMLBars.makeBoundHelper(_emberTruthHelpersHelpersOr.orHelper);
  }

  exports['default'] = forExport;
});
define('coretheloothound/helpers/pluralize', ['exports', 'ember-inflector/lib/helpers/pluralize'], function (exports, _emberInflectorLibHelpersPluralize) {
  exports['default'] = _emberInflectorLibHelpersPluralize['default'];
});
define('coretheloothound/helpers/singularize', ['exports', 'ember-inflector/lib/helpers/singularize'], function (exports, _emberInflectorLibHelpersSingularize) {
  exports['default'] = _emberInflectorLibHelpersSingularize['default'];
});
define('coretheloothound/helpers/xor', ['exports', 'ember', 'ember-truth-helpers/helpers/xor'], function (exports, _ember, _emberTruthHelpersHelpersXor) {

  var forExport = null;

  if (_ember['default'].Helper) {
    forExport = _ember['default'].Helper.helper(_emberTruthHelpersHelpersXor.xorHelper);
  } else if (_ember['default'].HTMLBars.makeBoundHelper) {
    forExport = _ember['default'].HTMLBars.makeBoundHelper(_emberTruthHelpersHelpersXor.xorHelper);
  }

  exports['default'] = forExport;
});
define('coretheloothound/initializers/app-version', ['exports', 'ember-cli-app-version/initializer-factory', 'coretheloothound/config/environment'], function (exports, _emberCliAppVersionInitializerFactory, _coretheloothoundConfigEnvironment) {
  exports['default'] = {
    name: 'App Version',
    initialize: (0, _emberCliAppVersionInitializerFactory['default'])(_coretheloothoundConfigEnvironment['default'].APP.name, _coretheloothoundConfigEnvironment['default'].APP.version)
  };
});
define('coretheloothound/initializers/container-debug-adapter', ['exports', 'ember-resolver/container-debug-adapter'], function (exports, _emberResolverContainerDebugAdapter) {
  exports['default'] = {
    name: 'container-debug-adapter',

    initialize: function initialize() {
      var app = arguments[1] || arguments[0];

      app.register('container-debug-adapter:main', _emberResolverContainerDebugAdapter['default']);
      app.inject('container-debug-adapter:main', 'namespace', 'application:main');
    }
  };
});
define('coretheloothound/initializers/data-adapter', ['exports', 'ember'], function (exports, _ember) {

  /*
    This initializer is here to keep backwards compatibility with code depending
    on the `data-adapter` initializer (before Ember Data was an addon).
  
    Should be removed for Ember Data 3.x
  */

  exports['default'] = {
    name: 'data-adapter',
    before: 'store',
    initialize: _ember['default'].K
  };
});
define('coretheloothound/initializers/ember-data', ['exports', 'ember-data/setup-container', 'ember-data/-private/core'], function (exports, _emberDataSetupContainer, _emberDataPrivateCore) {

  /*
  
    This code initializes Ember-Data onto an Ember application.
  
    If an Ember.js developer defines a subclass of DS.Store on their application,
    as `App.StoreService` (or via a module system that resolves to `service:store`)
    this code will automatically instantiate it and make it available on the
    router.
  
    Additionally, after an application's controllers have been injected, they will
    each have the store made available to them.
  
    For example, imagine an Ember.js application with the following classes:
  
    App.StoreService = DS.Store.extend({
      adapter: 'custom'
    });
  
    App.PostsController = Ember.ArrayController.extend({
      // ...
    });
  
    When the application is initialized, `App.ApplicationStore` will automatically be
    instantiated, and the instance of `App.PostsController` will have its `store`
    property set to that instance.
  
    Note that this code will only be run if the `ember-application` package is
    loaded. If Ember Data is being used in an environment other than a
    typical application (e.g., node.js where only `ember-runtime` is available),
    this code will be ignored.
  */

  exports['default'] = {
    name: 'ember-data',
    initialize: _emberDataSetupContainer['default']
  };
});
define('coretheloothound/initializers/export-application-global', ['exports', 'ember', 'coretheloothound/config/environment'], function (exports, _ember, _coretheloothoundConfigEnvironment) {
  exports.initialize = initialize;

  function initialize() {
    var application = arguments[1] || arguments[0];
    if (_coretheloothoundConfigEnvironment['default'].exportApplicationGlobal !== false) {
      var value = _coretheloothoundConfigEnvironment['default'].exportApplicationGlobal;
      var globalName;

      if (typeof value === 'string') {
        globalName = value;
      } else {
        globalName = _ember['default'].String.classify(_coretheloothoundConfigEnvironment['default'].modulePrefix);
      }

      if (!window[globalName]) {
        window[globalName] = application;

        application.reopen({
          willDestroy: function willDestroy() {
            this._super.apply(this, arguments);
            delete window[globalName];
          }
        });
      }
    }
  }

  exports['default'] = {
    name: 'export-application-global',

    initialize: initialize
  };
});
define('coretheloothound/initializers/injectStore', ['exports', 'ember'], function (exports, _ember) {

  /*
    This initializer is here to keep backwards compatibility with code depending
    on the `injectStore` initializer (before Ember Data was an addon).
  
    Should be removed for Ember Data 3.x
  */

  exports['default'] = {
    name: 'injectStore',
    before: 'store',
    initialize: _ember['default'].K
  };
});
define('coretheloothound/initializers/link-component', ['exports', 'ember'], function (exports, _ember) {
  exports.initialize = initialize;

  function initialize() {
    _ember['default'].LinkComponent.reopen({
      attributeBindings: ['data-content', 'data-toggle']
    });
  }

  exports['default'] = {
    name: 'link-component',
    initialize: initialize
  };
});
define("coretheloothound/initializers/liquid-fire", ["exports", "liquid-fire/ember-internals"], function (exports, _liquidFireEmberInternals) {
  (0, _liquidFireEmberInternals.registerKeywords)();

  exports["default"] = {
    name: 'liquid-fire',
    initialize: function initialize() {}
  };
});
// This initializer exists only to make sure that the following
// imports happen before the app boots.
define('coretheloothound/initializers/storage', ['exports'], function (exports) {
  exports.initialize = initialize;

  function initialize(application) {
    application.inject('route', 'storage', 'model:storage');
    application.inject('controller', 'storage', 'model:storage');
    application.inject('adapter', 'storage', 'model:storage');
  }

  exports['default'] = {
    name: 'storage',
    initialize: initialize
  };
});
define('coretheloothound/initializers/store', ['exports', 'ember'], function (exports, _ember) {

  /*
    This initializer is here to keep backwards compatibility with code depending
    on the `store` initializer (before Ember Data was an addon).
  
    Should be removed for Ember Data 3.x
  */

  exports['default'] = {
    name: 'store',
    after: 'ember-data',
    initialize: _ember['default'].K
  };
});
define('coretheloothound/initializers/transforms', ['exports', 'ember'], function (exports, _ember) {

  /*
    This initializer is here to keep backwards compatibility with code depending
    on the `transforms` initializer (before Ember Data was an addon).
  
    Should be removed for Ember Data 3.x
  */

  exports['default'] = {
    name: 'transforms',
    before: 'store',
    initialize: _ember['default'].K
  };
});
define('coretheloothound/initializers/truth-helpers', ['exports', 'ember', 'ember-truth-helpers/utils/register-helper', 'ember-truth-helpers/helpers/and', 'ember-truth-helpers/helpers/or', 'ember-truth-helpers/helpers/equal', 'ember-truth-helpers/helpers/not', 'ember-truth-helpers/helpers/is-array', 'ember-truth-helpers/helpers/not-equal', 'ember-truth-helpers/helpers/gt', 'ember-truth-helpers/helpers/gte', 'ember-truth-helpers/helpers/lt', 'ember-truth-helpers/helpers/lte'], function (exports, _ember, _emberTruthHelpersUtilsRegisterHelper, _emberTruthHelpersHelpersAnd, _emberTruthHelpersHelpersOr, _emberTruthHelpersHelpersEqual, _emberTruthHelpersHelpersNot, _emberTruthHelpersHelpersIsArray, _emberTruthHelpersHelpersNotEqual, _emberTruthHelpersHelpersGt, _emberTruthHelpersHelpersGte, _emberTruthHelpersHelpersLt, _emberTruthHelpersHelpersLte) {
  exports.initialize = initialize;

  function initialize() /* container, application */{

    // Do not register helpers from Ember 1.13 onwards, starting from 1.13 they
    // will be auto-discovered.
    if (_ember['default'].Helper) {
      return;
    }

    (0, _emberTruthHelpersUtilsRegisterHelper.registerHelper)('and', _emberTruthHelpersHelpersAnd.andHelper);
    (0, _emberTruthHelpersUtilsRegisterHelper.registerHelper)('or', _emberTruthHelpersHelpersOr.orHelper);
    (0, _emberTruthHelpersUtilsRegisterHelper.registerHelper)('eq', _emberTruthHelpersHelpersEqual.equalHelper);
    (0, _emberTruthHelpersUtilsRegisterHelper.registerHelper)('not', _emberTruthHelpersHelpersNot.notHelper);
    (0, _emberTruthHelpersUtilsRegisterHelper.registerHelper)('is-array', _emberTruthHelpersHelpersIsArray.isArrayHelper);
    (0, _emberTruthHelpersUtilsRegisterHelper.registerHelper)('not-eq', _emberTruthHelpersHelpersNotEqual.notEqualHelper);
    (0, _emberTruthHelpersUtilsRegisterHelper.registerHelper)('gt', _emberTruthHelpersHelpersGt.gtHelper);
    (0, _emberTruthHelpersUtilsRegisterHelper.registerHelper)('gte', _emberTruthHelpersHelpersGte.gteHelper);
    (0, _emberTruthHelpersUtilsRegisterHelper.registerHelper)('lt', _emberTruthHelpersHelpersLt.ltHelper);
    (0, _emberTruthHelpersUtilsRegisterHelper.registerHelper)('lte', _emberTruthHelpersHelpersLte.lteHelper);
  }

  exports['default'] = {
    name: 'truth-helpers',
    initialize: initialize
  };
});
define("coretheloothound/instance-initializers/ember-data", ["exports", "ember-data/-private/instance-initializers/initialize-store-service"], function (exports, _emberDataPrivateInstanceInitializersInitializeStoreService) {
  exports["default"] = {
    name: "ember-data",
    initialize: _emberDataPrivateInstanceInitializersInitializeStoreService["default"]
  };
});
define('coretheloothound/models/account', ['exports', 'ember-data'], function (exports, _emberData) {
  exports['default'] = _emberData['default'].Model.extend({
    accountId: _emberData['default'].attr('string'),
    battletag: _emberData['default'].attr('string'),
    characters: _emberData['default'].hasMany('character', {
      async: false
    }),
    raids: _emberData['default'].hasMany('raid', {
      async: false
    })
  });
});
define('coretheloothound/models/character', ['exports', 'ember', 'ember-data'], function (exports, _ember, _emberData) {
  exports['default'] = _emberData['default'].Model.extend({
    name: _emberData['default'].attr('string'),
    realm: _emberData['default'].attr('string'),

    level: _emberData['default'].attr('number'),
    item_level: _emberData['default'].attr('number'),

    class_id: _emberData['default'].attr('number'),
    race_id: _emberData['default'].attr('number'),
    gender_id: _emberData['default'].attr('number'),

    image_url: _emberData['default'].attr('string'),

    account: _emberData['default'].belongsTo('account', {
      async: false
    }),
    guild: _emberData['default'].belongsTo('guild', {
      async: false
    }),
    signups: _emberData['default'].hasMany('signup', {
      async: false
    }),
    roles: _emberData['default'].hasMany('role', {
      async: false
    }),

    dashedName: _ember['default'].computed('name', function () {
      return this.get('name').dasherize();
    }),

    dashedRealm: _ember['default'].computed('realm', function () {
      return this.get('realm').dasherize();
    }),

    className: _ember['default'].computed('class_id', function () {
      switch (this.get('class_id')) {
        case 1:
          return 'Warrior';
        case 2:
          return 'Paladin';
        case 3:
          return 'Hunter';
        case 4:
          return 'Rogue';
        case 5:
          return 'Priest';
        case 6:
          return 'Death Knight';
        case 7:
          return 'Shaman';
        case 8:
          return 'Mage';
        case 9:
          return 'Warlock';
        case 10:
          return 'Monk';
        case 11:
          return 'Druid';
        case 12:
          return 'Demon Hunter';
        default:
          return '';
      }
    }),

    label: _ember['default'].computed('level', 'className', 'name', 'realm', function () {
      return this.get('level') + ': ' + this.get('name') + ' - ' + this.get('className') + ' - ' + this.get('realm');
    }),
    armoryUrl: _ember['default'].computed('dashedName', 'dashedRealm', function () {
      return 'http://us.battle.net/wow/character/' + this.get('dashedRealm') + '/' + this.get('dashedName') + '/simple';
    }),

    robotUrl: _ember['default'].computed('dashedName', 'dashedRealm', function () {
      return 'http://www.askmrrobot.com/wow/gear/us/' + this.get('dashedRealm') + '/' + this.get('dashedName');
    }),

    wowheadUrl: _ember['default'].computed('dashedName', 'dashedRealm', function () {
      return 'http://www.wowhead.com/list/us-' + this.get('dashedRealm') + '-' + this.get('dashedName');
    })
  });
});
define('coretheloothound/models/guild', ['exports', 'ember', 'ember-data'], function (exports, _ember, _emberData) {

  /* global _ */
  exports['default'] = _emberData['default'].Model.extend({
    name: _emberData['default'].attr('string'),
    realm: _emberData['default'].attr('string'),

    icon: _emberData['default'].attr('number'),
    border: _emberData['default'].attr('number'),

    iconPadded: _ember['default'].computed('icon', function () {
      var icon = this.get('icon');
      return _.pad(icon, 2, '0');
    }),

    iconColor: _emberData['default'].attr('string'),
    borderColor: _emberData['default'].attr('string'),
    backgroundColor: _emberData['default'].attr('string'),

    iconHexColor: _ember['default'].computed('iconColor', function () {
      return '#' + this.get('iconColor').substring(2, 8);
    }),

    borderHexColor: _ember['default'].computed('borderColor', function () {
      return '#' + this.get('borderColor').substring(2, 8);
    }),

    backgroundHexColor: _ember['default'].computed('backgroundColor', function () {
      return '#' + this.get('backgroundColor').substring(2, 8);
    }),

    characters: _emberData['default'].hasMany('character', {
      async: false
    }),

    fullName: _ember['default'].computed('name', 'realm', function () {
      return this.get('name') + ' - ' + this.get('realm');
    }),

    url: _ember['default'].computed('name', 'realm', function () {
      return 'http://us.battle.net/wow/guild/' + encodeURIComponent(this.get('realm')) + '/' + encodeURIComponent(this.get('name')) + '/';
    })
  });
});
define('coretheloothound/models/permission', ['exports', 'ember', 'ember-data'], function (exports, _ember, _emberData) {
  exports['default'] = _emberData['default'].Model.extend({
    permissioned: _emberData['default'].belongsTo('permissioned', {
      polymorphic: true,
      async: false
    }),
    level: _emberData['default'].attr('string'),
    key: _emberData['default'].attr('string'),

    type: _ember['default'].computed('key', function () {
      return this.get('key').split('|')[0];
    }),

    args: _ember['default'].computed('key', function () {
      return this.get('key').split('|')[1];
    }),

    name: _ember['default'].computed('args', function () {
      return this.get('args').split(':')[0];
    }),

    realm: _ember['default'].computed('args', function () {
      return this.get('args').split(':')[1];
    })
  });
});
define('coretheloothound/models/permissioned', ['exports', 'ember-data'], function (exports, _emberData) {
  exports['default'] = _emberData['default'].Model.extend({
    permissions: _emberData['default'].hasMany('permission', {
      async: false
    })
  });
});
define('coretheloothound/models/raid', ['exports', 'ember-data', 'ember', 'coretheloothound/models/permissioned'], function (exports, _emberData, _ember, _coretheloothoundModelsPermissioned) {

  /* global moment */
  exports['default'] = _coretheloothoundModelsPermissioned['default'].extend({
    name: _emberData['default'].attr('string'),
    date: _emberData['default'].attr('date'),
    note: _emberData['default'].attr('string'),
    account: _emberData['default'].belongsTo('account', {
      async: false
    }),
    groups: _emberData['default'].attr(),
    admin: _emberData['default'].attr(),
    guild: _emberData['default'].belongsTo('guild', {
      async: false
    }),
    signups: _emberData['default'].hasMany('signup', {
      async: false
    }),
    finalized: _emberData['default'].attr(),
    hidden: _emberData['default'].attr(),

    moreThanOneGroup: _ember['default'].computed('groups.number', function () {
      return this.get('groups.number') > 1;
    }),

    signedUpCharacterIds: _ember['default'].computed('signups.[].character', function () {
      return this.get('signups').mapBy('character.id');
    }),

    hiddenAndNotFinalized: _ember['default'].computed('hidden', 'finalized', function () {
      return this.get('hidden') && !this.get('finalized');
    }),

    dateAgo: _ember['default'].computed('date', function () {
      return moment(this.get('date')).fromNow();
    }),

    dateCalendar: _ember['default'].computed('date', function () {
      return moment(this.get('date')).calendar();
    }),

    accountSignups: _ember['default'].computed('signups.[].character', function () {
      return this.get('signups').mapBy('character.account.id').uniq().get('length');
    }),

    accountWaitingList: _ember['default'].computed('waitingList.[].character', function () {
      return this.get('waitingList').mapBy('character.account.id').uniq().get('length');
    }),

    accountSeated: _ember['default'].computed('seated.[].character', function () {
      return this.get('seated').mapBy('character.account.id').uniq().get('length');
    }),

    totalSlots: _ember['default'].computed('groups', function () {
      var groups = this.get('groups');
      return groups.size * groups.number;
    }),

    className: function className(class_id) {
      switch (class_id) {
        case 1:
          return 'Warrior';
        case 2:
          return 'Paladin';
        case 3:
          return 'Hunter';
        case 4:
          return 'Rogue';
        case 5:
          return 'Priest';
        case 6:
          return 'Death Knight';
        case 7:
          return 'Shaman';
        case 8:
          return 'Mage';
        case 9:
          return 'Warlock';
        case 10:
          return 'Monk';
        case 11:
          return 'Druid';
        default:
          return '';
      }
    },

    hasWaitingList: _ember['default'].computed('waitingList.length', function () {
      return this.get('waitingList.length') > 0;
    }),

    hasSeated: _ember['default'].computed('seated.length', function () {
      return this.get('seated.length') > 0;
    }),

    seatedUnsorted: _ember['default'].computed.filterBy('signups', 'seated', true),
    seatedSortFields: ['name'],
    seated: _ember['default'].computed.sort('seatedUnsorted', 'seatedSortFields'),
    unseated: _ember['default'].computed.filterBy('signups', 'seated', false),

    // Waiting list doesn't include anyone from an account that has been seated
    waitingList: _ember['default'].computed('seated.[].character', 'unseated.[].character', function () {
      var seated = this.get('seated');
      var unseated = this.get('unseated');
      var account_ids = seated.mapBy('character.account.id').uniq();
      return unseated.filter(function (signup) {
        return !account_ids.includes(signup.get('character.account.id'));
      }).sortBy('character.account.battletag');
    }),

    waitingListByAccount: _ember['default'].computed('waitingList.[].account', function () {
      var _this = this;

      return this.get('waitingList').mapBy('character.account').uniq().map(function (account) {
        return _ember['default'].Object.create({
          account: account,
          signups: _this.get('waitingList').filterBy('character.account.id', account.get('id'))
        });
      });
    })
  });
});
define('coretheloothound/models/role', ['exports', 'ember', 'ember-data'], function (exports, _ember, _emberData) {
  exports['default'] = _emberData['default'].Model.extend({
    name: _emberData['default'].attr(),
    slug: _emberData['default'].attr(),
    icon: _emberData['default'].attr(),
    class_ids: _emberData['default'].attr(),

    iconClasses: _ember['default'].computed('slug', function () {
      return 'role ' + this.get('slug');
    })
  });
});
define('coretheloothound/models/signup', ['exports', 'ember-data'], function (exports, _emberData) {
  exports['default'] = _emberData['default'].Model.extend({
    raid: _emberData['default'].belongsTo('raid', {
      async: false
    }),
    character: _emberData['default'].belongsTo('character', {
      async: false
    }),
    role: _emberData['default'].belongsTo('role', {
      async: false
    }),
    roles: _emberData['default'].hasMany('role', {
      async: false
    }),
    seated: _emberData['default'].attr(),
    preferred: _emberData['default'].attr(),
    note: _emberData['default'].attr()
  });
});
define('coretheloothound/models/storage', ['exports', 'ember'], function (exports, _ember) {

  /**
   * # Storage.js
   *
   * This model is meant to be injected in all of the controllers and routes. It
   * allows an abstraction for any data meant to be stored on the client.
   *
   * It attempts to use [local storage](http://diveintohtml5.info/storage.html)
   * and falls back to [cookies](https://github.com/carhartl/jquery-cookie). Local
   * storage is preferred as this data doesn't need to be sent to the server.
   *
   * ## Installation
   *
   * It can be injected with the following code:
   *
   * ``` javascript
   * Ember.Application.initializer({
   *   name: 'storage',
   *   initialize: function(container, application){
   *     application.register('service:storage', window.App.Storage);
   *     application.inject('route', 'storage', 'service:storage');
   *     application.inject('controller', 'storage', 'service:storage');
   *   }
   * });
   * ```
   *
   * ## Usage
   *
   * Once injected it can be used as follows:
   *
   * ``` javascript
   * var item = this.get('storage').getValue('item');
   * this.get('storage').setValue('item', 'newValue');
   * this.get('storage').removeValue('item');
   * ```
   */
  exports['default'] = _ember['default'].Object.extend({
    base: 'coretheloothound_',

    getValue: function getValue(key) {
      if (Modernizr.localstorage) {
        return window.localStorage.getItem(this.get('base') + key);
      } else {
        return _ember['default'].$.cookie(this.get('base') + key);
      }
    },

    setValue: function setValue(key, value) {
      if (Modernizr.localstorage) {
        window.localStorage.setItem(this.get('base') + key, value);
      } else {
        _ember['default'].$.cookie(this.get('base') + key, value);
      }
    },

    removeValue: function removeValue(key) {
      if (Modernizr.localstorage) {
        window.localStorage.removeItem(this.get('base') + key);
      } else {
        _ember['default'].$.removeCookie(this.get('base') + key);
      }
    }
  });
});
/* global Modernizr */
define('coretheloothound/resolver', ['exports', 'ember-resolver'], function (exports, _emberResolver) {
  exports['default'] = _emberResolver['default'];
});
define('coretheloothound/router', ['exports', 'ember', 'coretheloothound/config/environment'], function (exports, _ember, _coretheloothoundConfigEnvironment) {

  var Router = _ember['default'].Router.extend({
    location: _coretheloothoundConfigEnvironment['default'].locationType
  });

  Router.map(function () {
    // Login
    this.route('apikey', { path: '/apikey/:apikey' });

    // Raiding!
    this.route('raids', {
      resetNamespace: true
    }, function () {
      this.route('new');
    });
    this.route('raid', {
      path: '/raid/:raid_id',
      resetNamespace: true
    }, function () {
      this.route('edit');
    });

    // User Preference Pages
    this.route('account', {
      resetNamespace: true
    }, function () {
      this.route('characters', {
        resetNamespace: true
      }, function () {});
    });
  });

  exports['default'] = Router;
});
define('coretheloothound/routes/apikey', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({
    model: function model(params) {
      return params.apikey;
    },

    afterModel: function afterModel(apikey, transition) {
      this.get('storage').setValue('apikey', apikey);
      transition.send('loadUser');
      this.transitionTo('raids.index');
    }
  });
});
define('coretheloothound/routes/application', ['exports', 'coretheloothound/config/environment', 'ember'], function (exports, _coretheloothoundConfigEnvironment, _ember) {
  exports['default'] = _ember['default'].Route.extend({
    model: function model() {
      var _this = this;
      var apikey = this.get('storage').getValue('apikey');

      if (apikey) {
        return new _ember['default'].RSVP.Promise(function (resolve) {
          _ember['default'].$.ajax({
            type: 'GET',
            url: _coretheloothoundConfigEnvironment['default'].api + '/account',
            headers: {
              Accept: 'application/json+ember',
              Authorization: 'apikey ' + apikey
            },
            success: function success(data) {
              delete data.permissions;
              _this.store.pushPayload('account', data);

              var account = _this.store.peekRecord('account', data.account.id);
              resolve({
                apikey: apikey,
                account: account
              });
            },
            error: function error() {
              // Bad API key
              resolve({
                apikey: undefined,
                account: undefined
              });
            }
          });
        });
      } else {
        return {
          apikey: undefined,
          account: undefined
        };
      }
    },

    setupController: function setupController(controller, model) {
      controller.set('apikey', model.apikey);
      controller.set('account', model.account);
    },

    actions: {
      loadUser: function loadUser() {
        this.refresh();
      },

      login: function login() {
        _ember['default'].$.ajax({
          type: 'GET',
          url: _coretheloothoundConfigEnvironment['default'].api + '/login',
          headers: {
            Accept: 'application/json+ember'
          },
          data: {
            redirect: window.location.protocol + '//' + window.location.host + '/#/apikey/'
          },
          success: function success(data) {
            window.location = data.href;
          }
        });
      }
    }
  });
});
define('coretheloothound/routes/characters/index', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({
    model: function model() {
      return this.modelFor('application').account.get('characters');
    }
  });
});
define('coretheloothound/routes/raid', ['exports', 'ember'], function (exports, _ember) {

  /* global _ */
  exports['default'] = _ember['default'].Route.extend({
    model: function model(params) {
      return this.store.find('raid', params.raid_id);
    },

    setupController: function setupController(controller, model) {
      controller.set('model', model);
      controller.set('roles', this.store.peekAll('role'));
    },

    actions: {
      hide: function hide() {
        var raid = this.currentModel;
        raid.set('hidden', true);
        raid.save();
      },

      unhide: function unhide() {
        var raid = this.currentModel;
        raid.set('hidden', false);
        raid.save();
      },

      finalize: function finalize() {
        var raid = this.currentModel;
        raid.set('finalized', true);
        raid.save();
      },

      unfinalize: function unfinalize() {
        var raid = this.currentModel;
        raid.set('finalized', false);
        raid.save();
      },

      'delete': function _delete() {
        var _this = this;
        var raid = this.currentModel;
        if (window.confirm('Are you sure you want to delete "' + raid.get('name') + '"?')) {
          raid.destroyRecord().then(function () {
            _this.transitionTo('raids.index');
          });
        }
      },

      signup: function signup(character, note, role_ids) {
        var _this = this;
        var raid = this.currentModel;

        var signup = this.store.createRecord('signup', {
          character: character,
          note: note,
          raid: raid
        });

        _ember['default'].RSVP.all(_.map(role_ids, function (role_id) {
          return _this.store.peekRecord('role', role_id);
        })).then(function (roles) {
          return _.each(roles, function (role) {
            signup.get('roles').addObject(role);
          });
        }).then(function () {
          signup.save();
        });
      },

      newPermission: function newPermission(level, key) {
        var raid = this.currentModel;

        var permission = this.store.createRecord('permission', {
          level: level,
          key: key,
          permissioned: raid
        });

        permission.save();
      },

      deletePermission: function deletePermission(permission) {
        permission.destroyRecord();
      }
    }
  });
});
define('coretheloothound/routes/raid/index', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({
    model: function model() {
      return this.modelFor('raid');
    },

    setupController: function setupController(controller, model) {
      controller.set('model', model);
      controller.set('roles', this.store.peekAll('role'));
    }
  });
});
define('coretheloothound/routes/raids/index', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({
    model: function model() {
      return this.store.findAll('raid');
    },

    setupController: function setupController(controller, model) {
      controller.set('model', model);
      controller.set('roles', this.store.peekAll('role'));
    }
  });
});
define('coretheloothound/serializers/application', ['exports', 'ember', 'ember-data'], function (exports, _ember, _emberData) {
  exports['default'] = _emberData['default'].RESTSerializer.extend({
    isNewSerializerAPI: true,
    keyForAttribute: function keyForAttribute(attr) {
      return _ember['default'].String.underscore(attr);
    }
  });
});
define('coretheloothound/serializers/signup', ['exports', 'ember-data'], function (exports, _emberData) {
  exports['default'] = _emberData['default'].RESTSerializer.extend({
    isNewSerializerAPI: true,
    attrs: {
      roles: { serialize: 'ids' }
    }
  });
});
define('coretheloothound/services/ajax', ['exports', 'ember-ajax/services/ajax'], function (exports, _emberAjaxServicesAjax) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberAjaxServicesAjax['default'];
    }
  });
});
define("coretheloothound/services/liquid-fire-transitions", ["exports", "liquid-fire/transition-map"], function (exports, _liquidFireTransitionMap) {
  exports["default"] = _liquidFireTransitionMap["default"];
});
define("coretheloothound/templates/account", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "revision": "Ember@2.8.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 3,
            "column": 0
          }
        },
        "moduleName": "coretheloothound/templates/account.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("h1");
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(2);
        morphs[0] = dom.createMorphAt(dom.childAt(fragment, [0]), 0, 0);
        morphs[1] = dom.createMorphAt(fragment, 2, 2, contextualElement);
        return morphs;
      },
      statements: [["content", "account.battletag", ["loc", [null, [1, 4], [1, 25]]], 0, 0, 0, 0], ["content", "liquid-outlet", ["loc", [null, [2, 0], [2, 17]]], 0, 0, 0, 0]],
      locals: [],
      templates: []
    };
  })());
});
define("coretheloothound/templates/apikey", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "revision": "Ember@2.8.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 2,
            "column": 0
          }
        },
        "moduleName": "coretheloothound/templates/apikey.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
        dom.insertBoundary(fragment, 0);
        return morphs;
      },
      statements: [["content", "outlet", ["loc", [null, [1, 0], [1, 10]]], 0, 0, 0, 0]],
      locals: [],
      templates: []
    };
  })());
});
define("coretheloothound/templates/application", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      return {
        meta: {
          "revision": "Ember@2.8.1",
          "loc": {
            "source": null,
            "start": {
              "line": 16,
              "column": 8
            },
            "end": {
              "line": 20,
              "column": 8
            }
          },
          "moduleName": "coretheloothound/templates/application.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("          ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("p");
          var el2 = dom.createTextNode("\n            Currently using API Key: ");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n          ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(dom.childAt(fragment, [1]), 1, 1);
          return morphs;
        },
        statements: [["content", "apikey", ["loc", [null, [18, 37], [18, 47]]], 0, 0, 0, 0]],
        locals: [],
        templates: []
      };
    })();
    return {
      meta: {
        "revision": "Ember@2.8.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 35,
            "column": 0
          }
        },
        "moduleName": "coretheloothound/templates/application.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "class", "container");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("header");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3, "class", "wrapper");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("h1");
        var el5 = dom.createTextNode("Core the Loot Hound");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("footer");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3, "class", "wrapper");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("section");
        dom.setAttribute(el4, "class", "description");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("p");
        var el6 = dom.createTextNode("\n          Core the Loot Hound is an ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("a");
        dom.setAttribute(el6, "href", "http://emberjs.com/");
        var el7 = dom.createTextNode("Ember.js");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode(" front end to the\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("a");
        dom.setAttribute(el6, "href", "http://byfirebepurged.com");
        var el7 = dom.createTextNode("By Fire Be Purged");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode(" raid scheduling API.\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("p");
        var el6 = dom.createTextNode("\n          You can ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("a");
        dom.setAttribute(el6, "href", "http://docs.coretheloothound.com");
        var el7 = dom.createElement("span");
        dom.setAttribute(el7, "class", "octicon octicon-book");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode(" view the docs");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode(", help\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("a");
        dom.setAttribute(el6, "href", "http://code.coretheloothound.com");
        var el7 = dom.createElement("span");
        dom.setAttribute(el7, "class", "octicon octicon-git-branch");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode(" contribute");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode(", and\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("a");
        dom.setAttribute(el6, "href", "http://issues.coretheloothound.com");
        var el7 = dom.createElement("span");
        dom.setAttribute(el7, "class", "octicon octicon-issue-opened");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode(" open an issue");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode(" for any problems.\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("section");
        dom.setAttribute(el4, "class", "copyright");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("p");
        var el6 = dom.createTextNode("\n          © 2014 by Christopher Giroir <");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("a");
        dom.setAttribute(el6, "href", "mailto:kelsin@valefor.com");
        var el7 = dom.createTextNode("kelsin@valefor.com");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode(">\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element0 = dom.childAt(fragment, [0]);
        var morphs = new Array(3);
        morphs[0] = dom.createMorphAt(dom.childAt(element0, [1, 1]), 3, 3);
        morphs[1] = dom.createMorphAt(element0, 3, 3);
        morphs[2] = dom.createMorphAt(dom.childAt(element0, [5, 1, 1]), 3, 3);
        return morphs;
      },
      statements: [["inline", "render", ["auth"], [], ["loc", [null, [5, 6], [5, 23]]], 0, 0], ["content", "liquid-outlet", ["loc", [null, [8, 2], [8, 19]]], 0, 0, 0, 0], ["block", "if", [["get", "loggedIn", ["loc", [null, [16, 14], [16, 22]]], 0, 0, 0, 0]], [], 0, null, ["loc", [null, [16, 8], [20, 15]]]]],
      locals: [],
      templates: [child0]
    };
  })());
});
define("coretheloothound/templates/auth", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      return {
        meta: {
          "revision": "Ember@2.8.1",
          "loc": {
            "source": null,
            "start": {
              "line": 2,
              "column": 6
            },
            "end": {
              "line": 2,
              "column": 57
            }
          },
          "moduleName": "coretheloothound/templates/auth.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createElement("i");
          dom.setAttribute(el1, "class", "fa fa-home");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode(" Home");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() {
          return [];
        },
        statements: [],
        locals: [],
        templates: []
      };
    })();
    var child1 = (function () {
      var child0 = (function () {
        return {
          meta: {
            "revision": "Ember@2.8.1",
            "loc": {
              "source": null,
              "start": {
                "line": 4,
                "column": 8
              },
              "end": {
                "line": 4,
                "column": 62
              }
            },
            "moduleName": "coretheloothound/templates/auth.hbs"
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createElement("i");
            dom.setAttribute(el1, "class", "fa fa-trophy");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode(" Raids");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes() {
            return [];
          },
          statements: [],
          locals: [],
          templates: []
        };
      })();
      var child1 = (function () {
        return {
          meta: {
            "revision": "Ember@2.8.1",
            "loc": {
              "source": null,
              "start": {
                "line": 5,
                "column": 8
              },
              "end": {
                "line": 5,
                "column": 71
              }
            },
            "moduleName": "coretheloothound/templates/auth.hbs"
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createElement("i");
            dom.setAttribute(el1, "class", "fa fa-users");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode(" Characters");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes() {
            return [];
          },
          statements: [],
          locals: [],
          templates: []
        };
      })();
      return {
        meta: {
          "revision": "Ember@2.8.1",
          "loc": {
            "source": null,
            "start": {
              "line": 3,
              "column": 2
            },
            "end": {
              "line": 12,
              "column": 2
            }
          },
          "moduleName": "coretheloothound/templates/auth.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("li");
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("li");
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("li");
          var el2 = dom.createElement("i");
          dom.setAttribute(el2, "class", "fa fa-user");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode(" ");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("li");
          var el2 = dom.createTextNode("\n      ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("button");
          dom.setAttribute(el2, "class", "btn btn-sm btn-default");
          var el3 = dom.createTextNode("\n        ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("i");
          dom.setAttribute(el3, "class", "fa fa-sign-out");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode(" Logout\n      ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element1 = dom.childAt(fragment, [7, 1]);
          var morphs = new Array(4);
          morphs[0] = dom.createMorphAt(dom.childAt(fragment, [1]), 0, 0);
          morphs[1] = dom.createMorphAt(dom.childAt(fragment, [3]), 0, 0);
          morphs[2] = dom.createMorphAt(dom.childAt(fragment, [5]), 2, 2);
          morphs[3] = dom.createElementMorph(element1);
          return morphs;
        },
        statements: [["block", "link-to", ["raids"], [], 0, null, ["loc", [null, [4, 8], [4, 74]]]], ["block", "link-to", ["characters"], [], 1, null, ["loc", [null, [5, 8], [5, 83]]]], ["content", "account.battletag", ["loc", [null, [6, 35], [6, 56]]], 0, 0, 0, 0], ["element", "action", ["logout"], [], ["loc", [null, [8, 45], [8, 64]]], 0, 0]],
        locals: [],
        templates: [child0, child1]
      };
    })();
    var child2 = (function () {
      return {
        meta: {
          "revision": "Ember@2.8.1",
          "loc": {
            "source": null,
            "start": {
              "line": 12,
              "column": 2
            },
            "end": {
              "line": 18,
              "column": 2
            }
          },
          "moduleName": "coretheloothound/templates/auth.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("li");
          var el2 = dom.createTextNode("\n      ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("button");
          dom.setAttribute(el2, "class", "btn btn-sm btn-primary");
          var el3 = dom.createTextNode("\n        ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("i");
          dom.setAttribute(el3, "class", "fa fa-sign-in");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode(" Login\n      ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element0 = dom.childAt(fragment, [1, 1]);
          var morphs = new Array(1);
          morphs[0] = dom.createElementMorph(element0);
          return morphs;
        },
        statements: [["element", "action", ["login"], [], ["loc", [null, [14, 45], [14, 63]]], 0, 0]],
        locals: [],
        templates: []
      };
    })();
    return {
      meta: {
        "revision": "Ember@2.8.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 20,
            "column": 0
          }
        },
        "moduleName": "coretheloothound/templates/auth.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("ul");
        dom.setAttribute(el1, "class", "auth");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("li");
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element2 = dom.childAt(fragment, [0]);
        var morphs = new Array(2);
        morphs[0] = dom.createMorphAt(dom.childAt(element2, [1]), 0, 0);
        morphs[1] = dom.createMorphAt(element2, 3, 3);
        return morphs;
      },
      statements: [["block", "link-to", ["index"], [], 0, null, ["loc", [null, [2, 6], [2, 69]]]], ["block", "if", [["get", "loggedIn", ["loc", [null, [3, 8], [3, 16]]], 0, 0, 0, 0]], [], 1, 2, ["loc", [null, [3, 2], [18, 9]]]]],
      locals: [],
      templates: [child0, child1, child2]
    };
  })());
});
define("coretheloothound/templates/characters", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "revision": "Ember@2.8.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 5,
            "column": 0
          }
        },
        "moduleName": "coretheloothound/templates/characters.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "class", "characters");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("h2");
        var el3 = dom.createTextNode("Characters");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(dom.childAt(fragment, [0]), 3, 3);
        return morphs;
      },
      statements: [["content", "liquid-outlet", ["loc", [null, [3, 2], [3, 19]]], 0, 0, 0, 0]],
      locals: [],
      templates: []
    };
  })());
});
define("coretheloothound/templates/characters/index", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      return {
        meta: {
          "revision": "Ember@2.8.1",
          "loc": {
            "source": null,
            "start": {
              "line": 5,
              "column": 6
            },
            "end": {
              "line": 9,
              "column": 6
            }
          },
          "moduleName": "coretheloothound/templates/characters/index.hbs"
        },
        isEmpty: false,
        arity: 1,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("      ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("option");
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n      ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element9 = dom.childAt(fragment, [1]);
          var morphs = new Array(3);
          morphs[0] = dom.createAttrMorph(element9, 'value');
          morphs[1] = dom.createAttrMorph(element9, 'selected');
          morphs[2] = dom.createMorphAt(element9, 1, 1);
          return morphs;
        },
        statements: [["attribute", "value", ["get", "item", ["loc", [null, [6, 22], [6, 26]]], 0, 0, 0, 0], 0, 0, 0, 0], ["attribute", "selected", ["subexpr", "eq", [["get", "realm", ["loc", [null, [6, 43], [6, 48]]], 0, 0, 0, 0], ["get", "item", ["loc", [null, [6, 49], [6, 53]]], 0, 0, 0, 0]], [], ["loc", [null, [null, null], [6, 55]]], 0, 0], 0, 0, 0, 0], ["content", "item", ["loc", [null, [7, 8], [7, 16]]], 0, 0, 0, 0]],
        locals: ["item"],
        templates: []
      };
    })();
    var child1 = (function () {
      return {
        meta: {
          "revision": "Ember@2.8.1",
          "loc": {
            "source": null,
            "start": {
              "line": 17,
              "column": 2
            },
            "end": {
              "line": 28,
              "column": 2
            }
          },
          "moduleName": "coretheloothound/templates/characters/index.hbs"
        },
        isEmpty: false,
        arity: 1,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1, "class", "character");
          var el2 = dom.createTextNode("\n      ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("h3");
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode(" ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("small");
          var el4 = dom.createComment("");
          dom.appendChild(el3, el4);
          var el4 = dom.createTextNode(" ");
          dom.appendChild(el3, el4);
          var el4 = dom.createComment("");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n      ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("img");
          dom.setAttribute(el2, "class", "character");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n      ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("p");
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode(" ");
          dom.appendChild(el2, el3);
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n      ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("p");
          dom.setAttribute(el2, "class", "links");
          var el3 = dom.createTextNode("\n        ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("a");
          var el4 = dom.createElement("img");
          dom.setAttribute(el4, "src", "images/wow.png");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n        ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("a");
          var el4 = dom.createElement("img");
          dom.setAttribute(el4, "src", "images/wowhead.png");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n        ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("a");
          var el4 = dom.createElement("img");
          dom.setAttribute(el4, "src", "images/robot.png");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n      ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element0 = dom.childAt(fragment, [1]);
          var element1 = dom.childAt(element0, [1]);
          var element2 = dom.childAt(element1, [2]);
          var element3 = dom.childAt(element0, [3]);
          var element4 = dom.childAt(element0, [5]);
          var element5 = dom.childAt(element0, [7]);
          var element6 = dom.childAt(element5, [1]);
          var element7 = dom.childAt(element5, [3]);
          var element8 = dom.childAt(element5, [5]);
          var morphs = new Array(9);
          morphs[0] = dom.createMorphAt(element1, 0, 0);
          morphs[1] = dom.createMorphAt(element2, 0, 0);
          morphs[2] = dom.createMorphAt(element2, 2, 2);
          morphs[3] = dom.createAttrMorph(element3, 'src');
          morphs[4] = dom.createMorphAt(element4, 0, 0);
          morphs[5] = dom.createMorphAt(element4, 2, 2);
          morphs[6] = dom.createAttrMorph(element6, 'href');
          morphs[7] = dom.createAttrMorph(element7, 'href');
          morphs[8] = dom.createAttrMorph(element8, 'href');
          return morphs;
        },
        statements: [["content", "character.name", ["loc", [null, [19, 10], [19, 28]]], 0, 0, 0, 0], ["content", "character.level", ["loc", [null, [19, 36], [19, 55]]], 0, 0, 0, 0], ["content", "character.realm", ["loc", [null, [19, 56], [19, 75]]], 0, 0, 0, 0], ["attribute", "src", ["concat", [["get", "character.image_url", ["loc", [null, [20, 36], [20, 55]]], 0, 0, 0, 0]], 0, 0, 0, 0, 0], 0, 0, 0, 0], ["inline", "character-race", [["get", "character.race_id", ["loc", [null, [21, 26], [21, 43]]], 0, 0, 0, 0]], [], ["loc", [null, [21, 9], [21, 45]]], 0, 0], ["inline", "character-class", [["get", "character.class_id", ["loc", [null, [21, 64], [21, 82]]], 0, 0, 0, 0]], [], ["loc", [null, [21, 46], [21, 84]]], 0, 0], ["attribute", "href", ["concat", [["get", "character.armoryUrl", ["loc", [null, [23, 19], [23, 38]]], 0, 0, 0, 0]], 0, 0, 0, 0, 0], 0, 0, 0, 0], ["attribute", "href", ["concat", [["get", "character.wowheadUrl", ["loc", [null, [24, 19], [24, 39]]], 0, 0, 0, 0]], 0, 0, 0, 0, 0], 0, 0, 0, 0], ["attribute", "href", ["concat", [["get", "character.robotUrl", ["loc", [null, [25, 19], [25, 37]]], 0, 0, 0, 0]], 0, 0, 0, 0, 0], 0, 0, 0, 0]],
        locals: ["character"],
        templates: []
      };
    })();
    var child2 = (function () {
      var child0 = (function () {
        return {
          meta: {
            "revision": "Ember@2.8.1",
            "loc": {
              "source": null,
              "start": {
                "line": 30,
                "column": 39
              },
              "end": {
                "line": 30,
                "column": 64
              }
            },
            "moduleName": "coretheloothound/templates/characters/index.hbs"
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("max level ");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes() {
            return [];
          },
          statements: [],
          locals: [],
          templates: []
        };
      })();
      return {
        meta: {
          "revision": "Ember@2.8.1",
          "loc": {
            "source": null,
            "start": {
              "line": 28,
              "column": 2
            },
            "end": {
              "line": 32,
              "column": 2
            }
          },
          "moduleName": "coretheloothound/templates/characters/index.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1, "class", "empty");
          var el2 = dom.createTextNode("\n      ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("div");
          dom.setAttribute(el2, "class", "alert alert-info");
          var el3 = dom.createTextNode("No ");
          dom.appendChild(el2, el3);
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("characters");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(dom.childAt(fragment, [1, 1]), 1, 1);
          return morphs;
        },
        statements: [["block", "if", [["get", "onlyMax", ["loc", [null, [30, 45], [30, 52]]], 0, 0, 0, 0]], [], 0, null, ["loc", [null, [30, 39], [30, 71]]]]],
        locals: [],
        templates: [child0]
      };
    })();
    return {
      meta: {
        "revision": "Ember@2.8.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 34,
            "column": 0
          }
        },
        "moduleName": "coretheloothound/templates/characters/index.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "class", "well form");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2, "class", "form-group");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("label");
        dom.setAttribute(el3, "for", "realms");
        var el4 = dom.createTextNode("Realm");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("select");
        dom.setAttribute(el3, "id", "realms");
        dom.setAttribute(el3, "class", "form-control");
        var el4 = dom.createTextNode("\n");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2, "class", "checkbox");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("label");
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode(" Only show max level characters");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "class", "characters-list");
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element10 = dom.childAt(fragment, [0]);
        var element11 = dom.childAt(element10, [1, 3]);
        var morphs = new Array(4);
        morphs[0] = dom.createAttrMorph(element11, 'onchange');
        morphs[1] = dom.createMorphAt(element11, 1, 1);
        morphs[2] = dom.createMorphAt(dom.childAt(element10, [3, 1]), 0, 0);
        morphs[3] = dom.createMorphAt(dom.childAt(fragment, [2]), 1, 1);
        return morphs;
      },
      statements: [["attribute", "onchange", ["subexpr", "action", ["changeRealm"], ["value", "target.value"], ["loc", [null, [null, null], [4, 99]]], 0, 0], 0, 0, 0, 0], ["block", "each", [["get", "realms", ["loc", [null, [5, 14], [5, 20]]], 0, 0, 0, 0]], [], 0, null, ["loc", [null, [5, 6], [9, 15]]]], ["inline", "input", [], ["type", "checkbox", "checked", ["subexpr", "@mut", [["get", "onlyMax", ["loc", [null, [13, 43], [13, 50]]], 0, 0, 0, 0]], [], [], 0, 0]], ["loc", [null, [13, 11], [13, 52]]], 0, 0], ["block", "each", [["get", "filtered", ["loc", [null, [17, 10], [17, 18]]], 0, 0, 0, 0]], [], 1, 2, ["loc", [null, [17, 2], [32, 11]]]]],
      locals: [],
      templates: [child0, child1, child2]
    };
  })());
});
define("coretheloothound/templates/components/character-select", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      return {
        meta: {
          "revision": "Ember@2.8.1",
          "loc": {
            "source": null,
            "start": {
              "line": 8,
              "column": 10
            },
            "end": {
              "line": 12,
              "column": 10
            }
          },
          "moduleName": "coretheloothound/templates/components/character-select.hbs"
        },
        isEmpty: false,
        arity: 1,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("          ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("option");
          var el2 = dom.createTextNode("\n            ");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n          ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element1 = dom.childAt(fragment, [1]);
          var morphs = new Array(3);
          morphs[0] = dom.createAttrMorph(element1, 'value');
          morphs[1] = dom.createAttrMorph(element1, 'selected');
          morphs[2] = dom.createMorphAt(element1, 1, 1);
          return morphs;
        },
        statements: [["attribute", "value", ["concat", [["get", "item.model.id", ["loc", [null, [9, 27], [9, 40]]], 0, 0, 0, 0]], 0, 0, 0, 0, 0], 0, 0, 0, 0], ["attribute", "selected", ["subexpr", "eq", [["get", "character", ["loc", [null, [9, 58], [9, 67]]], 0, 0, 0, 0], ["get", "item", ["loc", [null, [9, 68], [9, 72]]], 0, 0, 0, 0]], [], ["loc", [null, [null, null], [9, 74]]], 0, 0], 0, 0, 0, 0], ["content", "item.label", ["loc", [null, [10, 12], [10, 26]]], 0, 0, 0, 0]],
        locals: ["item"],
        templates: []
      };
    })();
    var child1 = (function () {
      return {
        meta: {
          "revision": "Ember@2.8.1",
          "loc": {
            "source": null,
            "start": {
              "line": 16,
              "column": 8
            },
            "end": {
              "line": 23,
              "column": 8
            }
          },
          "moduleName": "coretheloothound/templates/components/character-select.hbs"
        },
        isEmpty: false,
        arity: 1,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("          ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1, "class", "checkbox");
          var el2 = dom.createTextNode("\n            ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("label");
          var el3 = dom.createTextNode("\n              ");
          dom.appendChild(el2, el3);
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n              ");
          dom.appendChild(el2, el3);
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n            ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n          ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element0 = dom.childAt(fragment, [1, 1]);
          var morphs = new Array(2);
          morphs[0] = dom.createMorphAt(element0, 1, 1);
          morphs[1] = dom.createMorphAt(element0, 3, 3);
          return morphs;
        },
        statements: [["inline", "input", [], ["id", ["subexpr", "@mut", [["get", "slug", ["loc", [null, [19, 25], [19, 29]]], 0, 0, 0, 0]], [], [], 0, 0], "type", "checkbox", "checked", ["subexpr", "@mut", [["get", "box.checked", ["loc", [null, [19, 54], [19, 65]]], 0, 0, 0, 0]], [], [], 0, 0], "name", ["subexpr", "@mut", [["get", "box.name", ["loc", [null, [19, 71], [19, 79]]], 0, 0, 0, 0]], [], [], 0, 0]], ["loc", [null, [19, 14], [19, 81]]], 0, 0], ["content", "box.name", ["loc", [null, [20, 14], [20, 26]]], 0, 0, 0, 0]],
        locals: ["box"],
        templates: []
      };
    })();
    return {
      meta: {
        "revision": "Ember@2.8.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 29,
            "column": 0
          }
        },
        "moduleName": "coretheloothound/templates/components/character-select.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("h3");
        var el2 = dom.createTextNode("Signup");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("form");
        dom.setAttribute(el1, "class", "form");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2, "class", "row");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3, "class", "col-md-12");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4, "class", "form-group");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("label");
        dom.setAttribute(el5, "for", "character");
        var el6 = dom.createTextNode("Character");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("select");
        dom.setAttribute(el5, "id", "character");
        dom.setAttribute(el5, "class", "form-control");
        var el6 = dom.createTextNode("\n");
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n\n");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("button");
        dom.setAttribute(el4, "class", "btn btn-primary");
        var el5 = dom.createTextNode("Sign Up");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element2 = dom.childAt(fragment, [2, 1, 1]);
        var element3 = dom.childAt(element2, [1]);
        var element4 = dom.childAt(element3, [3]);
        var element5 = dom.childAt(element2, [3]);
        var morphs = new Array(5);
        morphs[0] = dom.createAttrMorph(element4, 'onchange');
        morphs[1] = dom.createMorphAt(element4, 1, 1);
        morphs[2] = dom.createMorphAt(element3, 5, 5);
        morphs[3] = dom.createMorphAt(element3, 7, 7);
        morphs[4] = dom.createElementMorph(element5);
        return morphs;
      },
      statements: [["attribute", "onchange", ["subexpr", "action", ["change"], [], ["loc", [null, [null, null], [7, 80]]], 0, 0], 0, 0, 0, 0], ["block", "each", [["get", "characters", ["loc", [null, [8, 18], [8, 28]]], 0, 0, 0, 0]], [], 0, null, ["loc", [null, [8, 10], [12, 19]]]], ["inline", "input", [], ["class", "form-control", "placeholder", "Note", "value", ["subexpr", "@mut", [["get", "note", ["loc", [null, [14, 62], [14, 66]]], 0, 0, 0, 0]], [], [], 0, 0]], ["loc", [null, [14, 8], [14, 68]]], 0, 0], ["block", "each", [["get", "roleCheckboxes", ["loc", [null, [16, 16], [16, 30]]], 0, 0, 0, 0]], [], 1, null, ["loc", [null, [16, 8], [23, 17]]]], ["element", "action", ["signup"], [], ["loc", [null, [25, 38], [25, 57]]], 0, 0]],
      locals: [],
      templates: [child0, child1]
    };
  })());
});
define("coretheloothound/templates/components/date-time", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "revision": "Ember@2.8.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 18,
            "column": 0
          }
        },
        "moduleName": "coretheloothound/templates/components/date-time.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "class", "date-container row");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2, "class", "col-md-3");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3, "class", "input-group margin-bottom-sm");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("span");
        dom.setAttribute(el4, "class", "input-group-addon");
        var el5 = dom.createElement("i");
        dom.setAttribute(el5, "class", "fa fa-calendar-o fa-fw");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2, "class", "col-md-3");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3, "class", "input-group margin-bottom-sm");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("span");
        dom.setAttribute(el4, "class", "input-group-addon");
        var el5 = dom.createElement("i");
        dom.setAttribute(el5, "class", "fa fa-clock-o fa-fw");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2, "class", "col-md-6");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("p");
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element0 = dom.childAt(fragment, [0]);
        var morphs = new Array(3);
        morphs[0] = dom.createMorphAt(dom.childAt(element0, [1, 1]), 3, 3);
        morphs[1] = dom.createMorphAt(dom.childAt(element0, [3, 1]), 3, 3);
        morphs[2] = dom.createMorphAt(dom.childAt(element0, [5, 1]), 0, 0);
        return morphs;
      },
      statements: [["inline", "input", [], ["type", "text", "id", "raid-date", "value", ["subexpr", "@mut", [["get", "pickdate", ["loc", [null, [5, 47], [5, 55]]], 0, 0, 0, 0]], [], [], 0, 0], "class", "datepicker form-control"], ["loc", [null, [5, 6], [5, 89]]], 0, 0], ["inline", "input", [], ["type", "text", "id", "raid-time", "value", ["subexpr", "@mut", [["get", "picktime", ["loc", [null, [11, 47], [11, 55]]], 0, 0, 0, 0]], [], [], 0, 0], "class", "timepicker form-control"], ["loc", [null, [11, 6], [11, 89]]], 0, 0], ["content", "dateAgo", ["loc", [null, [15, 7], [15, 18]]], 0, 0, 0, 0]],
      locals: [],
      templates: []
    };
  })());
});
define("coretheloothound/templates/components/guild-icon", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      return {
        meta: {
          "revision": "Ember@2.8.1",
          "loc": {
            "source": null,
            "start": {
              "line": 1,
              "column": 0
            },
            "end": {
              "line": 8,
              "column": 0
            }
          },
          "moduleName": "coretheloothound/templates/components/guild-icon.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1, "class", "emblem");
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("div");
          dom.setAttribute(el2, "class", "background");
          var el3 = dom.createTextNode("\n      ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("div");
          dom.setAttribute(el3, "class", "icon");
          var el4 = dom.createTextNode("\n      ");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n    ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n  ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element0 = dom.childAt(fragment, [1, 1]);
          var element1 = dom.childAt(element0, [1]);
          var morphs = new Array(2);
          morphs[0] = dom.createAttrMorph(element0, 'style');
          morphs[1] = dom.createAttrMorph(element1, 'style');
          return morphs;
        },
        statements: [["attribute", "style", ["get", "backgroundStyle", ["loc", [null, [3, 36], [3, 51]]], 0, 0, 0, 0], 0, 0, 0, 0], ["attribute", "style", ["get", "iconStyle", ["loc", [null, [4, 32], [4, 41]]], 0, 0, 0, 0], 0, 0, 0, 0]],
        locals: [],
        templates: []
      };
    })();
    return {
      meta: {
        "revision": "Ember@2.8.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 8,
            "column": 7
          }
        },
        "moduleName": "coretheloothound/templates/components/guild-icon.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
        dom.insertBoundary(fragment, 0);
        dom.insertBoundary(fragment, null);
        return morphs;
      },
      statements: [["block", "if", [["get", "guild.icon", ["loc", [null, [1, 6], [1, 16]]], 0, 0, 0, 0]], [], 0, null, ["loc", [null, [1, 0], [8, 7]]]]],
      locals: [],
      templates: [child0]
    };
  })());
});
define("coretheloothound/templates/components/guild-select", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      return {
        meta: {
          "revision": "Ember@2.8.1",
          "loc": {
            "source": null,
            "start": {
              "line": 3,
              "column": 2
            },
            "end": {
              "line": 7,
              "column": 2
            }
          },
          "moduleName": "coretheloothound/templates/components/guild-select.hbs"
        },
        isEmpty: false,
        arity: 1,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("option");
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n  ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element0 = dom.childAt(fragment, [1]);
          var morphs = new Array(3);
          morphs[0] = dom.createAttrMorph(element0, 'value');
          morphs[1] = dom.createAttrMorph(element0, 'selected');
          morphs[2] = dom.createMorphAt(element0, 1, 1);
          return morphs;
        },
        statements: [["attribute", "value", ["concat", [["get", "item.id", ["loc", [null, [4, 19], [4, 26]]], 0, 0, 0, 0]], 0, 0, 0, 0, 0], 0, 0, 0, 0], ["attribute", "selected", ["subexpr", "eq", [["get", "guild", ["loc", [null, [4, 44], [4, 49]]], 0, 0, 0, 0], ["get", "item", ["loc", [null, [4, 50], [4, 54]]], 0, 0, 0, 0]], [], ["loc", [null, [null, null], [4, 56]]], 0, 0], 0, 0, 0, 0], ["content", "item.fullName", ["loc", [null, [5, 4], [5, 21]]], 0, 0, 0, 0]],
        locals: ["item"],
        templates: []
      };
    })();
    return {
      meta: {
        "revision": "Ember@2.8.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 9,
            "column": 0
          }
        },
        "moduleName": "coretheloothound/templates/components/guild-select.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("select");
        dom.setAttribute(el1, "class", "form-control");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("option");
        var el3 = dom.createTextNode("None");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element1 = dom.childAt(fragment, [0]);
        var morphs = new Array(2);
        morphs[0] = dom.createAttrMorph(element1, 'onchange');
        morphs[1] = dom.createMorphAt(element1, 3, 3);
        return morphs;
      },
      statements: [["attribute", "onchange", ["subexpr", "action", ["change"], [], ["loc", [null, [null, null], [1, 57]]], 0, 0], 0, 0, 0, 0], ["block", "each", [["get", "guilds", ["loc", [null, [3, 10], [3, 16]]], 0, 0, 0, 0]], [], 0, null, ["loc", [null, [3, 2], [7, 11]]]]],
      locals: [],
      templates: [child0]
    };
  })());
});
define("coretheloothound/templates/components/raid-group", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      return {
        meta: {
          "revision": "Ember@2.8.1",
          "loc": {
            "source": null,
            "start": {
              "line": 2,
              "column": 2
            },
            "end": {
              "line": 7,
              "column": 2
            }
          },
          "moduleName": "coretheloothound/templates/components/raid-group.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1, "class", "waiting-list");
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("div");
          dom.setAttribute(el2, "class", "target");
          var el3 = dom.createTextNode("\n    ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n  ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() {
          return [];
        },
        statements: [],
        locals: [],
        templates: []
      };
    })();
    var child1 = (function () {
      return {
        meta: {
          "revision": "Ember@2.8.1",
          "loc": {
            "source": null,
            "start": {
              "line": 7,
              "column": 2
            },
            "end": {
              "line": 20,
              "column": 2
            }
          },
          "moduleName": "coretheloothound/templates/components/raid-group.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1, "class", "tank");
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("div");
          dom.setAttribute(el2, "class", "target");
          var el3 = dom.createTextNode("\n    ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n  ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1, "class", "healing");
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("div");
          dom.setAttribute(el2, "class", "target");
          var el3 = dom.createTextNode("\n    ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n  ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1, "class", "dps");
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("div");
          dom.setAttribute(el2, "class", "target");
          var el3 = dom.createTextNode("\n    ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n  ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() {
          return [];
        },
        statements: [],
        locals: [],
        templates: []
      };
    })();
    return {
      meta: {
        "revision": "Ember@2.8.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 22,
            "column": 0
          }
        },
        "moduleName": "coretheloothound/templates/components/raid-group.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "class", "targets");
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(dom.childAt(fragment, [0]), 1, 1);
        return morphs;
      },
      statements: [["block", "if", [["get", "waitingList", ["loc", [null, [2, 8], [2, 19]]], 0, 0, 0, 0]], [], 0, 1, ["loc", [null, [2, 2], [20, 9]]]]],
      locals: [],
      templates: [child0, child1]
    };
  })());
});
define("coretheloothound/templates/components/raid-permission", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      return {
        meta: {
          "revision": "Ember@2.8.1",
          "loc": {
            "source": null,
            "start": {
              "line": 2,
              "column": 0
            },
            "end": {
              "line": 4,
              "column": 0
            }
          },
          "moduleName": "coretheloothound/templates/components/raid-permission.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("a");
          var el2 = dom.createElement("i");
          dom.setAttribute(el2, "class", "fa fa-close fa-fw");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element0 = dom.childAt(fragment, [1]);
          var morphs = new Array(1);
          morphs[0] = dom.createElementMorph(element0);
          return morphs;
        },
        statements: [["element", "action", ["deletePermission"], [], ["loc", [null, [3, 5], [3, 34]]], 0, 0]],
        locals: [],
        templates: []
      };
    })();
    return {
      meta: {
        "revision": "Ember@2.8.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 5,
            "column": 0
          }
        },
        "moduleName": "coretheloothound/templates/components/raid-permission.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(2);
        morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
        morphs[1] = dom.createMorphAt(fragment, 2, 2, contextualElement);
        dom.insertBoundary(fragment, 0);
        dom.insertBoundary(fragment, null);
        return morphs;
      },
      statements: [["content", "label", ["loc", [null, [1, 0], [1, 9]]], 0, 0, 0, 0], ["block", "unless", [["get", "ownAccount", ["loc", [null, [2, 10], [2, 20]]], 0, 0, 0, 0]], [], 0, null, ["loc", [null, [2, 0], [4, 11]]]]],
      locals: [],
      templates: [child0]
    };
  })());
});
define("coretheloothound/templates/components/raid-permissions", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      var child0 = (function () {
        return {
          meta: {
            "revision": "Ember@2.8.1",
            "loc": {
              "source": null,
              "start": {
                "line": 4,
                "column": 2
              },
              "end": {
                "line": 6,
                "column": 2
              }
            },
            "moduleName": "coretheloothound/templates/components/raid-permissions.hbs"
          },
          isEmpty: false,
          arity: 1,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("    ");
            dom.appendChild(el0, el1);
            var el1 = dom.createComment("");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var morphs = new Array(1);
            morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
            return morphs;
          },
          statements: [["inline", "raid-permission", [], ["account", ["subexpr", "@mut", [["get", "account", ["loc", [null, [5, 30], [5, 37]]], 0, 0, 0, 0]], [], [], 0, 0], "permission", ["subexpr", "@mut", [["get", "permission", ["loc", [null, [5, 49], [5, 59]]], 0, 0, 0, 0]], [], [], 0, 0], "deletePermission", "deletePermission"], ["loc", [null, [5, 4], [5, 97]]], 0, 0]],
          locals: ["permission"],
          templates: []
        };
      })();
      var child1 = (function () {
        return {
          meta: {
            "revision": "Ember@2.8.1",
            "loc": {
              "source": null,
              "start": {
                "line": 6,
                "column": 2
              },
              "end": {
                "line": 8,
                "column": 2
              }
            },
            "moduleName": "coretheloothound/templates/components/raid-permissions.hbs"
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("    ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("div");
            dom.setAttribute(el1, "class", "text-muted");
            var el2 = dom.createTextNode("None");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes() {
            return [];
          },
          statements: [],
          locals: [],
          templates: []
        };
      })();
      var child2 = (function () {
        return {
          meta: {
            "revision": "Ember@2.8.1",
            "loc": {
              "source": null,
              "start": {
                "line": 20,
                "column": 2
              },
              "end": {
                "line": 22,
                "column": 2
              }
            },
            "moduleName": "coretheloothound/templates/components/raid-permissions.hbs"
          },
          isEmpty: false,
          arity: 1,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("    ");
            dom.appendChild(el0, el1);
            var el1 = dom.createComment("");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var morphs = new Array(1);
            morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
            return morphs;
          },
          statements: [["inline", "raid-permission", [], ["account", ["subexpr", "@mut", [["get", "account", ["loc", [null, [21, 30], [21, 37]]], 0, 0, 0, 0]], [], [], 0, 0], "permission", ["subexpr", "@mut", [["get", "permission", ["loc", [null, [21, 49], [21, 59]]], 0, 0, 0, 0]], [], [], 0, 0], "deletePermission", "deletePermission"], ["loc", [null, [21, 4], [21, 97]]], 0, 0]],
          locals: ["permission"],
          templates: []
        };
      })();
      var child3 = (function () {
        return {
          meta: {
            "revision": "Ember@2.8.1",
            "loc": {
              "source": null,
              "start": {
                "line": 22,
                "column": 2
              },
              "end": {
                "line": 24,
                "column": 2
              }
            },
            "moduleName": "coretheloothound/templates/components/raid-permissions.hbs"
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("    ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("div");
            dom.setAttribute(el1, "class", "text-muted");
            var el2 = dom.createTextNode("None");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes() {
            return [];
          },
          statements: [],
          locals: [],
          templates: []
        };
      })();
      return {
        meta: {
          "revision": "Ember@2.8.1",
          "loc": {
            "source": null,
            "start": {
              "line": 1,
              "column": 0
            },
            "end": {
              "line": 60,
              "column": 0
            }
          },
          "moduleName": "coretheloothound/templates/components/raid-permissions.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("h3");
          var el2 = dom.createTextNode("Permissions");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("h4");
          var el2 = dom.createTextNode("Admins");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("form");
          dom.setAttribute(el1, "class", "form");
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("div");
          dom.setAttribute(el2, "class", "row");
          var el3 = dom.createTextNode("\n      ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("div");
          dom.setAttribute(el3, "class", "col-md-12");
          var el4 = dom.createTextNode("\n        ");
          dom.appendChild(el3, el4);
          var el4 = dom.createElement("div");
          dom.setAttribute(el4, "class", "form-group");
          var el5 = dom.createTextNode("\n          ");
          dom.appendChild(el4, el5);
          var el5 = dom.createComment("");
          dom.appendChild(el4, el5);
          var el5 = dom.createTextNode("\n        ");
          dom.appendChild(el4, el5);
          dom.appendChild(el3, el4);
          var el4 = dom.createTextNode("\n        ");
          dom.appendChild(el3, el4);
          var el4 = dom.createElement("button");
          dom.setAttribute(el4, "class", "btn btn-primary");
          var el5 = dom.createTextNode("Add Admin");
          dom.appendChild(el4, el5);
          dom.appendChild(el3, el4);
          var el4 = dom.createTextNode("\n      ");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n    ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n  ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("h4");
          var el2 = dom.createTextNode("Members");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("form");
          dom.setAttribute(el1, "class", "form");
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("div");
          dom.setAttribute(el2, "class", "row");
          var el3 = dom.createTextNode("\n      ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("div");
          dom.setAttribute(el3, "class", "col-md-12");
          var el4 = dom.createTextNode("\n        ");
          dom.appendChild(el3, el4);
          var el4 = dom.createElement("div");
          dom.setAttribute(el4, "class", "form-group");
          var el5 = dom.createTextNode("\n          ");
          dom.appendChild(el4, el5);
          var el5 = dom.createElement("label");
          var el6 = dom.createTextNode("Battletag");
          dom.appendChild(el5, el6);
          dom.appendChild(el4, el5);
          var el5 = dom.createTextNode("\n          ");
          dom.appendChild(el4, el5);
          var el5 = dom.createComment("");
          dom.appendChild(el4, el5);
          var el5 = dom.createTextNode("\n        ");
          dom.appendChild(el4, el5);
          dom.appendChild(el3, el4);
          var el4 = dom.createTextNode("\n        ");
          dom.appendChild(el3, el4);
          var el4 = dom.createElement("button");
          dom.setAttribute(el4, "class", "btn btn-primary");
          var el5 = dom.createTextNode("Add Member Battletag");
          dom.appendChild(el4, el5);
          dom.appendChild(el3, el4);
          var el4 = dom.createTextNode("\n      ");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n    ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n  ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("form");
          dom.setAttribute(el1, "class", "form");
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("div");
          dom.setAttribute(el2, "class", "row");
          var el3 = dom.createTextNode("\n      ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("div");
          dom.setAttribute(el3, "class", "col-md-12");
          var el4 = dom.createTextNode("\n        ");
          dom.appendChild(el3, el4);
          var el4 = dom.createElement("div");
          dom.setAttribute(el4, "class", "form-group");
          var el5 = dom.createTextNode("\n          ");
          dom.appendChild(el4, el5);
          var el5 = dom.createElement("label");
          var el6 = dom.createTextNode("Character");
          dom.appendChild(el5, el6);
          dom.appendChild(el4, el5);
          var el5 = dom.createTextNode("\n          ");
          dom.appendChild(el4, el5);
          var el5 = dom.createComment("");
          dom.appendChild(el4, el5);
          var el5 = dom.createTextNode("\n          ");
          dom.appendChild(el4, el5);
          var el5 = dom.createComment("");
          dom.appendChild(el4, el5);
          var el5 = dom.createTextNode("\n        ");
          dom.appendChild(el4, el5);
          dom.appendChild(el3, el4);
          var el4 = dom.createTextNode("\n        ");
          dom.appendChild(el3, el4);
          var el4 = dom.createElement("button");
          dom.setAttribute(el4, "class", "btn btn-primary");
          var el5 = dom.createTextNode("Add Member Character");
          dom.appendChild(el4, el5);
          dom.appendChild(el3, el4);
          var el4 = dom.createTextNode("\n      ");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n    ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n  ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("form");
          dom.setAttribute(el1, "class", "form");
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("div");
          dom.setAttribute(el2, "class", "row");
          var el3 = dom.createTextNode("\n      ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("div");
          dom.setAttribute(el3, "class", "col-md-12");
          var el4 = dom.createTextNode("\n        ");
          dom.appendChild(el3, el4);
          var el4 = dom.createElement("div");
          dom.setAttribute(el4, "class", "form-group");
          var el5 = dom.createTextNode("\n          ");
          dom.appendChild(el4, el5);
          var el5 = dom.createElement("label");
          var el6 = dom.createTextNode("Guild");
          dom.appendChild(el5, el6);
          dom.appendChild(el4, el5);
          var el5 = dom.createTextNode("\n          ");
          dom.appendChild(el4, el5);
          var el5 = dom.createComment("");
          dom.appendChild(el4, el5);
          var el5 = dom.createTextNode("\n          ");
          dom.appendChild(el4, el5);
          var el5 = dom.createComment("");
          dom.appendChild(el4, el5);
          var el5 = dom.createTextNode("\n        ");
          dom.appendChild(el4, el5);
          dom.appendChild(el3, el4);
          var el4 = dom.createTextNode("\n        ");
          dom.appendChild(el3, el4);
          var el4 = dom.createElement("button");
          dom.setAttribute(el4, "class", "btn btn-primary");
          var el5 = dom.createTextNode("Add Member Guild");
          dom.appendChild(el4, el5);
          dom.appendChild(el3, el4);
          var el4 = dom.createTextNode("\n      ");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n    ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n  ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element0 = dom.childAt(fragment, [7, 1, 1]);
          var element1 = dom.childAt(element0, [3]);
          var element2 = dom.childAt(fragment, [13, 1, 1]);
          var element3 = dom.childAt(element2, [3]);
          var element4 = dom.childAt(fragment, [15, 1, 1]);
          var element5 = dom.childAt(element4, [1]);
          var element6 = dom.childAt(element4, [3]);
          var element7 = dom.childAt(fragment, [17, 1, 1]);
          var element8 = dom.childAt(element7, [1]);
          var element9 = dom.childAt(element7, [3]);
          var morphs = new Array(12);
          morphs[0] = dom.createMorphAt(fragment, 5, 5, contextualElement);
          morphs[1] = dom.createMorphAt(dom.childAt(element0, [1]), 1, 1);
          morphs[2] = dom.createElementMorph(element1);
          morphs[3] = dom.createMorphAt(fragment, 11, 11, contextualElement);
          morphs[4] = dom.createMorphAt(dom.childAt(element2, [1]), 3, 3);
          morphs[5] = dom.createElementMorph(element3);
          morphs[6] = dom.createMorphAt(element5, 3, 3);
          morphs[7] = dom.createMorphAt(element5, 5, 5);
          morphs[8] = dom.createElementMorph(element6);
          morphs[9] = dom.createMorphAt(element8, 3, 3);
          morphs[10] = dom.createMorphAt(element8, 5, 5);
          morphs[11] = dom.createElementMorph(element9);
          return morphs;
        },
        statements: [["block", "each", [["get", "adminPermissions", ["loc", [null, [4, 10], [4, 26]]], 0, 0, 0, 0]], [], 0, 1, ["loc", [null, [4, 2], [8, 11]]]], ["inline", "input", [], ["class", "form-control", "placeholder", "Battletag#9999", "value", ["subexpr", "@mut", [["get", "adminAccount", ["loc", [null, [13, 74], [13, 86]]], 0, 0, 0, 0]], [], [], 0, 0]], ["loc", [null, [13, 10], [13, 88]]], 0, 0], ["element", "action", ["newAdminPermission"], [], ["loc", [null, [15, 40], [15, 71]]], 0, 0], ["block", "each", [["get", "memberPermissions", ["loc", [null, [20, 10], [20, 27]]], 0, 0, 0, 0]], [], 2, 3, ["loc", [null, [20, 2], [24, 11]]]], ["inline", "input", [], ["class", "form-control", "placeholder", "Battletag#9999", "value", ["subexpr", "@mut", [["get", "memberAccount", ["loc", [null, [30, 74], [30, 87]]], 0, 0, 0, 0]], [], [], 0, 0]], ["loc", [null, [30, 10], [30, 89]]], 0, 0], ["element", "action", ["newMemberAccountPermission"], [], ["loc", [null, [32, 40], [32, 79]]], 0, 0], ["inline", "input", [], ["class", "form-control", "placeholder", "Character Name", "value", ["subexpr", "@mut", [["get", "characterName", ["loc", [null, [41, 74], [41, 87]]], 0, 0, 0, 0]], [], [], 0, 0]], ["loc", [null, [41, 10], [41, 89]]], 0, 0], ["inline", "input", [], ["class", "form-control", "placeholder", "Character Realm", "value", ["subexpr", "@mut", [["get", "characterRealm", ["loc", [null, [42, 75], [42, 89]]], 0, 0, 0, 0]], [], [], 0, 0]], ["loc", [null, [42, 10], [42, 91]]], 0, 0], ["element", "action", ["newMemberCharacterPermission"], [], ["loc", [null, [44, 40], [44, 81]]], 0, 0], ["inline", "input", [], ["class", "form-control", "placeholder", "Guild Name", "value", ["subexpr", "@mut", [["get", "guildName", ["loc", [null, [53, 70], [53, 79]]], 0, 0, 0, 0]], [], [], 0, 0]], ["loc", [null, [53, 10], [53, 81]]], 0, 0], ["inline", "input", [], ["class", "form-control", "placeholder", "Guild Realm", "value", ["subexpr", "@mut", [["get", "guildRealm", ["loc", [null, [54, 71], [54, 81]]], 0, 0, 0, 0]], [], [], 0, 0]], ["loc", [null, [54, 10], [54, 83]]], 0, 0], ["element", "action", ["newMemberGuildPermission"], [], ["loc", [null, [56, 40], [56, 77]]], 0, 0]],
        locals: [],
        templates: [child0, child1, child2, child3]
      };
    })();
    return {
      meta: {
        "revision": "Ember@2.8.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 61,
            "column": 0
          }
        },
        "moduleName": "coretheloothound/templates/components/raid-permissions.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
        dom.insertBoundary(fragment, 0);
        dom.insertBoundary(fragment, null);
        return morphs;
      },
      statements: [["block", "if", [["get", "raid.admin", ["loc", [null, [1, 6], [1, 16]]], 0, 0, 0, 0]], [], 0, null, ["loc", [null, [1, 0], [60, 7]]]]],
      locals: [],
      templates: [child0]
    };
  })());
});
define("coretheloothound/templates/components/raid-row", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      return {
        meta: {
          "revision": "Ember@2.8.1",
          "loc": {
            "source": null,
            "start": {
              "line": 2,
              "column": 2
            },
            "end": {
              "line": 5,
              "column": 2
            }
          },
          "moduleName": "coretheloothound/templates/components/raid-row.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("br");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("small");
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(3);
          morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
          morphs[1] = dom.createMorphAt(fragment, 3, 3, contextualElement);
          morphs[2] = dom.createMorphAt(dom.childAt(fragment, [5]), 0, 0);
          return morphs;
        },
        statements: [["inline", "guild-icon", [], ["guild", ["subexpr", "@mut", [["get", "raid.guild", ["loc", [null, [3, 23], [3, 33]]], 0, 0, 0, 0]], [], [], 0, 0]], ["loc", [null, [3, 4], [3, 35]]], 0, 0], ["content", "raid.guild.name", ["loc", [null, [4, 4], [4, 23]]], 0, 0, 0, 0], ["content", "raid.guild.realm", ["loc", [null, [4, 35], [4, 55]]], 0, 0, 0, 0]],
        locals: [],
        templates: []
      };
    })();
    var child1 = (function () {
      return {
        meta: {
          "revision": "Ember@2.8.1",
          "loc": {
            "source": null,
            "start": {
              "line": 8,
              "column": 2
            },
            "end": {
              "line": 10,
              "column": 2
            }
          },
          "moduleName": "coretheloothound/templates/components/raid-row.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("i");
          dom.setAttribute(el1, "title", "You're an admin");
          dom.setAttribute(el1, "class", "fa fa-legal fa-fw");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode(" \n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() {
          return [];
        },
        statements: [],
        locals: [],
        templates: []
      };
    })();
    var child2 = (function () {
      var child0 = (function () {
        return {
          meta: {
            "revision": "Ember@2.8.1",
            "loc": {
              "source": null,
              "start": {
                "line": 12,
                "column": 4
              },
              "end": {
                "line": 12,
                "column": 89
              }
            },
            "moduleName": "coretheloothound/templates/components/raid-row.hbs"
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createComment("");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var morphs = new Array(1);
            morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
            dom.insertBoundary(fragment, 0);
            dom.insertBoundary(fragment, null);
            return morphs;
          },
          statements: [["content", "raid.name", ["loc", [null, [12, 76], [12, 89]]], 0, 0, 0, 0]],
          locals: [],
          templates: []
        };
      })();
      return {
        meta: {
          "revision": "Ember@2.8.1",
          "loc": {
            "source": null,
            "start": {
              "line": 11,
              "column": 2
            },
            "end": {
              "line": 13,
              "column": 2
            }
          },
          "moduleName": "coretheloothound/templates/components/raid-row.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
          return morphs;
        },
        statements: [["block", "link-to", ["raid", ["get", "raid.id", ["loc", [null, [12, 22], [12, 29]]], 0, 0, 0, 0]], ["data-content", ["subexpr", "@mut", [["get", "raid.note", ["loc", [null, [12, 43], [12, 52]]], 0, 0, 0, 0]], [], [], 0, 0], "data-toggle", "popover"], 0, null, ["loc", [null, [12, 4], [12, 101]]]]],
        locals: [],
        templates: [child0]
      };
    })();
    var child3 = (function () {
      var child0 = (function () {
        return {
          meta: {
            "revision": "Ember@2.8.1",
            "loc": {
              "source": null,
              "start": {
                "line": 14,
                "column": 4
              },
              "end": {
                "line": 14,
                "column": 44
              }
            },
            "moduleName": "coretheloothound/templates/components/raid-row.hbs"
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createComment("");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var morphs = new Array(1);
            morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
            dom.insertBoundary(fragment, 0);
            dom.insertBoundary(fragment, null);
            return morphs;
          },
          statements: [["content", "raid.name", ["loc", [null, [14, 31], [14, 44]]], 0, 0, 0, 0]],
          locals: [],
          templates: []
        };
      })();
      return {
        meta: {
          "revision": "Ember@2.8.1",
          "loc": {
            "source": null,
            "start": {
              "line": 13,
              "column": 2
            },
            "end": {
              "line": 15,
              "column": 2
            }
          },
          "moduleName": "coretheloothound/templates/components/raid-row.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
          return morphs;
        },
        statements: [["block", "link-to", ["raid", ["get", "raid.id", ["loc", [null, [14, 22], [14, 29]]], 0, 0, 0, 0]], [], 0, null, ["loc", [null, [14, 4], [14, 56]]]]],
        locals: [],
        templates: [child0]
      };
    })();
    var child4 = (function () {
      return {
        meta: {
          "revision": "Ember@2.8.1",
          "loc": {
            "source": null,
            "start": {
              "line": 19,
              "column": 2
            },
            "end": {
              "line": 21,
              "column": 2
            }
          },
          "moduleName": "coretheloothound/templates/components/raid-row.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("strong");
          dom.setAttribute(el1, "class", "text-success");
          var el2 = dom.createTextNode("Seated on ");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(dom.childAt(fragment, [1]), 1, 1);
          return morphs;
        },
        statements: [["content", "accountSeated.character.name", ["loc", [null, [20, 43], [20, 75]]], 0, 0, 0, 0]],
        locals: [],
        templates: []
      };
    })();
    var child5 = (function () {
      var child0 = (function () {
        return {
          meta: {
            "revision": "Ember@2.8.1",
            "loc": {
              "source": null,
              "start": {
                "line": 22,
                "column": 4
              },
              "end": {
                "line": 24,
                "column": 4
              }
            },
            "moduleName": "coretheloothound/templates/components/raid-row.hbs"
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("      ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("strong");
            dom.setAttribute(el1, "class", "text-info");
            var el2 = dom.createTextNode("Signed Up");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes() {
            return [];
          },
          statements: [],
          locals: [],
          templates: []
        };
      })();
      var child1 = (function () {
        return {
          meta: {
            "revision": "Ember@2.8.1",
            "loc": {
              "source": null,
              "start": {
                "line": 24,
                "column": 4
              },
              "end": {
                "line": 26,
                "column": 4
              }
            },
            "moduleName": "coretheloothound/templates/components/raid-row.hbs"
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("      ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("strong");
            dom.setAttribute(el1, "class", "text-danger");
            var el2 = dom.createTextNode("Not Signed Up!");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes() {
            return [];
          },
          statements: [],
          locals: [],
          templates: []
        };
      })();
      return {
        meta: {
          "revision": "Ember@2.8.1",
          "loc": {
            "source": null,
            "start": {
              "line": 21,
              "column": 2
            },
            "end": {
              "line": 27,
              "column": 2
            }
          },
          "moduleName": "coretheloothound/templates/components/raid-row.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          return morphs;
        },
        statements: [["block", "if", [["get", "accountSignedUp", ["loc", [null, [22, 10], [22, 25]]], 0, 0, 0, 0]], [], 0, 1, ["loc", [null, [22, 4], [26, 11]]]]],
        locals: [],
        templates: [child0, child1]
      };
    })();
    var child6 = (function () {
      var child0 = (function () {
        return {
          meta: {
            "revision": "Ember@2.8.1",
            "loc": {
              "source": null,
              "start": {
                "line": 30,
                "column": 6
              },
              "end": {
                "line": 32,
                "column": 6
              }
            },
            "moduleName": "coretheloothound/templates/components/raid-row.hbs"
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("        ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("i");
            dom.setAttribute(el1, "class", "fa fa-lock fa-fw");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode(" Finalized\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes() {
            return [];
          },
          statements: [],
          locals: [],
          templates: []
        };
      })();
      var child1 = (function () {
        return {
          meta: {
            "revision": "Ember@2.8.1",
            "loc": {
              "source": null,
              "start": {
                "line": 32,
                "column": 6
              },
              "end": {
                "line": 34,
                "column": 6
              }
            },
            "moduleName": "coretheloothound/templates/components/raid-row.hbs"
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("        ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("i");
            dom.setAttribute(el1, "class", "fa fa-unlock fa-fw");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode(" Not Finalized\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes() {
            return [];
          },
          statements: [],
          locals: [],
          templates: []
        };
      })();
      return {
        meta: {
          "revision": "Ember@2.8.1",
          "loc": {
            "source": null,
            "start": {
              "line": 29,
              "column": 4
            },
            "end": {
              "line": 35,
              "column": 4
            }
          },
          "moduleName": "coretheloothound/templates/components/raid-row.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [["block", "if", [["get", "raid.finalized", ["loc", [null, [30, 12], [30, 26]]], 0, 0, 0, 0]], [], 0, 1, ["loc", [null, [30, 6], [34, 13]]]]],
        locals: [],
        templates: [child0, child1]
      };
    })();
    return {
      meta: {
        "revision": "Ember@2.8.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 43,
            "column": 0
          }
        },
        "moduleName": "coretheloothound/templates/components/raid-row.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("td");
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("td");
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("td");
        var el2 = dom.createElement("i");
        dom.setAttribute(el2, "class", "fa fa-calendar");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode(" ");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("br");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("small");
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("td");
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("br");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("small");
        var el3 = dom.createTextNode("\n");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("td");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("span");
        dom.setAttribute(el2, "title", "Accounts signed up");
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode(" ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("i");
        dom.setAttribute(el3, "class", "fa fa-users fa-fw");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("   \n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("span");
        dom.setAttribute(el2, "title", "Accounts on the waiting list");
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode(" ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("i");
        dom.setAttribute(el3, "class", "fa fa-bars fa-fw");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("   \n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("span");
        dom.setAttribute(el2, "title", "Seated accounts");
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode(" ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("i");
        dom.setAttribute(el3, "class", "fa fa-check fa-fw");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("   \n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element0 = dom.childAt(fragment, [2]);
        var element1 = dom.childAt(fragment, [4]);
        var element2 = dom.childAt(fragment, [6]);
        var element3 = dom.childAt(fragment, [8]);
        var morphs = new Array(10);
        morphs[0] = dom.createMorphAt(dom.childAt(fragment, [0]), 1, 1);
        morphs[1] = dom.createMorphAt(element0, 1, 1);
        morphs[2] = dom.createMorphAt(element0, 2, 2);
        morphs[3] = dom.createMorphAt(element1, 2, 2);
        morphs[4] = dom.createMorphAt(dom.childAt(element1, [4]), 0, 0);
        morphs[5] = dom.createMorphAt(element2, 1, 1);
        morphs[6] = dom.createMorphAt(dom.childAt(element2, [4]), 1, 1);
        morphs[7] = dom.createMorphAt(dom.childAt(element3, [1]), 0, 0);
        morphs[8] = dom.createMorphAt(dom.childAt(element3, [3]), 0, 0);
        morphs[9] = dom.createMorphAt(dom.childAt(element3, [5]), 0, 0);
        return morphs;
      },
      statements: [["block", "if", [["get", "raid.guild", ["loc", [null, [2, 8], [2, 18]]], 0, 0, 0, 0]], [], 0, null, ["loc", [null, [2, 2], [5, 9]]]], ["block", "if", [["get", "raid.admin", ["loc", [null, [8, 8], [8, 18]]], 0, 0, 0, 0]], [], 1, null, ["loc", [null, [8, 2], [10, 9]]]], ["block", "if", [["get", "raid.note", ["loc", [null, [11, 8], [11, 17]]], 0, 0, 0, 0]], [], 2, 3, ["loc", [null, [11, 2], [15, 9]]]], ["content", "raid.dateCalendar", ["loc", [null, [17, 35], [17, 56]]], 0, 0, 0, 0], ["content", "raid.dateAgo", ["loc", [null, [17, 68], [17, 84]]], 0, 0, 0, 0], ["block", "if", [["get", "accountSeated", ["loc", [null, [19, 8], [19, 21]]], 0, 0, 0, 0]], [], 4, 5, ["loc", [null, [19, 2], [27, 9]]]], ["block", "if", [["get", "raid.hidden", ["loc", [null, [29, 10], [29, 21]]], 0, 0, 0, 0]], [], 6, null, ["loc", [null, [29, 4], [35, 11]]]], ["content", "raid.accountSignups", ["loc", [null, [39, 35], [39, 58]]], 0, 0, 0, 0], ["content", "raid.accountWaitingList", ["loc", [null, [40, 45], [40, 72]]], 0, 0, 0, 0], ["content", "raid.accountSeated", ["loc", [null, [41, 32], [41, 54]]], 0, 0, 0, 0]],
      locals: [],
      templates: [child0, child1, child2, child3, child4, child5, child6]
    };
  })());
});
define("coretheloothound/templates/components/raid-signup", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      return {
        meta: {
          "revision": "Ember@2.8.1",
          "loc": {
            "source": null,
            "start": {
              "line": 1,
              "column": 0
            },
            "end": {
              "line": 3,
              "column": 0
            }
          },
          "moduleName": "coretheloothound/templates/components/raid-signup.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("i");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element6 = dom.childAt(fragment, [1]);
          var morphs = new Array(1);
          morphs[0] = dom.createAttrMorph(element6, 'class');
          return morphs;
        },
        statements: [["attribute", "class", ["concat", [["get", "iconClasses", ["loc", [null, [2, 14], [2, 25]]], 0, 0, 0, 0]], 0, 0, 0, 0, 0], 0, 0, 0, 0]],
        locals: [],
        templates: []
      };
    })();
    var child1 = (function () {
      var child0 = (function () {
        return {
          meta: {
            "revision": "Ember@2.8.1",
            "loc": {
              "source": null,
              "start": {
                "line": 7,
                "column": 4
              },
              "end": {
                "line": 9,
                "column": 4
              }
            },
            "moduleName": "coretheloothound/templates/components/raid-signup.hbs"
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("      ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("a");
            var el2 = dom.createElement("i");
            dom.setAttribute(el2, "class", "fa fa-arrow-circle-left fa-fw");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var element3 = dom.childAt(fragment, [1]);
            var morphs = new Array(1);
            morphs[0] = dom.createElementMorph(element3);
            return morphs;
          },
          statements: [["element", "action", ["unseat"], [], ["loc", [null, [8, 9], [8, 28]]], 0, 0]],
          locals: [],
          templates: []
        };
      })();
      var child1 = (function () {
        var child0 = (function () {
          var child0 = (function () {
            return {
              meta: {
                "revision": "Ember@2.8.1",
                "loc": {
                  "source": null,
                  "start": {
                    "line": 11,
                    "column": 8
                  },
                  "end": {
                    "line": 13,
                    "column": 8
                  }
                },
                "moduleName": "coretheloothound/templates/components/raid-signup.hbs"
              },
              isEmpty: false,
              arity: 1,
              cachedFragment: null,
              hasRendered: false,
              buildFragment: function buildFragment(dom) {
                var el0 = dom.createDocumentFragment();
                var el1 = dom.createTextNode("        ");
                dom.appendChild(el0, el1);
                var el1 = dom.createElement("a");
                var el2 = dom.createElement("i");
                dom.appendChild(el1, el2);
                dom.appendChild(el0, el1);
                var el1 = dom.createTextNode("\n");
                dom.appendChild(el0, el1);
                return el0;
              },
              buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
                var element1 = dom.childAt(fragment, [1]);
                var element2 = dom.childAt(element1, [0]);
                var morphs = new Array(2);
                morphs[0] = dom.createElementMorph(element1);
                morphs[1] = dom.createAttrMorph(element2, 'class');
                return morphs;
              },
              statements: [["element", "action", ["seat", ["get", "role", ["loc", [null, [12, 27], [12, 31]]], 0, 0, 0, 0]], [], ["loc", [null, [12, 11], [12, 33]]], 0, 0], ["attribute", "class", ["concat", [["get", "role.iconClasses", ["loc", [null, [12, 46], [12, 62]]], 0, 0, 0, 0]], 0, 0, 0, 0, 0], 0, 0, 0, 0]],
              locals: ["role"],
              templates: []
            };
          })();
          return {
            meta: {
              "revision": "Ember@2.8.1",
              "loc": {
                "source": null,
                "start": {
                  "line": 10,
                  "column": 6
                },
                "end": {
                  "line": 14,
                  "column": 6
                }
              },
              "moduleName": "coretheloothound/templates/components/raid-signup.hbs"
            },
            isEmpty: false,
            arity: 0,
            cachedFragment: null,
            hasRendered: false,
            buildFragment: function buildFragment(dom) {
              var el0 = dom.createDocumentFragment();
              var el1 = dom.createComment("");
              dom.appendChild(el0, el1);
              return el0;
            },
            buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
              var morphs = new Array(1);
              morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
              dom.insertBoundary(fragment, 0);
              dom.insertBoundary(fragment, null);
              return morphs;
            },
            statements: [["block", "each", [["get", "sortedRoles", ["loc", [null, [11, 16], [11, 27]]], 0, 0, 0, 0]], [], 0, null, ["loc", [null, [11, 8], [13, 17]]]]],
            locals: [],
            templates: [child0]
          };
        })();
        return {
          meta: {
            "revision": "Ember@2.8.1",
            "loc": {
              "source": null,
              "start": {
                "line": 9,
                "column": 4
              },
              "end": {
                "line": 15,
                "column": 4
              }
            },
            "moduleName": "coretheloothound/templates/components/raid-signup.hbs"
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createComment("");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var morphs = new Array(1);
            morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
            dom.insertBoundary(fragment, 0);
            dom.insertBoundary(fragment, null);
            return morphs;
          },
          statements: [["block", "if", [["get", "canBeSeated", ["loc", [null, [10, 12], [10, 23]]], 0, 0, 0, 0]], [], 0, null, ["loc", [null, [10, 6], [14, 13]]]]],
          locals: [],
          templates: [child0]
        };
      })();
      return {
        meta: {
          "revision": "Ember@2.8.1",
          "loc": {
            "source": null,
            "start": {
              "line": 5,
              "column": 0
            },
            "end": {
              "line": 18,
              "column": 0
            }
          },
          "moduleName": "coretheloothound/templates/components/raid-signup.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("span");
          dom.setAttribute(el1, "class", "seat pull-right");
          var el2 = dom.createTextNode("\n");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("    ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("a");
          var el3 = dom.createElement("i");
          dom.setAttribute(el3, "class", "fa fa-close fa-fw");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n  ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element4 = dom.childAt(fragment, [1]);
          var element5 = dom.childAt(element4, [3]);
          var morphs = new Array(2);
          morphs[0] = dom.createMorphAt(element4, 1, 1);
          morphs[1] = dom.createElementMorph(element5);
          return morphs;
        },
        statements: [["block", "if", [["get", "signup.seated", ["loc", [null, [7, 10], [7, 23]]], 0, 0, 0, 0]], [], 0, 1, ["loc", [null, [7, 4], [15, 11]]]], ["element", "action", ["unsignup"], [], ["loc", [null, [16, 7], [16, 28]]], 0, 0]],
        locals: [],
        templates: [child0, child1]
      };
    })();
    var child2 = (function () {
      var child0 = (function () {
        return {
          meta: {
            "revision": "Ember@2.8.1",
            "loc": {
              "source": null,
              "start": {
                "line": 19,
                "column": 2
              },
              "end": {
                "line": 21,
                "column": 2
              }
            },
            "moduleName": "coretheloothound/templates/components/raid-signup.hbs"
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("    ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("a");
            var el2 = dom.createElement("i");
            dom.setAttribute(el2, "class", "fa fa-close fa-fw");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var element0 = dom.childAt(fragment, [1]);
            var morphs = new Array(1);
            morphs[0] = dom.createElementMorph(element0);
            return morphs;
          },
          statements: [["element", "action", ["unsignup"], [], ["loc", [null, [20, 7], [20, 28]]], 0, 0]],
          locals: [],
          templates: []
        };
      })();
      return {
        meta: {
          "revision": "Ember@2.8.1",
          "loc": {
            "source": null,
            "start": {
              "line": 18,
              "column": 0
            },
            "end": {
              "line": 22,
              "column": 0
            }
          },
          "moduleName": "coretheloothound/templates/components/raid-signup.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [["block", "if", [["get", "mine", ["loc", [null, [19, 8], [19, 12]]], 0, 0, 0, 0]], [], 0, null, ["loc", [null, [19, 2], [21, 9]]]]],
        locals: [],
        templates: [child0]
      };
    })();
    return {
      meta: {
        "revision": "Ember@2.8.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 23,
            "column": 0
          }
        },
        "moduleName": "coretheloothound/templates/components/raid-signup.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("span");
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode(" ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("small");
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element7 = dom.childAt(fragment, [1]);
        var morphs = new Array(5);
        morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
        morphs[1] = dom.createAttrMorph(element7, 'class');
        morphs[2] = dom.createMorphAt(element7, 0, 0);
        morphs[3] = dom.createMorphAt(dom.childAt(element7, [2]), 0, 0);
        morphs[4] = dom.createMorphAt(fragment, 3, 3, contextualElement);
        dom.insertBoundary(fragment, 0);
        dom.insertBoundary(fragment, null);
        return morphs;
      },
      statements: [["block", "if", [["get", "signup.seated", ["loc", [null, [1, 6], [1, 19]]], 0, 0, 0, 0]], [], 0, null, ["loc", [null, [1, 0], [3, 7]]]], ["attribute", "class", ["concat", [["get", "classes", ["loc", [null, [4, 15], [4, 22]]], 0, 0, 0, 0]], 0, 0, 0, 0, 0], 0, 0, 0, 0], ["content", "signup.character.name", ["loc", [null, [4, 26], [4, 51]]], 0, 0, 0, 0], ["content", "signup.character.item_level", ["loc", [null, [4, 59], [4, 90]]], 0, 0, 0, 0], ["block", "if", [["get", "signup.raid.admin", ["loc", [null, [5, 6], [5, 23]]], 0, 0, 0, 0]], [], 1, 2, ["loc", [null, [5, 0], [22, 7]]]]],
      locals: [],
      templates: [child0, child1, child2]
    };
  })());
});
define("coretheloothound/templates/index", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "revision": "Ember@2.8.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 1,
            "column": 0
          }
        },
        "moduleName": "coretheloothound/templates/index.hbs"
      },
      isEmpty: true,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        return el0;
      },
      buildRenderNodes: function buildRenderNodes() {
        return [];
      },
      statements: [],
      locals: [],
      templates: []
    };
  })());
});
define("coretheloothound/templates/raid", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      return {
        meta: {
          "revision": "Ember@2.8.1",
          "loc": {
            "source": null,
            "start": {
              "line": 12,
              "column": 6
            },
            "end": {
              "line": 17,
              "column": 6
            }
          },
          "moduleName": "coretheloothound/templates/raid.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("        ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1, "class", "alert alert-success");
          dom.setAttribute(el1, "role", "alert");
          var el2 = dom.createTextNode("\n          ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("strong");
          var el3 = dom.createTextNode("Seated");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n          on ");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode(". See you at the raid!\n        ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(dom.childAt(fragment, [1]), 3, 3);
          return morphs;
        },
        statements: [["content", "currentAccountSeated.character.name", ["loc", [null, [15, 13], [15, 52]]], 0, 0, 0, 0]],
        locals: [],
        templates: []
      };
    })();
    var child1 = (function () {
      var child0 = (function () {
        return {
          meta: {
            "revision": "Ember@2.8.1",
            "loc": {
              "source": null,
              "start": {
                "line": 18,
                "column": 8
              },
              "end": {
                "line": 22,
                "column": 8
              }
            },
            "moduleName": "coretheloothound/templates/raid.hbs"
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("          ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("div");
            dom.setAttribute(el1, "class", "alert alert-info");
            dom.setAttribute(el1, "role", "alert");
            var el2 = dom.createTextNode("\n            You have ");
            dom.appendChild(el1, el2);
            var el2 = dom.createComment("");
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode(" characters on the ");
            dom.appendChild(el1, el2);
            var el2 = dom.createElement("strong");
            var el3 = dom.createTextNode("Waiting List");
            dom.appendChild(el2, el3);
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode(".\n          ");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var morphs = new Array(1);
            morphs[0] = dom.createMorphAt(dom.childAt(fragment, [1]), 1, 1);
            return morphs;
          },
          statements: [["content", "currentAccountSignedUp.length", ["loc", [null, [20, 21], [20, 54]]], 0, 0, 0, 0]],
          locals: [],
          templates: []
        };
      })();
      var child1 = (function () {
        return {
          meta: {
            "revision": "Ember@2.8.1",
            "loc": {
              "source": null,
              "start": {
                "line": 22,
                "column": 8
              },
              "end": {
                "line": 27,
                "column": 8
              }
            },
            "moduleName": "coretheloothound/templates/raid.hbs"
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("          ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("div");
            dom.setAttribute(el1, "class", "alert alert-danger");
            dom.setAttribute(el1, "role", "alert");
            var el2 = dom.createTextNode("\n            ");
            dom.appendChild(el1, el2);
            var el2 = dom.createElement("strong");
            var el3 = dom.createTextNode("Not Signed Up!");
            dom.appendChild(el2, el3);
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n            Sign up using the form below!\n          ");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes() {
            return [];
          },
          statements: [],
          locals: [],
          templates: []
        };
      })();
      return {
        meta: {
          "revision": "Ember@2.8.1",
          "loc": {
            "source": null,
            "start": {
              "line": 17,
              "column": 6
            },
            "end": {
              "line": 28,
              "column": 6
            }
          },
          "moduleName": "coretheloothound/templates/raid.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [["block", "if", [["get", "currentAccountSignedUp", ["loc", [null, [18, 14], [18, 36]]], 0, 0, 0, 0]], [], 0, 1, ["loc", [null, [18, 8], [27, 15]]]]],
        locals: [],
        templates: [child0, child1]
      };
    })();
    var child2 = (function () {
      return {
        meta: {
          "revision": "Ember@2.8.1",
          "loc": {
            "source": null,
            "start": {
              "line": 29,
              "column": 6
            },
            "end": {
              "line": 34,
              "column": 6
            }
          },
          "moduleName": "coretheloothound/templates/raid.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("        ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1, "class", "alert alert-danger");
          dom.setAttribute(el1, "role", "alert");
          var el2 = dom.createTextNode("\n          ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("strong");
          var el3 = dom.createTextNode("Raid is not yet finalized!");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n          You will not be able to see the seating arrangement until the raid is finalized.\n        ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() {
          return [];
        },
        statements: [],
        locals: [],
        templates: []
      };
    })();
    return {
      meta: {
        "revision": "Ember@2.8.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 39,
            "column": 0
          }
        },
        "moduleName": "coretheloothound/templates/raid.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "class", "raid");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("section");
        dom.setAttribute(el2, "class", "title");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("h1");
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3, "class", "stats");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4, "title", "Seated accounts");
        dom.setAttribute(el4, "class", "stat");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode(" ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("i");
        dom.setAttribute(el5, "class", "fa fa-check fa-fw");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4, "title", "Accounts on the waiting list");
        dom.setAttribute(el4, "class", "stat");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode(" ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("i");
        dom.setAttribute(el5, "class", "fa fa-bars fa-fw");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4, "title", "Accounts signed up");
        dom.setAttribute(el4, "class", "stat");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode(" ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("i");
        dom.setAttribute(el5, "class", "fa fa-users fa-fw");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("section");
        dom.setAttribute(el2, "class", "alerts");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3, "class", "wrapper");
        var el4 = dom.createTextNode("\n");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element0 = dom.childAt(fragment, [0]);
        var element1 = dom.childAt(element0, [1]);
        var element2 = dom.childAt(element1, [1]);
        var element3 = dom.childAt(element1, [3]);
        var element4 = dom.childAt(element0, [3, 1]);
        var morphs = new Array(8);
        morphs[0] = dom.createMorphAt(element2, 0, 0);
        morphs[1] = dom.createMorphAt(element2, 1, 1);
        morphs[2] = dom.createMorphAt(dom.childAt(element3, [1]), 0, 0);
        morphs[3] = dom.createMorphAt(dom.childAt(element3, [3]), 0, 0);
        morphs[4] = dom.createMorphAt(dom.childAt(element3, [5]), 0, 0);
        morphs[5] = dom.createMorphAt(element4, 1, 1);
        morphs[6] = dom.createMorphAt(element4, 2, 2);
        morphs[7] = dom.createMorphAt(element0, 5, 5);
        return morphs;
      },
      statements: [["inline", "guild-icon", [], ["guild", ["subexpr", "@mut", [["get", "model.guild", ["loc", [null, [3, 27], [3, 38]]], 0, 0, 0, 0]], [], [], 0, 0]], ["loc", [null, [3, 8], [3, 40]]], 0, 0], ["content", "model.name", ["loc", [null, [3, 40], [3, 54]]], 0, 0, 0, 0], ["content", "model.accountSeated", ["loc", [null, [5, 48], [5, 71]]], 0, 0, 0, 0], ["content", "model.accountWaitingList", ["loc", [null, [6, 61], [6, 89]]], 0, 0, 0, 0], ["content", "model.accountSignups", ["loc", [null, [7, 51], [7, 75]]], 0, 0, 0, 0], ["block", "if", [["get", "currentAccountSeated", ["loc", [null, [12, 12], [12, 32]]], 0, 0, 0, 0]], [], 0, 1, ["loc", [null, [12, 6], [28, 13]]]], ["block", "if", [["get", "model.hiddenAndNotFinalized", ["loc", [null, [29, 12], [29, 39]]], 0, 0, 0, 0]], [], 2, null, ["loc", [null, [29, 6], [34, 13]]]], ["content", "liquid-outlet", ["loc", [null, [37, 2], [37, 19]]], 0, 0, 0, 0]],
      locals: [],
      templates: [child0, child1, child2]
    };
  })());
});
define("coretheloothound/templates/raid/edit", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      var child0 = (function () {
        return {
          meta: {
            "revision": "Ember@2.8.1",
            "loc": {
              "source": null,
              "start": {
                "line": 6,
                "column": 6
              },
              "end": {
                "line": 8,
                "column": 6
              }
            },
            "moduleName": "coretheloothound/templates/raid/edit.hbs"
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("        ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("p");
            var el2 = dom.createElement("i");
            dom.setAttribute(el2, "class", "fa fa-lock fa-fw");
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode(" ");
            dom.appendChild(el1, el2);
            var el2 = dom.createElement("a");
            var el3 = dom.createTextNode("Finalized");
            dom.appendChild(el2, el3);
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var element2 = dom.childAt(fragment, [1, 2]);
            var morphs = new Array(1);
            morphs[0] = dom.createElementMorph(element2);
            return morphs;
          },
          statements: [["element", "action", ["unfinalize"], [], ["loc", [null, [7, 47], [7, 70]]], 0, 0]],
          locals: [],
          templates: []
        };
      })();
      var child1 = (function () {
        return {
          meta: {
            "revision": "Ember@2.8.1",
            "loc": {
              "source": null,
              "start": {
                "line": 8,
                "column": 6
              },
              "end": {
                "line": 10,
                "column": 6
              }
            },
            "moduleName": "coretheloothound/templates/raid/edit.hbs"
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("        ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("p");
            var el2 = dom.createElement("i");
            dom.setAttribute(el2, "class", "fa fa-unlock fa-fw");
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode(" ");
            dom.appendChild(el1, el2);
            var el2 = dom.createElement("a");
            var el3 = dom.createTextNode("Not Finalized");
            dom.appendChild(el2, el3);
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var element1 = dom.childAt(fragment, [1, 2]);
            var morphs = new Array(1);
            morphs[0] = dom.createElementMorph(element1);
            return morphs;
          },
          statements: [["element", "action", ["finalize"], [], ["loc", [null, [9, 49], [9, 70]]], 0, 0]],
          locals: [],
          templates: []
        };
      })();
      return {
        meta: {
          "revision": "Ember@2.8.1",
          "loc": {
            "source": null,
            "start": {
              "line": 5,
              "column": 4
            },
            "end": {
              "line": 12,
              "column": 4
            }
          },
          "moduleName": "coretheloothound/templates/raid/edit.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("      ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("p");
          var el2 = dom.createElement("i");
          dom.setAttribute(el2, "class", "fa fa-eye-slash fa-fw");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode(" ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("a");
          var el3 = dom.createTextNode("Hidden");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element3 = dom.childAt(fragment, [2, 2]);
          var morphs = new Array(2);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          morphs[1] = dom.createElementMorph(element3);
          dom.insertBoundary(fragment, 0);
          return morphs;
        },
        statements: [["block", "if", [["get", "model.finalized", ["loc", [null, [6, 12], [6, 27]]], 0, 0, 0, 0]], [], 0, 1, ["loc", [null, [6, 6], [10, 13]]]], ["element", "action", ["unhide"], [], ["loc", [null, [11, 50], [11, 69]]], 0, 0]],
        locals: [],
        templates: [child0, child1]
      };
    })();
    var child1 = (function () {
      return {
        meta: {
          "revision": "Ember@2.8.1",
          "loc": {
            "source": null,
            "start": {
              "line": 12,
              "column": 4
            },
            "end": {
              "line": 14,
              "column": 4
            }
          },
          "moduleName": "coretheloothound/templates/raid/edit.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("      ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("p");
          var el2 = dom.createElement("i");
          dom.setAttribute(el2, "class", "fa fa-eye fa-fw");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode(" ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("a");
          var el3 = dom.createTextNode("Visible");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element0 = dom.childAt(fragment, [1, 2]);
          var morphs = new Array(1);
          morphs[0] = dom.createElementMorph(element0);
          return morphs;
        },
        statements: [["element", "action", ["hide"], [], ["loc", [null, [13, 44], [13, 61]]], 0, 0]],
        locals: [],
        templates: []
      };
    })();
    var child2 = (function () {
      return {
        meta: {
          "revision": "Ember@2.8.1",
          "loc": {
            "source": null,
            "start": {
              "line": 16,
              "column": 46
            },
            "end": {
              "line": 16,
              "column": 81
            }
          },
          "moduleName": "coretheloothound/templates/raid/edit.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("Back");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() {
          return [];
        },
        statements: [],
        locals: [],
        templates: []
      };
    })();
    var child3 = (function () {
      return {
        meta: {
          "revision": "Ember@2.8.1",
          "loc": {
            "source": null,
            "start": {
              "line": 17,
              "column": 4
            },
            "end": {
              "line": 17,
              "column": 83
            }
          },
          "moduleName": "coretheloothound/templates/raid/edit.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createElement("p");
          var el2 = dom.createElement("i");
          dom.setAttribute(el2, "class", "fa fa-file-text-o fa-fw");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode(" ");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(dom.childAt(fragment, [0]), 2, 2);
          return morphs;
        },
        statements: [["content", "model.note", ["loc", [null, [17, 65], [17, 79]]], 0, 0, 0, 0]],
        locals: [],
        templates: []
      };
    })();
    return {
      meta: {
        "revision": "Ember@2.8.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 23,
            "column": 0
          }
        },
        "moduleName": "coretheloothound/templates/raid/edit.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "class", "raid-wrapper");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("section");
        dom.setAttribute(el2, "class", "info");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("p");
        var el4 = dom.createElement("i");
        dom.setAttribute(el4, "class", "fa fa-calendar fa-fw");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode(" ");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode(" ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("small");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("p");
        var el4 = dom.createElement("i");
        dom.setAttribute(el4, "class", "fa fa-users fa-fw");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode(" ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("a");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("p");
        var el4 = dom.createElement("i");
        dom.setAttribute(el4, "class", "fa fa-trash-o fa-fw");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode(" ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("a");
        var el5 = dom.createTextNode("Delete");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("p");
        var el4 = dom.createElement("i");
        dom.setAttribute(el4, "class", "fa fa-arrow-left fa-fw");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode(" ");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("section");
        dom.setAttribute(el2, "class", "signups");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element4 = dom.childAt(fragment, [0]);
        var element5 = dom.childAt(element4, [1]);
        var element6 = dom.childAt(element5, [1]);
        var element7 = dom.childAt(element5, [3, 2]);
        var element8 = dom.childAt(element5, [7, 2]);
        var morphs = new Array(9);
        morphs[0] = dom.createMorphAt(element6, 2, 2);
        morphs[1] = dom.createMorphAt(dom.childAt(element6, [4]), 0, 0);
        morphs[2] = dom.createAttrMorph(element7, 'href');
        morphs[3] = dom.createMorphAt(element7, 0, 0);
        morphs[4] = dom.createMorphAt(element5, 5, 5);
        morphs[5] = dom.createElementMorph(element8);
        morphs[6] = dom.createMorphAt(dom.childAt(element5, [9]), 2, 2);
        morphs[7] = dom.createMorphAt(element5, 11, 11);
        morphs[8] = dom.createMorphAt(dom.childAt(element4, [3]), 1, 1);
        return morphs;
      },
      statements: [["content", "model.dateCalendar", ["loc", [null, [3, 44], [3, 66]]], 0, 0, 0, 0], ["content", "model.dateAgo", ["loc", [null, [3, 74], [3, 91]]], 0, 0, 0, 0], ["attribute", "href", ["concat", [["get", "model.guild.url", ["loc", [null, [4, 52], [4, 67]]], 0, 0, 0, 0]], 0, 0, 0, 0, 0], 0, 0, 0, 0], ["content", "model.guild.name", ["loc", [null, [4, 71], [4, 91]]], 0, 0, 0, 0], ["block", "if", [["get", "model.hidden", ["loc", [null, [5, 10], [5, 22]]], 0, 0, 0, 0]], [], 0, 1, ["loc", [null, [5, 4], [14, 11]]]], ["element", "action", ["delete"], [], ["loc", [null, [15, 46], [15, 65]]], 0, 0], ["block", "link-to", ["raid.index", ["get", "model", ["loc", [null, [16, 70], [16, 75]]], 0, 0, 0, 0]], [], 2, null, ["loc", [null, [16, 46], [16, 93]]]], ["block", "if", [["get", "model.note", ["loc", [null, [17, 10], [17, 20]]], 0, 0, 0, 0]], [], 3, null, ["loc", [null, [17, 4], [17, 90]]]], ["inline", "raid-permissions", [], ["raid", ["subexpr", "@mut", [["get", "model", ["loc", [null, [20, 28], [20, 33]]], 0, 0, 0, 0]], [], [], 0, 0], "account", ["subexpr", "@mut", [["get", "model.account", ["loc", [null, [20, 42], [20, 55]]], 0, 0, 0, 0]], [], [], 0, 0], "newPermission", "newPermission", "deletePermission", "deletePermission"], ["loc", [null, [20, 4], [20, 123]]], 0, 0]],
      locals: [],
      templates: [child0, child1, child2, child3]
    };
  })());
});
define("coretheloothound/templates/raid/index", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      var child0 = (function () {
        var child0 = (function () {
          return {
            meta: {
              "revision": "Ember@2.8.1",
              "loc": {
                "source": null,
                "start": {
                  "line": 7,
                  "column": 8
                },
                "end": {
                  "line": 9,
                  "column": 8
                }
              },
              "moduleName": "coretheloothound/templates/raid/index.hbs"
            },
            isEmpty: false,
            arity: 0,
            cachedFragment: null,
            hasRendered: false,
            buildFragment: function buildFragment(dom) {
              var el0 = dom.createDocumentFragment();
              var el1 = dom.createTextNode("          ");
              dom.appendChild(el0, el1);
              var el1 = dom.createElement("p");
              var el2 = dom.createElement("i");
              dom.setAttribute(el2, "class", "fa fa-lock fa-fw");
              dom.appendChild(el1, el2);
              var el2 = dom.createTextNode(" ");
              dom.appendChild(el1, el2);
              var el2 = dom.createElement("a");
              var el3 = dom.createTextNode("Finalized");
              dom.appendChild(el2, el3);
              dom.appendChild(el1, el2);
              dom.appendChild(el0, el1);
              var el1 = dom.createTextNode("\n");
              dom.appendChild(el0, el1);
              return el0;
            },
            buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
              var element5 = dom.childAt(fragment, [1, 2]);
              var morphs = new Array(1);
              morphs[0] = dom.createElementMorph(element5);
              return morphs;
            },
            statements: [["element", "action", ["unfinalize"], [], ["loc", [null, [8, 49], [8, 72]]], 0, 0]],
            locals: [],
            templates: []
          };
        })();
        var child1 = (function () {
          return {
            meta: {
              "revision": "Ember@2.8.1",
              "loc": {
                "source": null,
                "start": {
                  "line": 9,
                  "column": 8
                },
                "end": {
                  "line": 11,
                  "column": 8
                }
              },
              "moduleName": "coretheloothound/templates/raid/index.hbs"
            },
            isEmpty: false,
            arity: 0,
            cachedFragment: null,
            hasRendered: false,
            buildFragment: function buildFragment(dom) {
              var el0 = dom.createDocumentFragment();
              var el1 = dom.createTextNode("          ");
              dom.appendChild(el0, el1);
              var el1 = dom.createElement("p");
              var el2 = dom.createElement("i");
              dom.setAttribute(el2, "class", "fa fa-unlock fa-fw");
              dom.appendChild(el1, el2);
              var el2 = dom.createTextNode(" ");
              dom.appendChild(el1, el2);
              var el2 = dom.createElement("a");
              var el3 = dom.createTextNode("Not Finalized");
              dom.appendChild(el2, el3);
              dom.appendChild(el1, el2);
              dom.appendChild(el0, el1);
              var el1 = dom.createTextNode("\n");
              dom.appendChild(el0, el1);
              return el0;
            },
            buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
              var element4 = dom.childAt(fragment, [1, 2]);
              var morphs = new Array(1);
              morphs[0] = dom.createElementMorph(element4);
              return morphs;
            },
            statements: [["element", "action", ["finalize"], [], ["loc", [null, [10, 51], [10, 72]]], 0, 0]],
            locals: [],
            templates: []
          };
        })();
        return {
          meta: {
            "revision": "Ember@2.8.1",
            "loc": {
              "source": null,
              "start": {
                "line": 6,
                "column": 6
              },
              "end": {
                "line": 13,
                "column": 6
              }
            },
            "moduleName": "coretheloothound/templates/raid/index.hbs"
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createComment("");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("        ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("p");
            var el2 = dom.createElement("i");
            dom.setAttribute(el2, "class", "fa fa-eye-slash fa-fw");
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode(" ");
            dom.appendChild(el1, el2);
            var el2 = dom.createElement("a");
            var el3 = dom.createTextNode("Hidden");
            dom.appendChild(el2, el3);
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var element6 = dom.childAt(fragment, [2, 2]);
            var morphs = new Array(2);
            morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
            morphs[1] = dom.createElementMorph(element6);
            dom.insertBoundary(fragment, 0);
            return morphs;
          },
          statements: [["block", "if", [["get", "model.finalized", ["loc", [null, [7, 14], [7, 29]]], 0, 0, 0, 0]], [], 0, 1, ["loc", [null, [7, 8], [11, 15]]]], ["element", "action", ["unhide"], [], ["loc", [null, [12, 52], [12, 71]]], 0, 0]],
          locals: [],
          templates: [child0, child1]
        };
      })();
      var child1 = (function () {
        return {
          meta: {
            "revision": "Ember@2.8.1",
            "loc": {
              "source": null,
              "start": {
                "line": 13,
                "column": 6
              },
              "end": {
                "line": 15,
                "column": 6
              }
            },
            "moduleName": "coretheloothound/templates/raid/index.hbs"
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("        ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("p");
            var el2 = dom.createElement("i");
            dom.setAttribute(el2, "class", "fa fa-eye fa-fw");
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode(" ");
            dom.appendChild(el1, el2);
            var el2 = dom.createElement("a");
            var el3 = dom.createTextNode("Visible");
            dom.appendChild(el2, el3);
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var element3 = dom.childAt(fragment, [1, 2]);
            var morphs = new Array(1);
            morphs[0] = dom.createElementMorph(element3);
            return morphs;
          },
          statements: [["element", "action", ["hide"], [], ["loc", [null, [14, 46], [14, 63]]], 0, 0]],
          locals: [],
          templates: []
        };
      })();
      var child2 = (function () {
        return {
          meta: {
            "revision": "Ember@2.8.1",
            "loc": {
              "source": null,
              "start": {
                "line": 17,
                "column": 44
              },
              "end": {
                "line": 17,
                "column": 83
              }
            },
            "moduleName": "coretheloothound/templates/raid/index.hbs"
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("Edit");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes() {
            return [];
          },
          statements: [],
          locals: [],
          templates: []
        };
      })();
      return {
        meta: {
          "revision": "Ember@2.8.1",
          "loc": {
            "source": null,
            "start": {
              "line": 5,
              "column": 4
            },
            "end": {
              "line": 18,
              "column": 4
            }
          },
          "moduleName": "coretheloothound/templates/raid/index.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("      ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("p");
          var el2 = dom.createElement("i");
          dom.setAttribute(el2, "class", "fa fa-legal fa-fw");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode(" You're an admin");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n      ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("p");
          var el2 = dom.createElement("i");
          dom.setAttribute(el2, "class", "fa fa-pencil fa-fw");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode(" ");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(2);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          morphs[1] = dom.createMorphAt(dom.childAt(fragment, [4]), 2, 2);
          dom.insertBoundary(fragment, 0);
          return morphs;
        },
        statements: [["block", "if", [["get", "model.hidden", ["loc", [null, [6, 12], [6, 24]]], 0, 0, 0, 0]], [], 0, 1, ["loc", [null, [6, 6], [15, 13]]]], ["block", "link-to", ["raid.edit", ["get", "this.model", ["loc", [null, [17, 67], [17, 77]]], 0, 0, 0, 0]], [], 2, null, ["loc", [null, [17, 44], [17, 95]]]]],
        locals: [],
        templates: [child0, child1, child2]
      };
    })();
    var child1 = (function () {
      var child0 = (function () {
        return {
          meta: {
            "revision": "Ember@2.8.1",
            "loc": {
              "source": null,
              "start": {
                "line": 19,
                "column": 6
              },
              "end": {
                "line": 21,
                "column": 6
              }
            },
            "moduleName": "coretheloothound/templates/raid/index.hbs"
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("        ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("p");
            var el2 = dom.createElement("i");
            dom.setAttribute(el2, "class", "fa fa-lock fa-fw");
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode(" Finalized");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes() {
            return [];
          },
          statements: [],
          locals: [],
          templates: []
        };
      })();
      var child1 = (function () {
        return {
          meta: {
            "revision": "Ember@2.8.1",
            "loc": {
              "source": null,
              "start": {
                "line": 21,
                "column": 6
              },
              "end": {
                "line": 23,
                "column": 6
              }
            },
            "moduleName": "coretheloothound/templates/raid/index.hbs"
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("        ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("p");
            var el2 = dom.createElement("i");
            dom.setAttribute(el2, "class", "fa fa-unlock fa-fw");
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode(" Not Finalized");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes() {
            return [];
          },
          statements: [],
          locals: [],
          templates: []
        };
      })();
      return {
        meta: {
          "revision": "Ember@2.8.1",
          "loc": {
            "source": null,
            "start": {
              "line": 18,
              "column": 4
            },
            "end": {
              "line": 24,
              "column": 4
            }
          },
          "moduleName": "coretheloothound/templates/raid/index.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [["block", "if", [["get", "model.finalized", ["loc", [null, [19, 12], [19, 27]]], 0, 0, 0, 0]], [], 0, 1, ["loc", [null, [19, 6], [23, 13]]]]],
        locals: [],
        templates: [child0, child1]
      };
    })();
    var child2 = (function () {
      return {
        meta: {
          "revision": "Ember@2.8.1",
          "loc": {
            "source": null,
            "start": {
              "line": 25,
              "column": 4
            },
            "end": {
              "line": 25,
              "column": 83
            }
          },
          "moduleName": "coretheloothound/templates/raid/index.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createElement("p");
          var el2 = dom.createElement("i");
          dom.setAttribute(el2, "class", "fa fa-file-text-o fa-fw");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode(" ");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(dom.childAt(fragment, [0]), 2, 2);
          return morphs;
        },
        statements: [["content", "model.note", ["loc", [null, [25, 65], [25, 79]]], 0, 0, 0, 0]],
        locals: [],
        templates: []
      };
    })();
    var child3 = (function () {
      var child0 = (function () {
        return {
          meta: {
            "revision": "Ember@2.8.1",
            "loc": {
              "source": null,
              "start": {
                "line": 34,
                "column": 10
              },
              "end": {
                "line": 36,
                "column": 10
              }
            },
            "moduleName": "coretheloothound/templates/raid/index.hbs"
          },
          isEmpty: false,
          arity: 1,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("          ");
            dom.appendChild(el0, el1);
            var el1 = dom.createComment("");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var morphs = new Array(1);
            morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
            return morphs;
          },
          statements: [["inline", "raid-signup", [], ["signup", ["subexpr", "@mut", [["get", "signup", ["loc", [null, [35, 31], [35, 37]]], 0, 0, 0, 0]], [], [], 0, 0], "currentAccount", ["subexpr", "@mut", [["get", "currentAccount", ["loc", [null, [35, 53], [35, 67]]], 0, 0, 0, 0]], [], [], 0, 0], "seat", ["subexpr", "action", ["seat"], [], ["loc", [null, [35, 73], [35, 88]]], 0, 0], "unseat", ["subexpr", "action", ["unseat"], [], ["loc", [null, [35, 96], [35, 113]]], 0, 0], "unsignup", ["subexpr", "action", ["unsignup"], [], ["loc", [null, [35, 123], [35, 142]]], 0, 0]], ["loc", [null, [35, 10], [35, 144]]], 0, 0]],
          locals: ["signup"],
          templates: []
        };
      })();
      return {
        meta: {
          "revision": "Ember@2.8.1",
          "loc": {
            "source": null,
            "start": {
              "line": 32,
              "column": 8
            },
            "end": {
              "line": 37,
              "column": 8
            }
          },
          "moduleName": "coretheloothound/templates/raid/index.hbs"
        },
        isEmpty: false,
        arity: 1,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("          ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("h4");
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(2);
          morphs[0] = dom.createMorphAt(dom.childAt(fragment, [1]), 0, 0);
          morphs[1] = dom.createMorphAt(fragment, 3, 3, contextualElement);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [["content", "waitingListAccount.account.battletag", ["loc", [null, [33, 14], [33, 54]]], 0, 0, 0, 0], ["block", "each", [["get", "waitingListAccount.signups", ["loc", [null, [34, 18], [34, 44]]], 0, 0, 0, 0]], [], 0, null, ["loc", [null, [34, 10], [36, 19]]]]],
        locals: ["waitingListAccount"],
        templates: [child0]
      };
    })();
    var child4 = (function () {
      var child0 = (function () {
        return {
          meta: {
            "revision": "Ember@2.8.1",
            "loc": {
              "source": null,
              "start": {
                "line": 42,
                "column": 10
              },
              "end": {
                "line": 44,
                "column": 10
              }
            },
            "moduleName": "coretheloothound/templates/raid/index.hbs"
          },
          isEmpty: false,
          arity: 1,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("          ");
            dom.appendChild(el0, el1);
            var el1 = dom.createComment("");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var morphs = new Array(1);
            morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
            return morphs;
          },
          statements: [["inline", "raid-signup", [], ["signup", ["subexpr", "@mut", [["get", "signup", ["loc", [null, [43, 31], [43, 37]]], 0, 0, 0, 0]], [], [], 0, 0], "currentAccount", ["subexpr", "@mut", [["get", "currentAccount", ["loc", [null, [43, 53], [43, 67]]], 0, 0, 0, 0]], [], [], 0, 0], "seat", ["subexpr", "action", ["seat"], [], ["loc", [null, [43, 73], [43, 88]]], 0, 0], "unseat", ["subexpr", "action", ["unseat"], [], ["loc", [null, [43, 96], [43, 113]]], 0, 0], "unsignup", ["subexpr", "action", ["unsignup"], [], ["loc", [null, [43, 123], [43, 142]]], 0, 0]], ["loc", [null, [43, 10], [43, 144]]], 0, 0]],
          locals: ["signup"],
          templates: []
        };
      })();
      return {
        meta: {
          "revision": "Ember@2.8.1",
          "loc": {
            "source": null,
            "start": {
              "line": 39,
              "column": 6
            },
            "end": {
              "line": 46,
              "column": 6
            }
          },
          "moduleName": "coretheloothound/templates/raid/index.hbs"
        },
        isEmpty: false,
        arity: 1,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("        ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1, "class", "signup-wrapper");
          var el2 = dom.createTextNode("\n          ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("h3");
          var el3 = dom.createElement("i");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode(" ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("small");
          var el4 = dom.createComment("");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("        ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element0 = dom.childAt(fragment, [1]);
          var element1 = dom.childAt(element0, [1]);
          var element2 = dom.childAt(element1, [0]);
          var morphs = new Array(3);
          morphs[0] = dom.createAttrMorph(element2, 'class');
          morphs[1] = dom.createMorphAt(dom.childAt(element1, [2]), 0, 0);
          morphs[2] = dom.createMorphAt(element0, 3, 3);
          return morphs;
        },
        statements: [["attribute", "class", ["concat", [["get", "seatedRole.role.iconClasses", ["loc", [null, [41, 26], [41, 53]]], 0, 0, 0, 0]], 0, 0, 0, 0, 0], 0, 0, 0, 0], ["content", "seatedRole.role.name", ["loc", [null, [41, 69], [41, 93]]], 0, 0, 0, 0], ["block", "each", [["get", "seatedRole.signups", ["loc", [null, [42, 18], [42, 36]]], 0, 0, 0, 0]], [], 0, null, ["loc", [null, [42, 10], [44, 19]]]]],
        locals: ["seatedRole"],
        templates: [child0]
      };
    })();
    return {
      meta: {
        "revision": "Ember@2.8.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 50,
            "column": 0
          }
        },
        "moduleName": "coretheloothound/templates/raid/index.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "class", "raid-wrapper");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("section");
        dom.setAttribute(el2, "class", "info");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("p");
        var el4 = dom.createElement("i");
        dom.setAttribute(el4, "class", "fa fa-calendar fa-fw");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode(" ");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode(" ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("small");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("p");
        var el4 = dom.createElement("i");
        dom.setAttribute(el4, "class", "fa fa-users fa-fw");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode(" ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("a");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("section");
        dom.setAttribute(el2, "class", "signups");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3, "class", "wrapper");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4, "class", "signup-wrapper waiting-list");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("h3");
        var el6 = dom.createElement("i");
        dom.setAttribute(el6, "class", "fa fa-clock-o fa-fw");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode(" ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("small");
        var el7 = dom.createTextNode("Waiting List");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element7 = dom.childAt(fragment, [0]);
        var element8 = dom.childAt(element7, [1]);
        var element9 = dom.childAt(element8, [1]);
        var element10 = dom.childAt(element8, [3, 2]);
        var element11 = dom.childAt(element7, [3, 1]);
        var morphs = new Array(9);
        morphs[0] = dom.createMorphAt(element9, 2, 2);
        morphs[1] = dom.createMorphAt(dom.childAt(element9, [4]), 0, 0);
        morphs[2] = dom.createAttrMorph(element10, 'href');
        morphs[3] = dom.createMorphAt(element10, 0, 0);
        morphs[4] = dom.createMorphAt(element8, 5, 5);
        morphs[5] = dom.createMorphAt(element8, 7, 7);
        morphs[6] = dom.createMorphAt(element8, 9, 9);
        morphs[7] = dom.createMorphAt(dom.childAt(element11, [1]), 3, 3);
        morphs[8] = dom.createMorphAt(element11, 3, 3);
        return morphs;
      },
      statements: [["content", "model.dateCalendar", ["loc", [null, [3, 44], [3, 66]]], 0, 0, 0, 0], ["content", "model.dateAgo", ["loc", [null, [3, 74], [3, 91]]], 0, 0, 0, 0], ["attribute", "href", ["concat", [["get", "model.guild.url", ["loc", [null, [4, 52], [4, 67]]], 0, 0, 0, 0]], 0, 0, 0, 0, 0], 0, 0, 0, 0], ["content", "model.guild.name", ["loc", [null, [4, 71], [4, 91]]], 0, 0, 0, 0], ["block", "if", [["get", "model.admin", ["loc", [null, [5, 10], [5, 21]]], 0, 0, 0, 0]], [], 0, 1, ["loc", [null, [5, 4], [24, 11]]]], ["block", "if", [["get", "model.note", ["loc", [null, [25, 10], [25, 20]]], 0, 0, 0, 0]], [], 2, null, ["loc", [null, [25, 4], [25, 90]]]], ["inline", "character-select", [], ["characters", ["subexpr", "@mut", [["get", "characters", ["loc", [null, [26, 34], [26, 44]]], 0, 0, 0, 0]], [], [], 0, 0], "action", "signup"], ["loc", [null, [26, 4], [26, 62]]], 0, 0], ["block", "each", [["get", "model.waitingListByAccount", ["loc", [null, [32, 16], [32, 42]]], 0, 0, 0, 0]], [], 3, null, ["loc", [null, [32, 8], [37, 17]]]], ["block", "each", [["get", "seatedByRole", ["loc", [null, [39, 14], [39, 26]]], 0, 0, 0, 0]], [], 4, null, ["loc", [null, [39, 6], [46, 15]]]]],
      locals: [],
      templates: [child0, child1, child2, child3, child4]
    };
  })());
});
define("coretheloothound/templates/raids", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "revision": "Ember@2.8.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 5,
            "column": 0
          }
        },
        "moduleName": "coretheloothound/templates/raids.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "class", "raids");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("h2");
        var el3 = dom.createTextNode("Raids");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(dom.childAt(fragment, [0]), 3, 3);
        return morphs;
      },
      statements: [["content", "liquid-outlet", ["loc", [null, [3, 2], [3, 19]]], 0, 0, 0, 0]],
      locals: [],
      templates: []
    };
  })());
});
define("coretheloothound/templates/raids/index", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      return {
        meta: {
          "revision": "Ember@2.8.1",
          "loc": {
            "source": null,
            "start": {
              "line": 1,
              "column": 0
            },
            "end": {
              "line": 1,
              "column": 83
            }
          },
          "moduleName": "coretheloothound/templates/raids/index.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createElement("i");
          dom.setAttribute(el1, "class", "fa fa-plus");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode(" New Raid");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() {
          return [];
        },
        statements: [],
        locals: [],
        templates: []
      };
    })();
    var child1 = (function () {
      return {
        meta: {
          "revision": "Ember@2.8.1",
          "loc": {
            "source": null,
            "start": {
              "line": 14,
              "column": 4
            },
            "end": {
              "line": 16,
              "column": 4
            }
          },
          "moduleName": "coretheloothound/templates/raids/index.hbs"
        },
        isEmpty: false,
        arity: 1,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("      ");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
          return morphs;
        },
        statements: [["inline", "raid-row", [], ["raid", ["subexpr", "@mut", [["get", "raid", ["loc", [null, [15, 22], [15, 26]]], 0, 0, 0, 0]], [], [], 0, 0], "account", ["subexpr", "@mut", [["get", "currentAccount", ["loc", [null, [15, 35], [15, 49]]], 0, 0, 0, 0]], [], [], 0, 0]], ["loc", [null, [15, 6], [15, 51]]], 0, 0]],
        locals: ["raid"],
        templates: []
      };
    })();
    return {
      meta: {
        "revision": "Ember@2.8.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 19,
            "column": 0
          }
        },
        "moduleName": "coretheloothound/templates/raids/index.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("table");
        dom.setAttribute(el1, "class", "table");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("thead");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("tr");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("th");
        var el5 = dom.createTextNode("Guild");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("th");
        var el5 = dom.createTextNode("Title");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("th");
        var el5 = dom.createTextNode("Date");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("th");
        var el5 = dom.createTextNode("You");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("th");
        var el5 = dom.createTextNode("Signups");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("tbody");
        var el3 = dom.createTextNode("\n");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(2);
        morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
        morphs[1] = dom.createMorphAt(dom.childAt(fragment, [2, 3]), 1, 1);
        dom.insertBoundary(fragment, 0);
        return morphs;
      },
      statements: [["block", "link-to", ["raids.new"], ["class", "btn btn-primary"], 0, null, ["loc", [null, [1, 0], [1, 95]]]], ["block", "each", [["get", "sortedRaids", ["loc", [null, [14, 12], [14, 23]]], 0, 0, 0, 0]], [], 1, null, ["loc", [null, [14, 4], [16, 13]]]]],
      locals: [],
      templates: [child0, child1]
    };
  })());
});
define("coretheloothound/templates/raids/new", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "revision": "Ember@2.8.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 35,
            "column": 0
          }
        },
        "moduleName": "coretheloothound/templates/raids/new.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("form");
        dom.setAttribute(el1, "class", "form");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2, "class", "form-group");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("label");
        dom.setAttribute(el3, "for", "raid-name");
        var el4 = dom.createTextNode("Name");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3, "class", "row");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4, "class", "col-md-6");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2, "class", "form-group");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("label");
        dom.setAttribute(el3, "for", "raid-name");
        var el4 = dom.createTextNode("Guild");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3, "class", "row");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4, "class", "col-md-6");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2, "class", "form-group");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3, "class", "row");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4, "class", "col-md-6");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5, "class", "checkbox");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("label");
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createComment("");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode(" Hidden\n          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2, "class", "form-group");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("label");
        dom.setAttribute(el3, "for", "raid-name");
        var el4 = dom.createTextNode("Date");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("button");
        dom.setAttribute(el2, "class", "btn btn-primary");
        var el3 = dom.createTextNode("Create");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element0 = dom.childAt(fragment, [0]);
        var element1 = dom.childAt(element0, [9]);
        var morphs = new Array(5);
        morphs[0] = dom.createMorphAt(dom.childAt(element0, [1, 3, 1]), 1, 1);
        morphs[1] = dom.createMorphAt(dom.childAt(element0, [3, 3, 1]), 1, 1);
        morphs[2] = dom.createMorphAt(dom.childAt(element0, [5, 1, 1, 1, 1]), 1, 1);
        morphs[3] = dom.createMorphAt(dom.childAt(element0, [7]), 3, 3);
        morphs[4] = dom.createElementMorph(element1);
        return morphs;
      },
      statements: [["inline", "input", [], ["type", "text", "id", "raid-name", "value", ["subexpr", "@mut", [["get", "name", ["loc", [null, [6, 49], [6, 53]]], 0, 0, 0, 0]], [], [], 0, 0], "class", "form-control", "placeholder", "Name"], ["loc", [null, [6, 8], [6, 95]]], 0, 0], ["inline", "guild-select", [], ["account", ["subexpr", "@mut", [["get", "account", ["loc", [null, [14, 31], [14, 38]]], 0, 0, 0, 0]], [], [], 0, 0], "guilds", ["subexpr", "@mut", [["get", "guilds", ["loc", [null, [14, 46], [14, 52]]], 0, 0, 0, 0]], [], [], 0, 0]], ["loc", [null, [14, 8], [14, 54]]], 0, 0], ["inline", "input", [], ["type", "checkbox", "id", "raid-hidden", "checked", ["subexpr", "@mut", [["get", "hidden", ["loc", [null, [23, 61], [23, 67]]], 0, 0, 0, 0]], [], [], 0, 0], "class", "form-control"], ["loc", [null, [23, 12], [23, 90]]], 0, 0], ["inline", "date-time", [], ["date", ["subexpr", "@mut", [["get", "date", ["loc", [null, [31, 21], [31, 25]]], 0, 0, 0, 0]], [], [], 0, 0]], ["loc", [null, [31, 4], [31, 27]]], 0, 0], ["element", "action", ["create"], [], ["loc", [null, [33, 34], [33, 53]]], 0, 0]],
      locals: [],
      templates: []
    };
  })());
});
define('coretheloothound/transitions', ['exports'], function (exports) {
  exports['default'] = function () {
    this.transition(this.toRoute('index'), this.use('crossFade'), this.reverse('crossFade'));

    this.transition(this.fromRoute('raids', 'raid'), this.toRoute('account'), this.use('toDown'), this.reverse('toUp'));

    this.transition(this.fromRoute('raids'), this.toRoute('raid'), this.use('toLeft'), this.reverse('toRight'));

    this.transition(this.fromRoute('raid.index'), this.toRoute('raid.edit'), this.use('toLeft'), this.reverse('toRight'));
  };
});
define('coretheloothound/transitions/cross-fade', ['exports', 'liquid-fire/transitions/cross-fade'], function (exports, _liquidFireTransitionsCrossFade) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _liquidFireTransitionsCrossFade['default'];
    }
  });
});
define('coretheloothound/transitions/default', ['exports', 'liquid-fire/transitions/default'], function (exports, _liquidFireTransitionsDefault) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _liquidFireTransitionsDefault['default'];
    }
  });
});
define('coretheloothound/transitions/explode', ['exports', 'liquid-fire/transitions/explode'], function (exports, _liquidFireTransitionsExplode) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _liquidFireTransitionsExplode['default'];
    }
  });
});
define('coretheloothound/transitions/fade', ['exports', 'liquid-fire/transitions/fade'], function (exports, _liquidFireTransitionsFade) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _liquidFireTransitionsFade['default'];
    }
  });
});
define('coretheloothound/transitions/flex-grow', ['exports', 'liquid-fire/transitions/flex-grow'], function (exports, _liquidFireTransitionsFlexGrow) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _liquidFireTransitionsFlexGrow['default'];
    }
  });
});
define('coretheloothound/transitions/fly-to', ['exports', 'liquid-fire/transitions/fly-to'], function (exports, _liquidFireTransitionsFlyTo) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _liquidFireTransitionsFlyTo['default'];
    }
  });
});
define('coretheloothound/transitions/move-over', ['exports', 'liquid-fire/transitions/move-over'], function (exports, _liquidFireTransitionsMoveOver) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _liquidFireTransitionsMoveOver['default'];
    }
  });
});
define('coretheloothound/transitions/scale', ['exports', 'liquid-fire/transitions/scale'], function (exports, _liquidFireTransitionsScale) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _liquidFireTransitionsScale['default'];
    }
  });
});
define('coretheloothound/transitions/scroll-then', ['exports', 'liquid-fire/transitions/scroll-then'], function (exports, _liquidFireTransitionsScrollThen) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _liquidFireTransitionsScrollThen['default'];
    }
  });
});
define('coretheloothound/transitions/to-down', ['exports', 'liquid-fire/transitions/to-down'], function (exports, _liquidFireTransitionsToDown) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _liquidFireTransitionsToDown['default'];
    }
  });
});
define('coretheloothound/transitions/to-left', ['exports', 'liquid-fire/transitions/to-left'], function (exports, _liquidFireTransitionsToLeft) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _liquidFireTransitionsToLeft['default'];
    }
  });
});
define('coretheloothound/transitions/to-right', ['exports', 'liquid-fire/transitions/to-right'], function (exports, _liquidFireTransitionsToRight) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _liquidFireTransitionsToRight['default'];
    }
  });
});
define('coretheloothound/transitions/to-up', ['exports', 'liquid-fire/transitions/to-up'], function (exports, _liquidFireTransitionsToUp) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _liquidFireTransitionsToUp['default'];
    }
  });
});
define('coretheloothound/transitions/wait', ['exports', 'liquid-fire/transitions/wait'], function (exports, _liquidFireTransitionsWait) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _liquidFireTransitionsWait['default'];
    }
  });
});
/* jshint ignore:start */



/* jshint ignore:end */

/* jshint ignore:start */

define('coretheloothound/config/environment', ['ember'], function(Ember) {
  var prefix = 'coretheloothound';
/* jshint ignore:start */

try {
  var metaName = prefix + '/config/environment';
  var rawConfig = document.querySelector('meta[name="' + metaName + '"]').getAttribute('content');
  var config = JSON.parse(unescape(rawConfig));

  var exports = { 'default': config };

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

/* jshint ignore:end */

});

/* jshint ignore:end */

/* jshint ignore:start */

if (!runningTests) {
  require("coretheloothound/app")["default"].create({"name":"coretheloothound","version":"0.0.0+3a622c1c"});
}

/* jshint ignore:end */
//# sourceMappingURL=coretheloothound.map