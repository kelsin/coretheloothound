/* jshint ignore:start */

/* jshint ignore:end */

define('coretheloothound/adapters/application', ['exports', 'coretheloothound/config/environment', 'ember-data'], function (exports, ENV, DS) {

  'use strict';

  exports['default'] = DS['default'].ActiveModelAdapter.extend({
    host: ENV['default'].api,

    headers: (function () {
      return {
        Accept: "application/json+ember",
        Authorization: "apikey " + this.get("storage").getValue("apikey")
      };
    }).property().volatile()
  });

});
define('coretheloothound/app', ['exports', 'ember', 'ember/resolver', 'ember/load-initializers', 'coretheloothound/config/environment'], function (exports, Ember, Resolver, loadInitializers, config) {

  'use strict';

  Ember['default'].MODEL_FACTORY_INJECTIONS = false;

  var App = Ember['default'].Application.extend({
    modulePrefix: config['default'].modulePrefix,
    podModulePrefix: config['default'].podModulePrefix,
    Resolver: Resolver['default']
  });

  loadInitializers['default'](App, config['default'].modulePrefix);

  exports['default'] = App;

});
define('coretheloothound/components/character-select', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Component.extend({
    character: (function () {
      return this.get("characters").get("firstObject");
    }).property("characters.@each"),

    roleCheckboxes: Ember['default'].computed.map("character.roles", function (role) {
      return Ember['default'].ObjectProxy.create({
        content: role,
        checked: true
      });
    }),

    checkedRoles: Ember['default'].computed.filterBy("roleCheckboxes", "checked", true),

    roles: Ember['default'].computed.mapBy("checkedRoles", "content"),

    actions: {
      signup: function () {
        var role_ids = this.get("roles").mapBy("id");
        this.sendAction("action", this.get("character"), this.get("note"), role_ids);
        this.set("note", "");
      }
    }
  });

});
define('coretheloothound/components/date-time', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Component.extend({
    picktime: (function (key, value) {
      if (arguments.length > 1) {
        this.set("date", moment(this.get("pickdate") + " " + value, "D MMMM, YYYY h:mm A").toDate());
      }

      return moment(this.get("date")).format("h:mm A");
    }).property("date", "pickdate"),

    pickdate: (function (key, value) {
      if (arguments.length > 1) {
        this.set("date", moment(value + " " + this.get("picktime"), "D MMMM, YYYY h:mm A").toDate());
      }

      return moment(this.get("date")).format("D MMMM, YYYY");
    }).property("date", "picktime"),

    dateAgo: (function () {
      return moment(this.get("date")).fromNow();
    }).property("date"),

    calendarDate: (function () {
      return moment(this.get("date")).calendar();
    }).property("date"),

    didInsertElement: function () {
      Ember['default'].$(".datepicker").pickadate();
      Ember['default'].$(".timepicker").pickatime();
    }
  });

});
define('coretheloothound/components/donut-graph', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Component.extend({
    classNames: ["graph-container"],

    angle: (function () {
      return d3.scale.linear().domain([0, 1]).range([0, 2 * Math.PI]);
    }).property(),

    arc: function (inner, outer) {
      var angle = this.get("angle");
      return d3.svg.arc().innerRadius(inner).outerRadius(outer).startAngle(function (d) {
        return angle(d.from);
      }).endAngle(function (d) {
        return angle(d.to);
      });
    },

    arcInner: (function () {
      return this.arc(34, 56);
    }).property("angle"),

    arcOuter: (function () {
      return this.arc(30, 60);
    }).property("angle"),

    update: (function () {
      var svg = this.get("svg");
      var data = this.get("data");
      var arcOuter = this.get("arcOuter");
      var arcInner = this.get("arcInner");

      var dataOuter = svg.selectAll("path.outer").data(data, function (d) {
        return d.name;
      });
      dataOuter.enter().append("path").attr("class", function (d) {
        return "outer border-" + d.className;
      }).attr("transform", "translate(60,60)").append("title").text(function (d) {
        return d.name + ": " + d.number;
      });
      dataOuter.exit().remove();
      dataOuter.attr("d", arcOuter);

      var dataInner = svg.selectAll("path.inner").data(data, function (d) {
        return d.name;
      });
      dataInner.enter().append("path").attr("class", function (d) {
        return "inner " + d.className;
      }).attr("transform", "translate(60,60)").append("title").text(function (d) {
        return d.name + ": " + d.number;
      });
      dataInner.exit().remove();
      dataInner.attr("d", arcInner);
    }).observes("data.@each"),

    didInsertElement: function () {
      var element = d3.select("#" + this.get("elementId") + " .graph");

      var svg = element.append("svg").attr("height", "120").attr("width", "120");
      this.set("svg", svg);

      this.update();
    }
  });

});
define('coretheloothound/components/guild-select', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Component.extend({
    guilds: (function () {
      return (this.get("account.characters") || Ember['default'].A([])).mapBy("guild").compact().uniq().sortBy("name").toArray();
    }).property("account.characters.@each.guild")
  });

});
define('coretheloothound/components/lf-overlay', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Component.extend({
    tagName: "span",
    classNames: ["lf-overlay"],
    didInsertElement: function () {
      Ember['default'].$("body").addClass("lf-modal-open");
    },
    willDestroy: function () {
      Ember['default'].$("body").removeClass("lf-modal-open");
    },
    click: function () {
      this.sendAction("clickAway");
    }
  });

});
define('coretheloothound/components/liquid-bind-c', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Component.extend({
    tagName: ""
  });

});
define('coretheloothound/components/liquid-measured', ['exports', 'liquid-fire/mutation-observer', 'ember'], function (exports, MutationObserver, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Component.extend({

    didInsertElement: function () {
      var self = this;

      // This prevents margin collapse
      this.$().css({
        border: "1px solid transparent",
        margin: "-1px"
      });

      this.didMutate();

      this.observer = new MutationObserver['default'](function (mutations) {
        self.didMutate(mutations);
      });
      this.observer.observe(this.get("element"), {
        attributes: true,
        subtree: true,
        childList: true
      });
      this.$().bind("webkitTransitionEnd", function () {
        self.didMutate();
      });
      // Chrome Memory Leak: https://bugs.webkit.org/show_bug.cgi?id=93661
      window.addEventListener("unload", function () {
        self.willDestroyElement();
      });
    },

    willDestroyElement: function () {
      if (this.observer) {
        this.observer.disconnect();
      }
    },

    didMutate: function () {
      Ember['default'].run.next(this, function () {
        this._didMutate();
      });
    },

    _didMutate: function () {
      var elt = this.$();
      if (!elt || !elt[0]) {
        return;
      }

      // if jQuery sees a zero dimension, it will temporarily modify the
      // element's css to try to make its size measurable. But that's bad
      // for us here, because we'll get an infinite recursion of mutation
      // events. So we trap the zero case without hitting jQuery.

      if (elt[0].offsetWidth === 0) {
        this.set("width", 0);
      } else {
        this.set("width", elt.outerWidth());
      }
      if (elt[0].offsetHeight === 0) {
        this.set("height", 0);
      } else {
        this.set("height", elt.outerHeight());
      }
    }

  });

});
define('coretheloothound/components/liquid-modal', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Component.extend({
    classNames: ["liquid-modal"],
    currentContext: Ember['default'].computed.oneWay("owner.modalContexts.lastObject"),

    owner: null, // set by injection

    innerView: Ember['default'].computed("currentContext", function () {
      var self = this,
          current = this.get("currentContext"),
          name = current.get("name"),
          container = this.get("container"),
          component = container.lookup("component-lookup:main").lookupFactory(name);
      Ember['default'].assert("Tried to render a modal using component '" + name + "', but couldn't find it.", !!component);

      var args = Ember['default'].copy(current.get("params"));

      args.registerMyself = Ember['default'].on("init", function () {
        self.set("innerViewInstance", this);
      });

      // set source so we can bind other params to it
      args._source = Ember['default'].computed(function () {
        return current.get("source");
      });

      var otherParams = current.get("options.otherParams");
      var from, to;
      for (from in otherParams) {
        to = otherParams[from];
        args[to] = Ember['default'].computed.alias("_source." + from);
      }

      var actions = current.get("options.actions") || {};

      // Override sendAction in the modal component so we can intercept and
      // dynamically dispatch to the controller as expected
      args.sendAction = function (name) {
        var actionName = actions[name];
        if (!actionName) {
          this._super.apply(this, Array.prototype.slice.call(arguments));
          return;
        }

        var controller = current.get("source");
        var args = Array.prototype.slice.call(arguments, 1);
        args.unshift(actionName);
        controller.send.apply(controller, args);
      };

      return component.extend(args);
    }),

    actions: {
      outsideClick: function () {
        if (this.get("currentContext.options.dismissWithOutsideClick")) {
          this.send("dismiss");
        } else {
          proxyToInnerInstance(this, "outsideClick");
        }
      },
      escape: function () {
        if (this.get("currentContext.options.dismissWithEscape")) {
          this.send("dismiss");
        } else {
          proxyToInnerInstance(this, "escape");
        }
      },
      dismiss: function () {
        var source = this.get("currentContext.source"),
            proto = source.constructor.proto(),
            params = this.get("currentContext.options.withParams"),
            clearThem = {};

        for (var key in params) {
          clearThem[key] = proto[key];
        }
        source.setProperties(clearThem);
      }
    }
  });

  function proxyToInnerInstance(self, message) {
    var vi = self.get("innerViewInstance");
    if (vi) {
      vi.send(message);
    }
  }

});
define('coretheloothound/components/liquid-spacer', ['exports', 'ember', 'liquid-fire/promise'], function (exports, Ember, Promise) {

  'use strict';

  exports['default'] = Ember['default'].Component.extend({
    growDuration: 250,
    growPixelsPerSecond: 200,
    growEasing: "slide",
    enabled: true,

    didInsertElement: function () {
      var child = this.$("> div");
      this.$().css({
        overflow: "hidden",
        width: child.width(),
        height: child.height()
      });
    },

    sizeChange: Ember['default'].observer("width", "height", function () {
      var elt = this.$();
      if (!this.get("enabled")) {
        elt.width(this.get("width"));
        elt.height(this.get("height"));
        return Promise['default'].resolve();
      }
      return Promise['default'].all([this.adaptDimension(elt, "width"), this.adaptDimension(elt, "height")]);
    }),

    adaptDimension: function (elt, dimension) {
      var have = elt[dimension]();
      var want = this.get(dimension);
      var target = {};
      target[dimension] = want;

      return Ember['default'].$.Velocity(elt[0], target, {
        duration: this.durationFor(have, want),
        queue: false,
        easing: this.get("growEasing")
      });
    },

    durationFor: function (before, after) {
      return Math.min(this.get("growDuration"), 1000 * Math.abs(before - after) / this.get("growPixelsPerSecond"));
    } });

});
define('coretheloothound/components/lm-container', ['exports', 'ember', 'liquid-fire/tabbable'], function (exports, Ember) {

  'use strict';

  /*
     Parts of this file were adapted from ic-modal

     https://github.com/instructure/ic-modal
     Released under The MIT License (MIT)
     Copyright (c) 2014 Instructure, Inc.
  */

  var lastOpenedModal = null;
  Ember['default'].$(document).on("focusin", handleTabIntoBrowser);

  function handleTabIntoBrowser() {
    if (lastOpenedModal) {
      lastOpenedModal.focus();
    }
  }


  exports['default'] = Ember['default'].Component.extend({
    classNames: ["lm-container"],
    attributeBindings: ["tabindex"],
    tabindex: 0,

    keyUp: function (event) {
      // Escape key
      if (event.keyCode === 27) {
        this.sendAction();
      }
    },

    keyDown: function (event) {
      // Tab key
      if (event.keyCode === 9) {
        this.constrainTabNavigation(event);
      }
    },

    didInsertElement: function () {
      this.focus();
      lastOpenedModal = this;
    },

    willDestroy: function () {
      lastOpenedModal = null;
    },

    focus: function () {
      if (this.get("element").contains(document.activeElement)) {
        // just let it be if we already contain the activeElement
        return;
      }
      var target = this.$("[autofocus]");
      if (!target.length) {
        target = this.$(":tabbable");
      }

      if (!target.length) {
        target = this.$();
      }

      target[0].focus();
    },

    constrainTabNavigation: function (event) {
      var tabbable = this.$(":tabbable");
      var finalTabbable = tabbable[event.shiftKey ? "first" : "last"]()[0];
      var leavingFinalTabbable = finalTabbable === document.activeElement ||
      // handle immediate shift+tab after opening with mouse
      this.get("element") === document.activeElement;
      if (!leavingFinalTabbable) {
        return;
      }
      event.preventDefault();
      tabbable[event.shiftKey ? "last" : "first"]()[0].focus();
    }
  });

});
define('coretheloothound/components/raid-group', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Component.extend({
    classNames: ["draggableDropzone", "group"],
    classNameBindings: ["dragClass"],
    dragClass: "",

    dragStart: function (event) {
      alert("Dragging started");
      event.preventDefault();
      this.set("dragClass", "dragging");
    },

    dragOver: function (event) {
      alert("Dragging Over");
      event.preventDefault();
      this.set("dragClass", "");
    }
  });

});
define('coretheloothound/components/raid-permission', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Component.extend({
    label: (function () {
      var type = this.get("permission.type");
      switch (type) {
        case "Guild":
        case "Character":
          return this.get("permission.name");
        default:
          return this.get("permission.args");
      }
    }).property("permission.type", "permission.args"),

    ownAccount: (function () {
      return this.get("permission.key") === "Account|" + this.get("account.battletag");
    }).property("permission.key", "account.battletag"),

    actions: {
      deletePermission: function () {
        this.sendAction("deletePermission", this.get("permission"));
      }
    }
  });

});
define('coretheloothound/components/raid-permissions', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Component.extend({
    adminPermissions: Ember['default'].computed.filterBy("raid.permissions", "level", "admin"),
    memberPermissions: Ember['default'].computed.filterBy("raid.permissions", "level", "member"),

    actions: {
      newAdminPermission: function () {
        this.sendAction("newPermission", "admin", "Account|" + this.get("adminAccount"));
      },

      newMemberAccountPermission: function () {
        this.sendAction("newPermission", "member", "Account|" + this.get("memberAccount"));
      },

      newMemberCharacterPermission: function () {
        this.sendAction("newPermission", "member", "Character|" + this.get("characterName") + ":" + this.get("characterRealm"));
      },

      newMemberGuildPermission: function () {
        this.sendAction("newPermission", "member", "Guild|" + this.get("guildName") + ":" + this.get("guildRealm"));
      },

      deletePermission: function (permission) {
        this.sendAction("deletePermission", permission);
      }
    }
  });

});
define('coretheloothound/components/raid-signup', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Component.extend({
    classNames: "signup",

    rolesSorting: ["slug:desc"],
    sortedRoles: Ember['default'].computed.sort("signup.roles", "rolesSorting"),

    attributeBindings: ["draggable:draggable", "note:title"],
    draggable: true,

    note: (function () {
      return this.get("signup.note");
    }).property("signup.note"),

    classes: (function () {
      var classes = "class class-" + this.get("signup.character.class_id");
      if (this.get("preferred")) {
        classes += " preferred";
      }
      return classes;
    }).property("signup.character.class_id"),

    iconClasses: (function () {
      return "role " + this.get("signup.role.slug");
    }).property("signup.role.slug"),

    mine: (function () {
      return this.get("currentAccount.id") === this.get("signup.character.account.id");
    }).property("currentAccount.id", "signup.character.account.id"),

    actions: {
      unsignup: function () {
        this.sendAction("unsignup", this.get("signup.content"));
      },
      seat: function (role) {
        this.sendAction("seat", this.get("signup.content"), role);
      },
      unseat: function () {
        this.sendAction("unseat", this.get("signup.content"));
      }
    }
  });

});
define('coretheloothound/controllers/account', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Controller.extend({
    needs: ["application"],
    account: Ember['default'].computed.alias("controllers.application.account")
  });

});
define('coretheloothound/controllers/application', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Controller.extend({
    loggedIn: (function () {
      return !!this.get("account");
    }).property("account")
  });

});
define('coretheloothound/controllers/auth', ['exports', 'coretheloothound/config/environment', 'ember'], function (exports, ENV, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Controller.extend({
    needs: ["application"],

    apikey: Ember['default'].computed.alias("controllers.application.apikey"),
    account: Ember['default'].computed.alias("controllers.application.account"),
    loggedIn: Ember['default'].computed.alias("controllers.application.loggedIn"),

    actions: {
      logout: function () {
        var _this = this;

        Ember['default'].$.ajax({
          type: "GET",
          url: ENV['default'].api + "/logout",
          headers: {
            Authorization: "apikey " + _this.get("apikey")
          },
          success: function () {
            _this.get("storage").removeValue("apikey");
            _this.set("apikey", undefined);
            _this.set("account", undefined);
            _this.transitionToRoute("index");
          }
        });
      }
    }
  });

});
define('coretheloothound/controllers/character', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].ObjectController.extend({
    dashedName: (function () {
      return this.get("name").dasherize();
    }).property("name"),

    dashedRealm: (function () {
      return this.get("realm").dasherize();
    }).property("realm"),

    className: (function () {
      switch (this.get("class_id")) {
        case 1:
          return "Warrior";
        case 2:
          return "Paladin";
        case 3:
          return "Hunter";
        case 4:
          return "Rogue";
        case 5:
          return "Priest";
        case 6:
          return "Death Knight";
        case 7:
          return "Shaman";
        case 8:
          return "Mage";
        case 9:
          return "Warlock";
        case 10:
          return "Monk";
        case 11:
          return "Druid";
        case 12:
          return "Demon Hunter";
      }
    }).property("class_id"),

    label: (function () {
      return this.get("level") + ": " + this.get("name") + " - " + this.get("className") + " - " + this.get("realm");
    }).property("name", "realm"),

    canHeal: (function () {
      return [2, 5, 7, 10, 11].contains(this.get("class_id"));
    }).property("class_id"),

    canTank: (function () {
      return [1, 2, 6, 10, 11].contains(this.get("class_id"));
    }).property("class_id"),

    armoryUrl: (function () {
      return "http://us.battle.net/wow/character/" + this.get("dashedRealm") + "/" + this.get("dashedName") + "/simple";
    }).property("dashedName", "dashedRealm"),

    robotUrl: (function () {
      return "http://www.askmrrobot.com/wow/player/us/" + this.get("dashedRealm") + "/" + this.get("dashedName");
    }).property("dashedName", "dashedRealm"),

    wowheadUrl: (function () {
      return "http://www.wowhead.com/list/us-" + this.get("dashedRealm") + "-" + this.get("dashedName");
    }).property("dashedName", "dashedRealm")
  });

});
define('coretheloothound/controllers/characters/index', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Controller.extend({
    realm: "All",
    onlyMax: true,

    updateRealm: (function () {
      var realm = this.get("realm");

      if (realm) {
        window.localStorage.setItem("coretheloothound_realm", realm);
      }
    }).observes("realm"),

    realms: (function () {
      this.set("realm", window.localStorage.getItem("coretheloothound_realm") || "All");

      return ["All"].concat(_.uniq(this.get("model").mapBy("realm")).sort());
    }).property("model.@each.realm"),

    sortProperties: ["level:desc", "name"],
    sorted: Ember['default'].computed.sort("model", "sortProperties"),

    filtered: (function () {
      var realm = this.get("realm");
      var onlyMax = this.get("onlyMax");

      return this.get("sorted").filter(function (character) {
        if (onlyMax && character.get("level") < 100) {
          return false;
        }

        if (!realm || realm === "All") {
          return true;
        } else {
          return realm === character.get("realm");
        }
      });
    }).property("sorted", "onlyMax", "realm")
  });

});
define('coretheloothound/controllers/raid', ['exports', 'ember', 'coretheloothound/controllers/character'], function (exports, Ember, CharacterController) {

  'use strict';

  exports['default'] = Ember['default'].ObjectController.extend({
    needs: ["application", "raids/index"],
    currentAccount: Ember['default'].computed.alias("controllers.application.account"),
    roles: Ember['default'].computed.alias("controllers.raids/index.roles"),

    rolesSorting: ["slug:desc"],
    sortedRoles: Ember['default'].computed.sort("roles", "rolesSorting"),

    seatedByRole: (function () {
      var _this = this;

      return this.get("sortedRoles").map(function (role) {
        return Ember['default'].Object.create({
          role: role,
          signups: _this.get("seated").filterBy("role.id", role.get("id"))
        });
      });
    }).property("sortedRoles.@each.id", "seated.@each.role"),

    currentAccountSeated: (function () {
      var accountId = this.get("currentAccount.id").toString();
      return this.get("seated").findBy("character.account.id", accountId);
    }).property("seated.@each.character", "currentAccount.id"),

    currentAccountSignedUp: (function () {
      var accountId = this.get("currentAccount.id").toString();
      return this.get("signups").filterBy("character.account.id", accountId);
    }).property("signups.@each.character", "currentAccount.id"),

    characters: (function () {
      var ids = this.get("signedUpCharacterIds");
      return this.get("currentAccount.characters").filter(function (character) {
        return !ids.contains(character.get("id"));
      }).map(function (character) {
        return CharacterController['default'].create({
          model: character
        });
      }).sort(function (a, b) {
        var diff = b.get("level") - a.get("level");
        if (diff) {
          return diff;
        } else {
          return a.get("name").localeCompare(b.get("name"));
        }
      });
    }).property("currentAccount.characters", "signedUpCharacterIds")
  });

});
define('coretheloothound/controllers/raid/index', ['exports', 'ember', 'coretheloothound/controllers/character'], function (exports, Ember, CharacterController) {

  'use strict';

  exports['default'] = Ember['default'].ObjectController.extend({
    needs: ["application", "raids/index"],
    currentAccount: Ember['default'].computed.alias("controllers.application.account"),
    roles: Ember['default'].computed.alias("controllers.raids/index.roles"),

    rolesSorting: ["slug:desc"],
    sortedRoles: Ember['default'].computed.sort("roles", "rolesSorting"),

    seatedByRole: (function () {
      var _this = this;

      return this.get("sortedRoles").map(function (role) {
        return Ember['default'].Object.create({
          role: role,
          signups: _this.get("seated").filterBy("role.id", role.get("id"))
        });
      });
    }).property("sortedRoles.@each.id", "seated.@each.role"),

    currentAccountSeated: (function () {
      var accountId = this.get("currentAccount.id").toString();
      return this.get("seated").findBy("character.account.id", accountId);
    }).property("seated.@each.character", "currentAccount.id"),

    currentAccountSignedUp: (function () {
      var accountId = this.get("currentAccount.id").toString();
      return this.get("signups").filterBy("character.account.id", accountId);
    }).property("signups.@each.character", "currentAccount.id"),

    characters: (function () {
      var ids = this.get("signedUpCharacterIds");
      return this.get("currentAccount.characters").filter(function (character) {
        return !ids.contains(character.get("id"));
      }).map(function (character) {
        return CharacterController['default'].create({
          model: character
        });
      }).sort(function (a, b) {
        var diff = b.get("level") - a.get("level");
        if (diff) {
          return diff;
        } else {
          return a.get("name").localeCompare(b.get("name"));
        }
      });
    }).property("currentAccount.characters", "signedUpCharacterIds")
  });

});
define('coretheloothound/controllers/raids/index', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].ArrayController.extend({
    sortProperties: ["date", "name"],
    itemController: "raid"
  });

});
define('coretheloothound/controllers/raids/new', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].ObjectController.extend({
    needs: ["application"],
    account: Ember['default'].computed.alias("controllers.application.account"),

    init: function () {
      this._super();
      this.set("name", "");
      this.set("date", moment().endOf("isoWeek").hour(19).minute(0).second(0).add(2, "days").toDate());
      this.set("hidden", true);
    },

    actions: {
      create: function () {
        var _this = this;

        var raid = this.store.createRecord("raid", {
          name: this.get("name"),
          guild: this.get("guild"),
          date: this.get("date"),
          hidden: this.get("hidden")
        });

        raid.save().then(function (raid) {
          _this.init();
          _this.transitionToRoute("raid", raid);
        });
      }
    }
  });

});
define('coretheloothound/controllers/role', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].ObjectController.extend({
    number: (function () {
      var id = this.get("id");
      return this.get("parentController.seated").filter(function (signup) {
        return signup.get("role.id") === id;
      }).get("length");
    }).property("parentController.seated.@each.role"),

    statClasses: (function () {
      return "stat " + this.get("iconClasses");
    }).property("iconClasses"),

    iconClasses: (function () {
      return "role " + this.get("slug");
    }).property("slug")
  });

});
define('coretheloothound/controllers/signup', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].ObjectController.extend({
    // This signup can be seated if they are currently in the waiting list
    canBeSeated: (function () {
      var waitingList = this.get("parentController.waitingList");
      return waitingList.map(function (signup) {
        return signup.get("id");
      }).contains(this.get("id"));
    }).property("parentController.waitingList.@each")
  });

});
define('coretheloothound/helpers/character-class', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports.characterClass = characterClass;

  function characterClass(class_id) {
    var classes = {
      1: "Warrior",
      2: "Paladin",
      3: "Hunter",
      4: "Rogue",
      5: "Priest",
      6: "Death Knight",
      7: "Shaman",
      8: "Mage",
      9: "Warlock",
      10: "Monk",
      11: "Druid",
      12: "Demon Hunter"
    };

    return new Ember['default'].Handlebars.SafeString("<span class=\"class-" + class_id + "\">" + classes[class_id] + "</span>");
  }exports['default'] = Ember['default'].Handlebars.makeBoundHelper(characterClass);

});
define('coretheloothound/helpers/character-faction', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

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
        return "Alliance";
      case 2:
      case 5:
      case 6:
      case 8:
      case 9:
      case 10:
      case 26:
        return "Horde";
      case 24:
        return "Neutral";
      default:
        return "Neutral";
    }
  }exports['default'] = Ember['default'].Handlebars.makeBoundHelper(characterFaction);

});
define('coretheloothound/helpers/character-race', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports.characterRace = characterRace;

  function characterRace(race_id) {
    var faction = function (race_id) {
      switch (race_id) {
        case 1:
        case 3:
        case 4:
        case 7:
        case 11:
        case 22:
        case 25:
          return "alliance";
        case 2:
        case 5:
        case 6:
        case 8:
        case 9:
        case 10:
        case 26:
          return "horde";
        case 24:
          return "neutral";
        default:
          return "neutral";
      }
    };

    var races = {
      1: "Human",
      2: "Orc",
      3: "Dwarf",
      4: "Night Elf",
      5: "Undead",
      6: "Tauren",
      7: "Gnome",
      8: "Troll",
      9: "Goblin",
      10: "Blood Elf",
      11: "Draenei",
      22: "Worgen",
      24: "Pandaren",
      25: "Pandaren",
      26: "Pandaren"
    };

    return new Ember['default'].Handlebars.SafeString("<span class=\"" + faction(race_id) + "\">" + races[race_id] + "</span>");
  }exports['default'] = Ember['default'].Handlebars.makeBoundHelper(characterRace);

});
define('coretheloothound/helpers/liquid-bind', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  /* liquid-bind is really just liquid-with with a pre-provided block
     that just says {{this}} */
  function liquidBindHelperFunc() {
    var options = arguments[arguments.length - 1];
    var container = options.data.view.container;
    var componentLookup = container.lookup("component-lookup:main");
    var cls = componentLookup.lookupFactory("liquid-bind-c");
    options.hash.value = arguments[0];
    options.hashTypes.value = options.types[0];

    if (options.hash["class"]) {
      options.hash.innerClass = options.hash["class"];
      delete options.hash["class"];
      options.hashTypes.innerClass = options.hashTypes["class"];
      delete options.hashTypes["class"];
    }
    Ember['default'].Handlebars.helpers.view.call(this, cls, options);
  }

  function htmlbarsLiquidBindHelper(params, hash, options, env) {
    var componentLookup = this.container.lookup("component-lookup:main");
    var cls = componentLookup.lookupFactory("liquid-bind-c");
    hash.value = params[0];
    if (hash["class"]) {
      hash.innerClass = hash["class"];
      delete hash["class"];
    }
    env.helpers.view.helperFunction.call(this, [cls], hash, options, env);
  }

  var liquidBindHelper;

  if (Ember['default'].HTMLBars) {
    liquidBindHelper = {
      isHTMLBars: true,
      helperFunction: htmlbarsLiquidBindHelper
    };
  } else {
    liquidBindHelper = liquidBindHelperFunc;
  }

  exports['default'] = liquidBindHelper;

});
define('coretheloothound/helpers/liquid-if', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports.factory = factory;

  var isHTMLBars = !!Ember['default'].HTMLBars;function factory(invert) {
    function helperFunc() {
      var property, hash, options, env, container;

      if (isHTMLBars) {
        property = arguments[0][0];
        hash = arguments[1];
        options = arguments[2];
        env = arguments[3];
        container = this.container;
      } else {
        property = arguments[0];
        options = arguments[1];
        hash = options.hash;
        container = options.data.view.container;
      }
      var View = container.lookupFactory("view:liquid-if");

      var templates = [options.fn || options.template, options.inverse];
      if (invert) {
        templates.reverse();
      }
      delete options.fn;
      delete options.template;
      delete options.inverse;

      if (hash.containerless) {
        View = View.extend(Ember['default']._Metamorph);
      }

      hash.templates = templates;

      if (isHTMLBars) {
        hash.showFirst = property;
        env.helpers.view.helperFunction.call(this, [View], hash, options, env);
      } else {
        hash.showFirstBinding = property;
        return Ember['default'].Handlebars.helpers.view.call(this, View, options);
      }
    }

    if (Ember['default'].HTMLBars) {
      return {
        isHTMLBars: true,
        helperFunction: helperFunc,
        preprocessArguments: function () {}
      };
    } else {
      return helperFunc;
    }
  }exports['default'] = factory(false);

});
define('coretheloothound/helpers/liquid-measure', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = function () {
    Ember['default'].assert("liquid-measure is deprecated, see CHANGELOG.md", false);
  };

});
define('coretheloothound/helpers/liquid-outlet', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  var isHTMLBars = !!Ember['default'].HTMLBars;

  function liquidOutletHelperFunc(property, options) {
    var property, options, container, hash, env;

    if (isHTMLBars) {
      property = arguments[0][0]; // params[0]
      hash = arguments[1];
      options = arguments[2];
      env = arguments[3];
      container = this.container;

      if (!property) {
        property = "main";
        options.paramTypes = ["string"];
      }
    } else {
      property = arguments[0];

      if (property && property.data && property.data.isRenderData) {
        options = property;
        property = "main";
        options.types = ["STRING"];
      }

      container = options.data.view.container;
      hash = options.hash;
    }

    var View = container.lookupFactory("view:liquid-outlet");
    if (hash.containerless) {
      View = View.extend(Ember['default']._Metamorph);
    }
    hash.viewClass = View;

    if (isHTMLBars) {
      env.helpers.outlet.helperFunction.call(this, [property], hash, options, env);
    } else {
      return Ember['default'].Handlebars.helpers.outlet.call(this, property, options);
    }
  }

  var liquidOutletHelper = liquidOutletHelperFunc;
  if (Ember['default'].HTMLBars) {
    liquidOutletHelper = {
      isHTMLBars: true,
      helperFunction: liquidOutletHelperFunc,
      preprocessArguments: function () {}
    };
  }

  exports['default'] = liquidOutletHelper;

});
define('coretheloothound/helpers/liquid-unless', ['exports', 'coretheloothound/helpers/liquid-if'], function (exports, liquid_if) {

	'use strict';

	exports['default'] = liquid_if.factory(true);

});
define('coretheloothound/helpers/liquid-with', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  var isHTMLBars = !!Ember['default'].HTMLBars;

  function liquidWithHelperFunc() {
    var params, context, options, container, innerOptions, data, hash, env;

    var innerOptions = {
      hashTypes: {}
    };

    var innerHash = {};

    if (isHTMLBars) {
      params = arguments[0];
      hash = arguments[1];
      options = arguments[2];
      env = arguments[3];
      context = params[0];
      container = this.container;
      data = arguments[3].data;
      innerOptions.morph = options.morph;

      if (params.length === 3) {
        hash.keywordName = params[2]._label;
        params = [context];
      }
      innerHash.boundContext = context;
    } else {
      params = Array.prototype.slice.apply(arguments, [0, -1]);
      context = arguments[0];
      options = arguments[arguments.length - 1];
      data = options.data;
      hash = options.hash;
      container = data.view.container;
      innerOptions.data = data;
      innerOptions.hash = innerHash;
      innerHash.boundContextBinding = context;
    }

    var View = container.lookupFactory("view:liquid-with");

    View = View.extend({
      originalArgs: params,
      originalHash: hash,
      originalHashTypes: options.hashTypes,
      innerTemplate: options.fn || options.template
    });

    var containerless = isHTMLBars && hash.containerless && (!hash.containerless.isStream || hash.containerless.value()) || !isHTMLBars && (options.hashTypes.containerless === "BOOLEAN" && hash.containerless || options.hashTypes.containerless === "ID" && this.containerless);

    if (containerless) {
      View = View.extend(Ember['default']._Metamorph);
    }


    ["class", "classNames", "classNameBindings", "use", "id", "growDuration", "growPixelsPerSecond", "growEasing", "enableGrowth", "containerless"].forEach(function (field) {
      if (hash.hasOwnProperty(field)) {
        innerHash[field] = hash[field];
        innerOptions.hashTypes[field] = options.hashTypes ? options.hashTypes[field] : undefined;
      }
    });

    if (isHTMLBars) {
      env.helpers.view.helperFunction.call(this, [View], innerHash, innerOptions, env);
    } else {
      if (containerless) {
        delete innerOptions.hash["class"];
        delete innerOptions.hash.classNames;
        delete innerOptions.hash.classNameBindings;
      }
      return Ember['default'].Handlebars.helpers.view.call(this, View, innerOptions);
    }
  }

  var liquidWithHelper = liquidWithHelperFunc;
  if (isHTMLBars) {
    liquidWithHelper = {
      isHTMLBars: true,
      helperFunction: liquidWithHelperFunc,
      preprocessArguments: function () {}
    };
  }

  exports['default'] = liquidWithHelper;

});
define('coretheloothound/helpers/with-apply', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  var isHTMLBars = !!Ember['default'].HTMLBars;

  // This helper is internal to liquid-with.
  function withApplyHelperFunc() {
    var hash, options, env, view;

    if (isHTMLBars) {
      hash = arguments[1];
      options = arguments[2];
      env = arguments[3];
      view = this;
    } else {
      options = arguments[0];
      hash = options.hash;
      view = options.data.view;
    }

    var parent = view.get("liquidWithParent");
    var withArgs = parent.get("originalArgs").slice();

    withArgs[0] = "lwith-view.boundContext";
    options = Ember['default'].copy(options);

    // This works to inject our keyword in Ember >= 1.9
    if (!view._keywords) {
      view._keywords = {};
    }
    view._keywords["lwith-view"] = view;

    // This works to inject our keyword in Ember < 1.9
    if (!isHTMLBars) {
      if (!options.data.keywords) {
        options.data.keywords = {};
      }
      options.data.keywords["lwith-view"] = view;
    }

    if (isHTMLBars) {
      options.template = parent.get("innerTemplate");
    } else {
      options.fn = parent.get("innerTemplate");
    }

    hash = parent.get("originalHash");
    options.hashTypes = parent.get("originalHashTypes");

    if (isHTMLBars) {
      env.helpers["with"].helperFunction.call(this, [view.getStream(withArgs[0])], hash, options, env);
    } else {
      options.hash = hash;
      withArgs.push(options);
      return Ember['default'].Handlebars.helpers["with"].apply(this, withArgs);
    }
  }

  var withApplyHelper = withApplyHelperFunc;
  if (Ember['default'].HTMLBars) {
    withApplyHelper = {
      isHTMLBars: true,
      helperFunction: withApplyHelperFunc,
      preprocessArguments: function () {}
    };
  }

  exports['default'] = withApplyHelper;

});
define('coretheloothound/initializers/app-version', ['exports', 'coretheloothound/config/environment', 'ember'], function (exports, config, Ember) {

  'use strict';

  var classify = Ember['default'].String.classify;

  exports['default'] = {
    name: "App Version",
    initialize: function (container, application) {
      var appName = classify(application.toString());
      Ember['default'].libraries.register(appName, config['default'].APP.version);
    }
  };

});
define('coretheloothound/initializers/export-application-global', ['exports', 'ember', 'coretheloothound/config/environment'], function (exports, Ember, config) {

  'use strict';

  exports.initialize = initialize;

  function initialize() {
    var application = arguments[1] || arguments[0];
    if (config['default'].exportApplicationGlobal !== false) {
      var value = config['default'].exportApplicationGlobal;
      var globalName;

      if (typeof value === "string") {
        globalName = value;
      } else {
        globalName = Ember['default'].String.classify(config['default'].modulePrefix);
      }

      if (!window[globalName]) {
        window[globalName] = application;

        application.reopen({
          willDestroy: function () {
            this._super.apply(this, arguments);
            delete window[globalName];
          }
        });
      }
    }
  }exports['default'] = {
    name: "export-application-global",

    initialize: initialize
  };

});
define('coretheloothound/initializers/link-view', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports.initialize = initialize;

  function initialize() {
    Ember['default'].LinkView.reopen({
      attributeBindings: ["data-content", "data-toggle"]
    });
  }exports['default'] = {
    name: "link-view",
    initialize: initialize
  };

});
define('coretheloothound/initializers/liquid-fire', ['exports', 'liquid-fire', 'ember'], function (exports, liquid_fire, Ember) {

  'use strict';

  exports['default'] = {
    name: "liquid-fire",

    initialize: function (container) {
      if (!Ember['default'].$.Velocity) {
        Ember['default'].warn("Velocity.js is missing");
      } else {
        var version = Ember['default'].$.Velocity.version;
        var recommended = [0, 11, 8];
        if (Ember['default'].compare(recommended, [version.major, version.minor, version.patch]) === 1) {
          Ember['default'].warn("You should probably upgrade Velocity.js, recommended minimum is " + recommended.join("."));
        }
      }

      liquid_fire.initialize(container);
    }
  };

});
define('coretheloothound/initializers/storage', ['exports'], function (exports) {

  'use strict';

  exports.initialize = initialize;

  function initialize(container, application) {
    //application.register('service:storage', 'model:storage');
    application.inject("route", "storage", "model:storage");
    application.inject("controller", "storage", "model:storage");
    application.inject("adapter", "storage", "model:storage");
  }exports['default'] = {
    name: "storage",
    initialize: initialize
  };

});
define('coretheloothound/mixins/after-render', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Mixin.create({
    // This hook is guaranteed to be executed when the root element of this view has been inserted into the DOM.
    didInsertElement: function () {
      this._super();
      Ember['default'].run.scheduleOnce("afterRender", this, this.afterRenderEvent);
    },

    afterRenderEvent: Ember['default'].K
  });

});
define('coretheloothound/models/account', ['exports', 'ember-data'], function (exports, DS) {

  'use strict';

  exports['default'] = DS['default'].Model.extend({
    accountId: DS['default'].attr("string"),
    battletag: DS['default'].attr("string"),
    characters: DS['default'].hasMany("character"),
    raids: DS['default'].hasMany("raid")
  });

});
define('coretheloothound/models/character', ['exports', 'ember-data'], function (exports, DS) {

  'use strict';

  exports['default'] = DS['default'].Model.extend({
    name: DS['default'].attr("string"),
    realm: DS['default'].attr("string"),

    level: DS['default'].attr("number"),
    item_level: DS['default'].attr("number"),

    class_id: DS['default'].attr("number"),
    race_id: DS['default'].attr("number"),
    gender_id: DS['default'].attr("number"),

    image_url: DS['default'].attr("string"),

    account: DS['default'].belongsTo("account"),
    guild: DS['default'].belongsTo("guild"),
    signups: DS['default'].hasMany("signup"),
    roles: DS['default'].hasMany("role")
  });

});
define('coretheloothound/models/guild', ['exports', 'ember-data'], function (exports, DS) {

  'use strict';

  exports['default'] = DS['default'].Model.extend({
    name: DS['default'].attr("string"),
    realm: DS['default'].attr("string"),

    icon: DS['default'].attr("number"),
    border: DS['default'].attr("number"),

    iconPadded: (function () {
      var icon = this.get("icon");
      return _.pad(icon, 2, "0");
    }).property("icon"),

    iconColor: DS['default'].attr("string"),
    borderColor: DS['default'].attr("string"),
    backgroundColor: DS['default'].attr("string"),

    iconHexColor: (function () {
      return "#" + this.get("iconColor").substring(2, 8);
    }).property("iconColor"),

    borderHexColor: (function () {
      return "#" + this.get("borderColor").substring(2, 8);
    }).property("borderColor"),

    backgroundHexColor: (function () {
      return "#" + this.get("backgroundColor").substring(2, 8);
    }).property("backgroundColor"),

    backgroundStyle: (function () {
      return "background-color: " + this.get("backgroundHexColor") + "; border-color: " + this.get("borderHexColor") + ";";
    }).property("backgroundHexColor", "borderHexColor"),

    iconStyle: (function () {
      return "background-color: " + this.get("iconHexColor") + "; -webkit-mask-box-image: url('https://us.battle.net/wow/static/images/guild/tabards/emblem_" + this.get("iconPadded") + ".png');";
    }).property("iconHexColor", "iconPadded"),

    characters: DS['default'].hasMany("character"),

    fullName: (function () {
      return this.get("name") + " - " + this.get("realm");
    }).property("name", "realm"),

    url: (function () {
      return "http://us.battle.net/wow/guild/" + encodeURIComponent(this.get("realm")) + "/" + encodeURIComponent(this.get("name")) + "/";
    }).property("name", "realm")
  });

});
define('coretheloothound/models/permission', ['exports', 'ember-data'], function (exports, DS) {

  'use strict';

  exports['default'] = DS['default'].Model.extend({
    permissioned: DS['default'].belongsTo("permissioned", { polymorphic: true }),
    level: DS['default'].attr("string"),
    key: DS['default'].attr("string"),

    type: (function () {
      return this.get("key").split("|")[0];
    }).property("key"),

    args: (function () {
      return this.get("key").split("|")[1];
    }).property("key"),

    name: (function () {
      return this.get("args").split(":")[0];
    }).property("args"),

    realm: (function () {
      return this.get("args").split(":")[1];
    }).property("args")
  });

});
define('coretheloothound/models/permissioned', ['exports', 'ember-data'], function (exports, DS) {

  'use strict';

  exports['default'] = DS['default'].Model.extend({
    permissions: DS['default'].hasMany("permission")
  });

});
define('coretheloothound/models/raid', ['exports', 'ember-data', 'ember', 'coretheloothound/models/permissioned'], function (exports, DS, Ember, Permissioned) {

  'use strict';

  exports['default'] = Permissioned['default'].extend({
    name: DS['default'].attr("string"),
    date: DS['default'].attr("date"),
    note: DS['default'].attr("string"),
    account: DS['default'].belongsTo("account"),
    groups: DS['default'].attr(),
    admin: DS['default'].attr(),
    guild: DS['default'].belongsTo("guild"),
    signups: DS['default'].hasMany("signup"),
    finalized: DS['default'].attr(),
    hidden: DS['default'].attr(),

    moreThanOneGroup: (function () {
      return this.get("groups.number") > 1;
    }).property("groups.number"),

    signedUpCharacterIds: (function () {
      return this.get("signups").map(function (signup) {
        return signup.get("character.id");
      });
    }).property("signups.@each.character"),

    hiddenAndNotFinalized: (function () {
      return this.get("hidden") && !this.get("finalized");
    }).property("hidden", "finalized"),

    dateAgo: (function () {
      return moment(this.get("date")).fromNow();
    }).property("date"),

    dateCalendar: (function () {
      return moment(this.get("date")).calendar();
    }).property("date"),

    accountSignups: (function () {
      return this.get("signups").map(function (signup) {
        return signup.get("character.account.id");
      }).uniq().get("length");
    }).property("signups.@each.character"),

    accountWaitingList: (function () {
      return this.get("waitingList").map(function (signup) {
        return signup.get("character.account.id");
      }).uniq().get("length");
    }).property("waitingList.@each.character"),

    accountSeated: (function () {
      return this.get("seated").map(function (signup) {
        return signup.get("character.account.id");
      }).uniq().get("length");
    }).property("seated.@each.character"),

    totalSlots: (function () {
      var groups = this.get("groups");
      return groups.size * groups.number;
    }).property("groups"),

    className: function (class_id) {
      switch (class_id) {
        case 1:
          return "Warrior";
        case 2:
          return "Paladin";
        case 3:
          return "Hunter";
        case 4:
          return "Rogue";
        case 5:
          return "Priest";
        case 6:
          return "Death Knight";
        case 7:
          return "Shaman";
        case 8:
          return "Mage";
        case 9:
          return "Warlock";
        case 10:
          return "Monk";
        case 11:
          return "Druid";
        default:
          return "";
      }
    },

    hasWaitingList: (function () {
      return this.get("waitingList.length") > 0;
    }).property("waitingList.length"),

    hasSeated: (function () {
      return this.get("seated.length") > 0;
    }).property("seated.length"),

    seatedUnsorted: Ember['default'].computed.filterBy("signups", "seated", true),
    seatedSortFields: ["name"],
    seated: Ember['default'].computed.sort("seatedUnsorted", "seatedSortFields"),
    unseated: Ember['default'].computed.filterBy("signups", "seated", false),

    // Waiting list doesn't include anyone from an account that has been seated
    waitingList: (function () {
      var seated = this.get("seated");
      var unseated = this.get("unseated");
      var account_ids = seated.map(function (signup) {
        return signup.get("character.account.id");
      }).uniq();
      return unseated.filter(function (signup) {
        return !account_ids.contains(signup.get("character.account.id"));
      }).sortBy("character.account.battletag");
    }).property("seated.@each.character", "unseated.@each.character"),

    waitingListByAccount: (function () {
      var _this = this;

      return this.get("waitingList").mapBy("character.account").uniq().map(function (account) {
        return Ember['default'].Object.create({
          account: account,
          signups: _this.get("waitingList").filterBy("character.account.id", account.get("id"))
        });
      });
    }).property("waitingList.@each.account")
  });

});
define('coretheloothound/models/role', ['exports', 'ember-data'], function (exports, DS) {

  'use strict';

  exports['default'] = DS['default'].Model.extend({
    name: DS['default'].attr(),
    slug: DS['default'].attr(),
    icon: DS['default'].attr(),
    class_ids: DS['default'].attr(),

    iconClasses: (function () {
      return "role " + this.get("slug");
    }).property("slug")
  });

});
define('coretheloothound/models/signup', ['exports', 'ember-data'], function (exports, DS) {

  'use strict';

  exports['default'] = DS['default'].Model.extend({
    raid: DS['default'].belongsTo("raid"),
    character: DS['default'].belongsTo("character"),
    role: DS['default'].belongsTo("role"),
    roles: DS['default'].hasMany("role"),
    seated: DS['default'].attr(),
    preferred: DS['default'].attr(),
    note: DS['default'].attr()
  });

});
define('coretheloothound/models/storage', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  /* global Modernizr */

  exports['default'] = Ember['default'].Object.extend({
    base: "coretheloothound_",

    getValue: function (key) {
      if (Modernizr.localstorage) {
        return window.localStorage.getItem(this.get("base") + key);
      } else {
        return Ember['default'].$.cookie(this.get("base") + key);
      }
    },

    setValue: function (key, value) {
      if (Modernizr.localstorage) {
        window.localStorage.setItem(this.get("base") + key, value);
      } else {
        Ember['default'].$.cookie(this.get("base") + key, value);
      }
    },

    removeValue: function (key) {
      if (Modernizr.localstorage) {
        window.localStorage.removeItem(this.get("base") + key);
      } else {
        Ember['default'].$.removeCookie(this.get("base") + key);
      }
    }
  });

});
define('coretheloothound/router', ['exports', 'ember', 'coretheloothound/config/environment'], function (exports, Ember, config) {

  'use strict';

  var Router = Ember['default'].Router.extend({
    location: config['default'].locationType
  });

  Router.map(function () {
    // Login
    this.route("apikey", { path: "/apikey/:apikey" });

    // Raiding!
    this.resource("raids", function () {
      this.route("new");
    });
    this.resource("raid", { path: "/raid/:raid_id" }, function () {
      this.route("edit");
    });

    // User Preference Pages
    this.resource("account", function () {
      this.resource("characters", function () {});
    });
  });

  exports['default'] = Router;

});
define('coretheloothound/routes/apikey', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({
    model: function (params) {
      return params.apikey;
    },

    afterModel: function (apikey, transition) {
      this.get("storage").setValue("apikey", apikey);
      transition.send("loadUser");
      this.transitionTo("raids.index");
    }
  });

});
define('coretheloothound/routes/application', ['exports', 'coretheloothound/config/environment', 'ember'], function (exports, ENV, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({
    model: function () {
      var _this = this;
      var apikey = this.get("storage").getValue("apikey");

      if (apikey) {
        return new Ember['default'].RSVP.Promise(function (resolve) {
          Ember['default'].$.ajax({
            type: "GET",
            url: ENV['default'].api + "/account",
            headers: {
              Accept: "application/json+ember",
              Authorization: "apikey " + apikey
            },
            success: function (data) {
              delete data.permissions;
              _this.store.pushPayload("account", data);

              _this.store.find("account", data.account.id).then(function (account) {
                resolve({
                  apikey: apikey,
                  account: account
                });
              });
            },
            error: function () {
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

    setupController: function (controller, model) {
      controller.set("apikey", model.apikey);
      controller.set("account", model.account);
    },

    actions: {
      loadUser: function () {
        this.refresh();
      },

      login: function () {
        Ember['default'].$.ajax({
          type: "GET",
          url: ENV['default'].api + "/login",
          headers: {
            Accept: "application/json+ember"
          },
          data: {
            redirect: window.location.protocol + "//" + window.location.host + "/#/apikey/"
          },
          success: function (data) {
            window.location = data.href;
          }
        });
      }
    }
  });

});
define('coretheloothound/routes/characters/index', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({
    model: function () {
      return this.modelFor("application").account.get("characters");
    }
  });

});
define('coretheloothound/routes/raid', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({
    model: function (params) {
      return this.store.find("raid", params.raid_id);
    },

    setupController: function (controller, model) {
      controller.set("model", model);
      controller.set("roles", this.store.all("role"));
    },

    actions: {
      hide: function () {
        var raid = this.currentModel;
        raid.set("hidden", true);
        raid.save();
      },

      unhide: function () {
        var raid = this.currentModel;
        raid.set("hidden", false);
        raid.save();
      },

      finalize: function () {
        var raid = this.currentModel;
        raid.set("finalized", true);
        raid.save();
      },

      unfinalize: function () {
        var raid = this.currentModel;
        raid.set("finalized", false);
        raid.save();
      },

      "delete": function () {
        var _this = this;
        var raid = this.currentModel;
        if (window.confirm("Are you sure you want to delete \"" + raid.get("name") + "\"?")) {
          raid.destroyRecord().then(function () {
            _this.transitionTo("raids.index");
          });
        }
      },

      seat: function (signup, role) {
        signup.set("seated", true);
        signup.set("role", role);
        signup.save();
      },

      unseat: function (signup) {
        signup.set("seated", false);
        signup.save();
      },

      signup: function (character, note, role_ids) {
        var _this = this;
        var raid = this.currentModel;

        var signup = this.store.createRecord("signup", {
          character: character.get("model"),
          note: note,
          raid: raid
        });

        Ember['default'].RSVP.all(_.map(role_ids, function (role_id) {
          return _this.store.find("role", role_id);
        })).then(function (roles) {
          return _.each(roles, function (role) {
            signup.get("roles").addObject(role);
          });
        }).then(function () {
          signup.save();
        });
      },

      unsignup: function (signup) {
        signup.destroyRecord();
      },

      newPermission: function (level, key) {
        var raid = this.currentModel;

        var permission = this.store.createRecord("permission", {
          level: level,
          key: key,
          permissioned: raid
        });

        permission.save();
      },

      deletePermission: function (permission) {
        permission.destroyRecord();
      }
    }
  });

});
define('coretheloothound/routes/raid/index', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({
    model: function () {
      return this.modelFor("raid");
    },

    setupController: function (controller, model) {
      controller.set("model", model);
      controller.set("roles", this.store.all("role"));
    }
  });

});
define('coretheloothound/routes/raids/index', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({
    model: function () {
      return this.store.filter("raid", {}, function (raid) {
        return moment(raid.get("date")).add(6, "hours").isAfter();
      });
    },

    setupController: function (controller, model) {
      controller.set("model", model);
      controller.set("roles", this.store.all("role"));
    }
  });

});
define('coretheloothound/serializers/signup', ['exports', 'ember-data'], function (exports, DS) {

  'use strict';

  exports['default'] = DS['default'].RESTSerializer.extend({
    attrs: {
      roles: { serialize: "ids" }
    }
  });

});
define('coretheloothound/templates/account', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("h1");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, content = hooks.content;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var morph0 = dom.createMorphAt(dom.childAt(fragment, [0]),-1,-1);
        var morph1 = dom.createMorphAt(fragment,1,2,contextualElement);
        content(env, morph0, context, "account.battletag");
        content(env, morph1, context, "liquid-outlet");
        return fragment;
      }
    };
  }()));

});
define('coretheloothound/templates/apikey', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createTextNode("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, content = hooks.content;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        if (this.cachedFragment) { dom.repairClonedNode(fragment,[0]); }
        var morph0 = dom.createMorphAt(fragment,0,1,contextualElement);
        content(env, morph0, context, "outlet");
        return fragment;
      }
    };
  }()));

});
define('coretheloothound/templates/application', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        isHTMLBars: true,
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("          ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("p");
          var el2 = dom.createTextNode("\n            Currently using API Key: ");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n          ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, content = hooks.content;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var morph0 = dom.createMorphAt(dom.childAt(fragment, [1]),0,1);
          content(env, morph0, context, "apikey");
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","container");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("header");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","wrapper");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("h1");
        var el5 = dom.createTextNode("Core the Loot Hound");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("footer");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","wrapper");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("section");
        dom.setAttribute(el4,"class","description");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("p");
        var el6 = dom.createTextNode("\n          Core the Loot Hound is an ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("a");
        dom.setAttribute(el6,"href","http://emberjs.com/");
        var el7 = dom.createTextNode("Ember.js");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode(" front end to the\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("a");
        dom.setAttribute(el6,"href","http://byfirebepurged.com");
        var el7 = dom.createTextNode("By Fire Be Purged");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode(" raid scheduling API.\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("p");
        var el6 = dom.createTextNode("\n          You can ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("a");
        dom.setAttribute(el6,"href","http://docs.coretheloothound.com");
        var el7 = dom.createElement("span");
        dom.setAttribute(el7,"class","octicon octicon-book");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode(" view the docs");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode(", help\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("a");
        dom.setAttribute(el6,"href","http://code.coretheloothound.com");
        var el7 = dom.createElement("span");
        dom.setAttribute(el7,"class","octicon octicon-git-branch");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode(" contribute");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode(", and\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("a");
        dom.setAttribute(el6,"href","http://issues.coretheloothound.com");
        var el7 = dom.createElement("span");
        dom.setAttribute(el7,"class","octicon octicon-issue-opened");
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
        dom.setAttribute(el4,"class","copyright");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("p");
        var el6 = dom.createTextNode("\n          © 2014 by Christopher Giroir <");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("a");
        dom.setAttribute(el6,"href","mailto:kelsin@valefor.com");
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
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, inline = hooks.inline, content = hooks.content, get = hooks.get, block = hooks.block;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var element0 = dom.childAt(fragment, [0]);
        var morph0 = dom.createMorphAt(dom.childAt(element0, [1, 1]),2,3);
        var morph1 = dom.createMorphAt(element0,2,3);
        var morph2 = dom.createMorphAt(dom.childAt(element0, [4, 1, 1]),2,3);
        inline(env, morph0, context, "render", ["auth"], {});
        content(env, morph1, context, "liquid-outlet");
        block(env, morph2, context, "if", [get(env, context, "loggedIn")], {}, child0, null);
        return fragment;
      }
    };
  }()));

});
define('coretheloothound/templates/auth', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        isHTMLBars: true,
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createElement("i");
          dom.setAttribute(el1,"class","fa fa-home");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode(" Home");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    var child1 = (function() {
      var child0 = (function() {
        return {
          isHTMLBars: true,
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createElement("i");
            dom.setAttribute(el1,"class","fa fa-trophy");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode(" Raids");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            return fragment;
          }
        };
      }());
      var child1 = (function() {
        return {
          isHTMLBars: true,
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createElement("i");
            dom.setAttribute(el1,"class","fa fa-users");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode(" Characters");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            return fragment;
          }
        };
      }());
      return {
        isHTMLBars: true,
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("li");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("li");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("li");
          var el2 = dom.createElement("i");
          dom.setAttribute(el2,"class","fa fa-user");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode(" ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("li");
          var el2 = dom.createTextNode("\n      ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("button");
          dom.setAttribute(el2,"class","btn btn-sm btn-default");
          var el3 = dom.createTextNode("\n        ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("i");
          dom.setAttribute(el3,"class","fa fa-sign-out");
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
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, block = hooks.block, content = hooks.content, element = hooks.element;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var element1 = dom.childAt(fragment, [7, 1]);
          var morph0 = dom.createMorphAt(dom.childAt(fragment, [1]),-1,-1);
          var morph1 = dom.createMorphAt(dom.childAt(fragment, [3]),-1,-1);
          var morph2 = dom.createMorphAt(dom.childAt(fragment, [5]),1,-1);
          block(env, morph0, context, "link-to", ["raids"], {}, child0, null);
          block(env, morph1, context, "link-to", ["characters"], {}, child1, null);
          content(env, morph2, context, "account.battletag");
          element(env, element1, context, "action", ["logout"], {});
          return fragment;
        }
      };
    }());
    var child2 = (function() {
      return {
        isHTMLBars: true,
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("li");
          var el2 = dom.createTextNode("\n      ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("button");
          dom.setAttribute(el2,"class","btn btn-sm btn-primary");
          var el3 = dom.createTextNode("\n        ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("i");
          dom.setAttribute(el3,"class","fa fa-sign-in");
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
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, element = hooks.element;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var element0 = dom.childAt(fragment, [1, 1]);
          element(env, element0, context, "action", ["login"], {});
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("ul");
        dom.setAttribute(el1,"class","auth");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("li");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, block = hooks.block, get = hooks.get;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var element2 = dom.childAt(fragment, [0]);
        var morph0 = dom.createMorphAt(dom.childAt(element2, [1]),-1,-1);
        var morph1 = dom.createMorphAt(element2,2,-1);
        block(env, morph0, context, "link-to", ["index"], {}, child0, null);
        block(env, morph1, context, "if", [get(env, context, "loggedIn")], {}, child1, child2);
        return fragment;
      }
    };
  }()));

});
define('coretheloothound/templates/characters', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","characters");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("h2");
        var el3 = dom.createTextNode("Characters");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, content = hooks.content;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var morph0 = dom.createMorphAt(dom.childAt(fragment, [0]),2,3);
        content(env, morph0, context, "liquid-outlet");
        return fragment;
      }
    };
  }()));

});
define('coretheloothound/templates/characters/index', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        isHTMLBars: true,
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","character");
          var el2 = dom.createTextNode("\n      ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("h3");
          var el3 = dom.createTextNode(" ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("small");
          var el4 = dom.createTextNode(" ");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n      ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("img");
          dom.setAttribute(el2,"class","character");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n      ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("p");
          var el3 = dom.createTextNode(" ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n      ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("p");
          dom.setAttribute(el2,"class","links");
          var el3 = dom.createTextNode("\n        ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("a");
          var el4 = dom.createElement("img");
          dom.setAttribute(el4,"src","images/wow.png");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n        ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("a");
          var el4 = dom.createElement("img");
          dom.setAttribute(el4,"src","images/wowhead.png");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n        ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("a");
          var el4 = dom.createElement("img");
          dom.setAttribute(el4,"src","images/robot.png");
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
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, content = hooks.content, element = hooks.element, get = hooks.get, inline = hooks.inline;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var element0 = dom.childAt(fragment, [1]);
          var element1 = dom.childAt(element0, [1]);
          var element2 = dom.childAt(element1, [1]);
          var element3 = dom.childAt(element0, [3]);
          var element4 = dom.childAt(element0, [5]);
          var element5 = dom.childAt(element0, [7]);
          var element6 = dom.childAt(element5, [1]);
          var element7 = dom.childAt(element5, [3]);
          var element8 = dom.childAt(element5, [5]);
          var morph0 = dom.createMorphAt(element1,-1,0);
          var morph1 = dom.createMorphAt(element2,-1,0);
          var morph2 = dom.createMorphAt(element2,0,-1);
          var morph3 = dom.createMorphAt(element4,-1,0);
          var morph4 = dom.createMorphAt(element4,0,-1);
          content(env, morph0, context, "character.name");
          content(env, morph1, context, "character.level");
          content(env, morph2, context, "character.realm");
          element(env, element3, context, "bind-attr", [], {"src": "character.image_url"});
          inline(env, morph3, context, "character-race", [get(env, context, "character.race_id")], {});
          inline(env, morph4, context, "character-class", [get(env, context, "character.class_id")], {});
          element(env, element6, context, "bind-attr", [], {"href": "character.armoryUrl"});
          element(env, element7, context, "bind-attr", [], {"href": "character.wowheadUrl"});
          element(env, element8, context, "bind-attr", [], {"href": "character.robotUrl"});
          return fragment;
        }
      };
    }());
    var child1 = (function() {
      var child0 = (function() {
        return {
          isHTMLBars: true,
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createTextNode("max level ");
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            return fragment;
          }
        };
      }());
      return {
        isHTMLBars: true,
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","empty");
          var el2 = dom.createTextNode("\n      ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("div");
          dom.setAttribute(el2,"class","alert alert-info");
          var el3 = dom.createTextNode("No ");
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
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, get = hooks.get, block = hooks.block;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var morph0 = dom.createMorphAt(dom.childAt(fragment, [1, 1]),0,1);
          block(env, morph0, context, "if", [get(env, context, "onlyMax")], {}, child0, null);
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","well form");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","form-group");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("label");
        dom.setAttribute(el3,"for","realms");
        var el4 = dom.createTextNode("Realm");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","checkbox");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("label");
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
        dom.setAttribute(el1,"class","characters-list");
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, inline = hooks.inline, block = hooks.block;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var element9 = dom.childAt(fragment, [0]);
        var morph0 = dom.createMorphAt(dom.childAt(element9, [1]),2,3);
        var morph1 = dom.createMorphAt(dom.childAt(element9, [3, 1]),-1,0);
        var morph2 = dom.createMorphAt(dom.childAt(fragment, [2]),0,-1);
        inline(env, morph0, context, "view", ["select"], {"id": "realms", "class": "form-control", "content": get(env, context, "realms"), "value": get(env, context, "realm")});
        inline(env, morph1, context, "input", [], {"type": "checkbox", "checked": get(env, context, "onlyMax")});
        block(env, morph2, context, "each", [get(env, context, "filtered")], {"itemController": "character", "keyword": "character"}, child0, child1);
        return fragment;
      }
    };
  }()));

});
define('coretheloothound/templates/components/character-select', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        isHTMLBars: true,
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("          ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","checkbox");
          var el2 = dom.createTextNode("\n            ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("label");
          var el3 = dom.createTextNode("\n              ");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n              ");
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
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, get = hooks.get, inline = hooks.inline, content = hooks.content;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var element0 = dom.childAt(fragment, [1, 1]);
          var morph0 = dom.createMorphAt(element0,0,1);
          var morph1 = dom.createMorphAt(element0,1,2);
          inline(env, morph0, context, "input", [], {"id": get(env, context, "slug"), "type": "checkbox", "checked": get(env, context, "box.checked"), "name": get(env, context, "box.name")});
          content(env, morph1, context, "box.name");
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("h3");
        var el2 = dom.createTextNode("Signup");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("form");
        dom.setAttribute(el1,"class","form");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","row");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","col-md-12");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","form-group");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("label");
        dom.setAttribute(el5,"for","character");
        var el6 = dom.createTextNode("Character");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n\n");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("button");
        dom.setAttribute(el4,"class","btn btn-primary");
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
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, inline = hooks.inline, block = hooks.block, element = hooks.element;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var element1 = dom.childAt(fragment, [2, 1, 1]);
        var element2 = dom.childAt(element1, [1]);
        var element3 = dom.childAt(element1, [3]);
        var morph0 = dom.createMorphAt(element2,2,3);
        var morph1 = dom.createMorphAt(element2,3,4);
        var morph2 = dom.createMorphAt(element2,4,5);
        inline(env, morph0, context, "view", ["select"], {"id": "character", "class": "form-control", "content": get(env, context, "characters"), "selection": get(env, context, "character"), "optionValuePath": "content.id", "optionLabelPath": "content.label"});
        inline(env, morph1, context, "input", [], {"class": "form-control", "placeholder": "Note", "value": get(env, context, "note")});
        block(env, morph2, context, "each", [get(env, context, "roleCheckboxes")], {"keyword": "box"}, child0, null);
        element(env, element3, context, "action", ["signup"], {});
        return fragment;
      }
    };
  }()));

});
define('coretheloothound/templates/components/date-time', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","date-container row");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","col-md-3");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","input-group margin-bottom-sm");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("span");
        dom.setAttribute(el4,"class","input-group-addon");
        var el5 = dom.createElement("i");
        dom.setAttribute(el5,"class","fa fa-calendar-o fa-fw");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
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
        dom.setAttribute(el2,"class","col-md-3");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","input-group margin-bottom-sm");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("span");
        dom.setAttribute(el4,"class","input-group-addon");
        var el5 = dom.createElement("i");
        dom.setAttribute(el5,"class","fa fa-clock-o fa-fw");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
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
        dom.setAttribute(el2,"class","col-md-6");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("p");
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
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, inline = hooks.inline, content = hooks.content;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var element0 = dom.childAt(fragment, [0]);
        var morph0 = dom.createMorphAt(dom.childAt(element0, [1, 1]),2,3);
        var morph1 = dom.createMorphAt(dom.childAt(element0, [3, 1]),2,3);
        var morph2 = dom.createMorphAt(dom.childAt(element0, [5, 1]),-1,-1);
        inline(env, morph0, context, "input", [], {"type": "text", "id": "raid-date", "value": get(env, context, "pickdate"), "class": "datepicker form-control"});
        inline(env, morph1, context, "input", [], {"type": "text", "id": "raid-time", "value": get(env, context, "picktime"), "class": "timepicker form-control"});
        content(env, morph2, context, "dateAgo");
        return fragment;
      }
    };
  }()));

});
define('coretheloothound/templates/components/donut-graph', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("h3");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","graph");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, content = hooks.content;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var morph0 = dom.createMorphAt(dom.childAt(fragment, [0]),-1,-1);
        content(env, morph0, context, "title");
        return fragment;
      }
    };
  }()));

});
define('coretheloothound/templates/components/guild-select', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createTextNode("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, inline = hooks.inline;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        if (this.cachedFragment) { dom.repairClonedNode(fragment,[0]); }
        var morph0 = dom.createMorphAt(fragment,0,1,contextualElement);
        inline(env, morph0, context, "view", ["select"], {"content": get(env, context, "guilds"), "selection": get(env, context, "guild"), "optionValuePath": "content.id", "optionLabelPath": "content.fullName", "prompt": "None", "class": "form-control"});
        return fragment;
      }
    };
  }()));

});
define('coretheloothound/templates/components/liquid-bind-c', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        isHTMLBars: true,
        blockParams: 1,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement, blockArguments) {
          var dom = env.dom;
          var hooks = env.hooks, set = hooks.set, content = hooks.content;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var morph0 = dom.createMorphAt(fragment,0,1,contextualElement);
          set(env, context, "boundValue", blockArguments[0]);
          content(env, morph0, context, "boundValue");
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createTextNode("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, block = hooks.block;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        if (this.cachedFragment) { dom.repairClonedNode(fragment,[0,1]); }
        var morph0 = dom.createMorphAt(fragment,0,1,contextualElement);
        block(env, morph0, context, "liquid-with", [get(env, context, "value")], {"class": get(env, context, "innerClass"), "use": get(env, context, "use"), "containerless": get(env, context, "containerless")}, child0, null);
        return fragment;
      }
    };
  }()));

});
define('coretheloothound/templates/components/liquid-measured', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createTextNode("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, content = hooks.content;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        if (this.cachedFragment) { dom.repairClonedNode(fragment,[0,1]); }
        var morph0 = dom.createMorphAt(fragment,0,1,contextualElement);
        content(env, morph0, context, "yield");
        return fragment;
      }
    };
  }()));

});
define('coretheloothound/templates/components/liquid-modal', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      var child0 = (function() {
        return {
          isHTMLBars: true,
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("    ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("div");
            dom.setAttribute(el1,"role","dialog");
            var el2 = dom.createTextNode("\n      ");
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n    ");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n    ");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            var hooks = env.hooks, element = hooks.element, get = hooks.get, inline = hooks.inline;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            var element0 = dom.childAt(fragment, [1]);
            var morph0 = dom.createMorphAt(element0,0,1);
            var morph1 = dom.createMorphAt(fragment,2,3,contextualElement);
            element(env, element0, context, "bind-attr", [], {"class": ":lf-dialog cc.options.dialogClass"});
            element(env, element0, context, "bind-attr", [], {"aria-labelledby": "cc.options.ariaLabelledBy", "aria-label": "cc.options.ariaLabel"});
            inline(env, morph0, context, "view", [get(env, context, "innerView")], {"dismiss": "dismiss"});
            inline(env, morph1, context, "lf-overlay", [], {"clickAway": "outsideClick"});
            return fragment;
          }
        };
      }());
      return {
        isHTMLBars: true,
        blockParams: 1,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement, blockArguments) {
          var dom = env.dom;
          var hooks = env.hooks, set = hooks.set, block = hooks.block;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          if (this.cachedFragment) { dom.repairClonedNode(fragment,[0,1]); }
          var morph0 = dom.createMorphAt(fragment,0,1,contextualElement);
          set(env, context, "cc", blockArguments[0]);
          block(env, morph0, context, "lm-container", [], {"action": "escape"}, child0, null);
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createTextNode("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, block = hooks.block;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        if (this.cachedFragment) { dom.repairClonedNode(fragment,[0,1]); }
        var morph0 = dom.createMorphAt(fragment,0,1,contextualElement);
        block(env, morph0, context, "liquid-with", [get(env, context, "currentContext")], {"class": "lm-with", "containerless": true}, child0, null);
        return fragment;
      }
    };
  }()));

});
define('coretheloothound/templates/components/liquid-spacer', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        isHTMLBars: true,
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, content = hooks.content;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var morph0 = dom.createMorphAt(fragment,0,1,contextualElement);
          content(env, morph0, context, "yield");
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createTextNode("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, block = hooks.block;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        if (this.cachedFragment) { dom.repairClonedNode(fragment,[0,1]); }
        var morph0 = dom.createMorphAt(fragment,0,1,contextualElement);
        block(env, morph0, context, "liquid-measured", [], {"width": get(env, context, "width"), "height": get(env, context, "height")}, child0, null);
        return fragment;
      }
    };
  }()));

});
define('coretheloothound/templates/components/raid-group', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        isHTMLBars: true,
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","waiting-list");
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("div");
          dom.setAttribute(el2,"class","target");
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
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    var child1 = (function() {
      return {
        isHTMLBars: true,
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","tank");
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("div");
          dom.setAttribute(el2,"class","target");
          var el3 = dom.createTextNode("\n    ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n  ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","healing");
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("div");
          dom.setAttribute(el2,"class","target");
          var el3 = dom.createTextNode("\n    ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n  ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","dps");
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("div");
          dom.setAttribute(el2,"class","target");
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
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","targets");
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, block = hooks.block;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var morph0 = dom.createMorphAt(dom.childAt(fragment, [0]),0,-1);
        block(env, morph0, context, "if", [get(env, context, "waitingList")], {}, child0, child1);
        return fragment;
      }
    };
  }()));

});
define('coretheloothound/templates/components/raid-permission', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        isHTMLBars: true,
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("a");
          var el2 = dom.createElement("i");
          dom.setAttribute(el2,"class","fa fa-close fa-fw");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, element = hooks.element;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var element0 = dom.childAt(fragment, [1]);
          element(env, element0, context, "action", ["deletePermission"], {});
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createTextNode("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, content = hooks.content, get = hooks.get, block = hooks.block;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        if (this.cachedFragment) { dom.repairClonedNode(fragment,[0,2]); }
        var morph0 = dom.createMorphAt(fragment,0,1,contextualElement);
        var morph1 = dom.createMorphAt(fragment,1,2,contextualElement);
        content(env, morph0, context, "label");
        block(env, morph1, context, "unless", [get(env, context, "ownAccount")], {}, child0, null);
        return fragment;
      }
    };
  }()));

});
define('coretheloothound/templates/components/raid-permissions', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      var child0 = (function() {
        return {
          isHTMLBars: true,
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("    ");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            var hooks = env.hooks, get = hooks.get, inline = hooks.inline;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            var morph0 = dom.createMorphAt(fragment,0,1,contextualElement);
            inline(env, morph0, context, "raid-permission", [], {"account": get(env, context, "account"), "permission": get(env, context, "permission"), "deletePermission": "deletePermission"});
            return fragment;
          }
        };
      }());
      var child1 = (function() {
        return {
          isHTMLBars: true,
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("    ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("div");
            dom.setAttribute(el1,"class","text-muted");
            var el2 = dom.createTextNode("None");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            return fragment;
          }
        };
      }());
      var child2 = (function() {
        return {
          isHTMLBars: true,
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("    ");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            var hooks = env.hooks, get = hooks.get, inline = hooks.inline;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            var morph0 = dom.createMorphAt(fragment,0,1,contextualElement);
            inline(env, morph0, context, "raid-permission", [], {"account": get(env, context, "account"), "permission": get(env, context, "permission"), "deletePermission": "deletePermission"});
            return fragment;
          }
        };
      }());
      var child3 = (function() {
        return {
          isHTMLBars: true,
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("    ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("div");
            dom.setAttribute(el1,"class","text-muted");
            var el2 = dom.createTextNode("None");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            return fragment;
          }
        };
      }());
      return {
        isHTMLBars: true,
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
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
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("form");
          dom.setAttribute(el1,"class","form");
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("div");
          dom.setAttribute(el2,"class","row");
          var el3 = dom.createTextNode("\n      ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("div");
          dom.setAttribute(el3,"class","col-md-12");
          var el4 = dom.createTextNode("\n        ");
          dom.appendChild(el3, el4);
          var el4 = dom.createElement("div");
          dom.setAttribute(el4,"class","form-group");
          var el5 = dom.createTextNode("\n          ");
          dom.appendChild(el4, el5);
          var el5 = dom.createTextNode("\n        ");
          dom.appendChild(el4, el5);
          dom.appendChild(el3, el4);
          var el4 = dom.createTextNode("\n        ");
          dom.appendChild(el3, el4);
          var el4 = dom.createElement("button");
          dom.setAttribute(el4,"class","btn btn-primary");
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
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("form");
          dom.setAttribute(el1,"class","form");
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("div");
          dom.setAttribute(el2,"class","row");
          var el3 = dom.createTextNode("\n      ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("div");
          dom.setAttribute(el3,"class","col-md-12");
          var el4 = dom.createTextNode("\n        ");
          dom.appendChild(el3, el4);
          var el4 = dom.createElement("div");
          dom.setAttribute(el4,"class","form-group");
          var el5 = dom.createTextNode("\n          ");
          dom.appendChild(el4, el5);
          var el5 = dom.createElement("label");
          var el6 = dom.createTextNode("Battletag");
          dom.appendChild(el5, el6);
          dom.appendChild(el4, el5);
          var el5 = dom.createTextNode("\n          ");
          dom.appendChild(el4, el5);
          var el5 = dom.createTextNode("\n        ");
          dom.appendChild(el4, el5);
          dom.appendChild(el3, el4);
          var el4 = dom.createTextNode("\n        ");
          dom.appendChild(el3, el4);
          var el4 = dom.createElement("button");
          dom.setAttribute(el4,"class","btn btn-primary");
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
          dom.setAttribute(el1,"class","form");
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("div");
          dom.setAttribute(el2,"class","row");
          var el3 = dom.createTextNode("\n      ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("div");
          dom.setAttribute(el3,"class","col-md-12");
          var el4 = dom.createTextNode("\n        ");
          dom.appendChild(el3, el4);
          var el4 = dom.createElement("div");
          dom.setAttribute(el4,"class","form-group");
          var el5 = dom.createTextNode("\n          ");
          dom.appendChild(el4, el5);
          var el5 = dom.createElement("label");
          var el6 = dom.createTextNode("Character");
          dom.appendChild(el5, el6);
          dom.appendChild(el4, el5);
          var el5 = dom.createTextNode("\n          ");
          dom.appendChild(el4, el5);
          var el5 = dom.createTextNode("\n          ");
          dom.appendChild(el4, el5);
          var el5 = dom.createTextNode("\n        ");
          dom.appendChild(el4, el5);
          dom.appendChild(el3, el4);
          var el4 = dom.createTextNode("\n        ");
          dom.appendChild(el3, el4);
          var el4 = dom.createElement("button");
          dom.setAttribute(el4,"class","btn btn-primary");
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
          dom.setAttribute(el1,"class","form");
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("div");
          dom.setAttribute(el2,"class","row");
          var el3 = dom.createTextNode("\n      ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("div");
          dom.setAttribute(el3,"class","col-md-12");
          var el4 = dom.createTextNode("\n        ");
          dom.appendChild(el3, el4);
          var el4 = dom.createElement("div");
          dom.setAttribute(el4,"class","form-group");
          var el5 = dom.createTextNode("\n          ");
          dom.appendChild(el4, el5);
          var el5 = dom.createElement("label");
          var el6 = dom.createTextNode("Guild");
          dom.appendChild(el5, el6);
          dom.appendChild(el4, el5);
          var el5 = dom.createTextNode("\n          ");
          dom.appendChild(el4, el5);
          var el5 = dom.createTextNode("\n          ");
          dom.appendChild(el4, el5);
          var el5 = dom.createTextNode("\n        ");
          dom.appendChild(el4, el5);
          dom.appendChild(el3, el4);
          var el4 = dom.createTextNode("\n        ");
          dom.appendChild(el3, el4);
          var el4 = dom.createElement("button");
          dom.setAttribute(el4,"class","btn btn-primary");
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
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, get = hooks.get, block = hooks.block, inline = hooks.inline, element = hooks.element;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var element0 = dom.childAt(fragment, [6, 1, 1]);
          var element1 = dom.childAt(element0, [3]);
          var element2 = dom.childAt(fragment, [11, 1, 1]);
          var element3 = dom.childAt(element2, [3]);
          var element4 = dom.childAt(fragment, [13, 1, 1]);
          var element5 = dom.childAt(element4, [1]);
          var element6 = dom.childAt(element4, [3]);
          var element7 = dom.childAt(fragment, [15, 1, 1]);
          var element8 = dom.childAt(element7, [1]);
          var element9 = dom.childAt(element7, [3]);
          var morph0 = dom.createMorphAt(fragment,4,5,contextualElement);
          var morph1 = dom.createMorphAt(dom.childAt(element0, [1]),0,1);
          var morph2 = dom.createMorphAt(fragment,9,10,contextualElement);
          var morph3 = dom.createMorphAt(dom.childAt(element2, [1]),2,3);
          var morph4 = dom.createMorphAt(element5,2,3);
          var morph5 = dom.createMorphAt(element5,3,4);
          var morph6 = dom.createMorphAt(element8,2,3);
          var morph7 = dom.createMorphAt(element8,3,4);
          block(env, morph0, context, "each", [get(env, context, "adminPermissions")], {"keyword": "permission"}, child0, child1);
          inline(env, morph1, context, "input", [], {"class": "form-control", "placeholder": "Battletag#9999", "value": get(env, context, "adminAccount")});
          element(env, element1, context, "action", ["newAdminPermission"], {});
          block(env, morph2, context, "each", [get(env, context, "memberPermissions")], {"keyword": "permission"}, child2, child3);
          inline(env, morph3, context, "input", [], {"class": "form-control", "placeholder": "Battletag#9999", "value": get(env, context, "memberAccount")});
          element(env, element3, context, "action", ["newMemberAccountPermission"], {});
          inline(env, morph4, context, "input", [], {"class": "form-control", "placeholder": "Character Name", "value": get(env, context, "characterName")});
          inline(env, morph5, context, "input", [], {"class": "form-control", "placeholder": "Character Realm", "value": get(env, context, "characterRealm")});
          element(env, element6, context, "action", ["newMemberCharacterPermission"], {});
          inline(env, morph6, context, "input", [], {"class": "form-control", "placeholder": "Guild Name", "value": get(env, context, "guildName")});
          inline(env, morph7, context, "input", [], {"class": "form-control", "placeholder": "Guild Realm", "value": get(env, context, "guildRealm")});
          element(env, element9, context, "action", ["newMemberGuildPermission"], {});
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createTextNode("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, block = hooks.block;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        if (this.cachedFragment) { dom.repairClonedNode(fragment,[0,1]); }
        var morph0 = dom.createMorphAt(fragment,0,1,contextualElement);
        block(env, morph0, context, "if", [get(env, context, "raid.admin")], {}, child0, null);
        return fragment;
      }
    };
  }()));

});
define('coretheloothound/templates/components/raid-signup', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        isHTMLBars: true,
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("i");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, element = hooks.element;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var element6 = dom.childAt(fragment, [1]);
          element(env, element6, context, "bind-attr", [], {"class": "iconClasses"});
          return fragment;
        }
      };
    }());
    var child1 = (function() {
      var child0 = (function() {
        return {
          isHTMLBars: true,
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("      ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("a");
            var el2 = dom.createElement("i");
            dom.setAttribute(el2,"class","fa fa-arrow-circle-left fa-fw");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            var hooks = env.hooks, element = hooks.element;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            var element3 = dom.childAt(fragment, [1]);
            element(env, element3, context, "action", ["unseat"], {});
            return fragment;
          }
        };
      }());
      var child1 = (function() {
        var child0 = (function() {
          var child0 = (function() {
            return {
              isHTMLBars: true,
              blockParams: 0,
              cachedFragment: null,
              hasRendered: false,
              build: function build(dom) {
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
              render: function render(context, env, contextualElement) {
                var dom = env.dom;
                var hooks = env.hooks, get = hooks.get, element = hooks.element;
                dom.detectNamespace(contextualElement);
                var fragment;
                if (env.useFragmentCache && dom.canClone) {
                  if (this.cachedFragment === null) {
                    fragment = this.build(dom);
                    if (this.hasRendered) {
                      this.cachedFragment = fragment;
                    } else {
                      this.hasRendered = true;
                    }
                  }
                  if (this.cachedFragment) {
                    fragment = dom.cloneNode(this.cachedFragment, true);
                  }
                } else {
                  fragment = this.build(dom);
                }
                var element1 = dom.childAt(fragment, [1]);
                var element2 = dom.childAt(element1, [0]);
                element(env, element1, context, "action", ["seat", get(env, context, "role")], {});
                element(env, element2, context, "bind-attr", [], {"class": "role.iconClasses"});
                return fragment;
              }
            };
          }());
          return {
            isHTMLBars: true,
            blockParams: 0,
            cachedFragment: null,
            hasRendered: false,
            build: function build(dom) {
              var el0 = dom.createDocumentFragment();
              var el1 = dom.createTextNode("");
              dom.appendChild(el0, el1);
              var el1 = dom.createTextNode("");
              dom.appendChild(el0, el1);
              return el0;
            },
            render: function render(context, env, contextualElement) {
              var dom = env.dom;
              var hooks = env.hooks, get = hooks.get, block = hooks.block;
              dom.detectNamespace(contextualElement);
              var fragment;
              if (env.useFragmentCache && dom.canClone) {
                if (this.cachedFragment === null) {
                  fragment = this.build(dom);
                  if (this.hasRendered) {
                    this.cachedFragment = fragment;
                  } else {
                    this.hasRendered = true;
                  }
                }
                if (this.cachedFragment) {
                  fragment = dom.cloneNode(this.cachedFragment, true);
                }
              } else {
                fragment = this.build(dom);
              }
              if (this.cachedFragment) { dom.repairClonedNode(fragment,[0,1]); }
              var morph0 = dom.createMorphAt(fragment,0,1,contextualElement);
              block(env, morph0, context, "each", [get(env, context, "sortedRoles")], {"keyword": "role"}, child0, null);
              return fragment;
            }
          };
        }());
        return {
          isHTMLBars: true,
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            var hooks = env.hooks, get = hooks.get, block = hooks.block;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            if (this.cachedFragment) { dom.repairClonedNode(fragment,[0,1]); }
            var morph0 = dom.createMorphAt(fragment,0,1,contextualElement);
            block(env, morph0, context, "if", [get(env, context, "signup.canBeSeated")], {}, child0, null);
            return fragment;
          }
        };
      }());
      return {
        isHTMLBars: true,
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("span");
          dom.setAttribute(el1,"class","seat pull-right");
          var el2 = dom.createTextNode("\n");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("    ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("a");
          var el3 = dom.createElement("i");
          dom.setAttribute(el3,"class","fa fa-close fa-fw");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n  ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, get = hooks.get, block = hooks.block, element = hooks.element;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var element4 = dom.childAt(fragment, [1]);
          var element5 = dom.childAt(element4, [2]);
          var morph0 = dom.createMorphAt(element4,0,1);
          block(env, morph0, context, "if", [get(env, context, "signup.seated")], {}, child0, child1);
          element(env, element5, context, "action", ["unsignup"], {});
          return fragment;
        }
      };
    }());
    var child2 = (function() {
      var child0 = (function() {
        return {
          isHTMLBars: true,
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("    ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("a");
            var el2 = dom.createElement("i");
            dom.setAttribute(el2,"class","fa fa-close fa-fw");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            var hooks = env.hooks, element = hooks.element;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            var element0 = dom.childAt(fragment, [1]);
            element(env, element0, context, "action", ["unsignup"], {});
            return fragment;
          }
        };
      }());
      return {
        isHTMLBars: true,
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, get = hooks.get, block = hooks.block;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          if (this.cachedFragment) { dom.repairClonedNode(fragment,[0,1]); }
          var morph0 = dom.createMorphAt(fragment,0,1,contextualElement);
          block(env, morph0, context, "if", [get(env, context, "mine")], {}, child0, null);
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createTextNode("");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("span");
        var el2 = dom.createTextNode(" ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("small");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, block = hooks.block, element = hooks.element, content = hooks.content;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        if (this.cachedFragment) { dom.repairClonedNode(fragment,[0,3]); }
        var element7 = dom.childAt(fragment, [1]);
        var morph0 = dom.createMorphAt(fragment,0,1,contextualElement);
        var morph1 = dom.createMorphAt(element7,-1,0);
        var morph2 = dom.createMorphAt(dom.childAt(element7, [1]),-1,-1);
        var morph3 = dom.createMorphAt(fragment,2,3,contextualElement);
        block(env, morph0, context, "if", [get(env, context, "signup.seated")], {}, child0, null);
        element(env, element7, context, "bind-attr", [], {"class": get(env, context, "classes")});
        content(env, morph1, context, "signup.character.name");
        content(env, morph2, context, "signup.character.item_level");
        block(env, morph3, context, "if", [get(env, context, "signup.raid.admin")], {}, child1, child2);
        return fragment;
      }
    };
  }()));

});
define('coretheloothound/templates/index', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        return fragment;
      }
    };
  }()));

});
define('coretheloothound/templates/liquid-with-self', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createTextNode("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, content = hooks.content;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        if (this.cachedFragment) { dom.repairClonedNode(fragment,[0]); }
        var morph0 = dom.createMorphAt(fragment,0,1,contextualElement);
        content(env, morph0, context, "value");
        return fragment;
      }
    };
  }()));

});
define('coretheloothound/templates/liquid-with', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createTextNode("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, content = hooks.content;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        if (this.cachedFragment) { dom.repairClonedNode(fragment,[0]); }
        var morph0 = dom.createMorphAt(fragment,0,1,contextualElement);
        content(env, morph0, context, "with-apply");
        return fragment;
      }
    };
  }()));

});
define('coretheloothound/templates/raid', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        isHTMLBars: true,
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("        ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","alert alert-success");
          dom.setAttribute(el1,"role","alert");
          var el2 = dom.createTextNode("\n          ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("strong");
          var el3 = dom.createTextNode("Seated");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n          on ");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode(". See you at the raid!\n        ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, content = hooks.content;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var morph0 = dom.createMorphAt(dom.childAt(fragment, [1]),2,3);
          content(env, morph0, context, "currentAccountSeated.character.name");
          return fragment;
        }
      };
    }());
    var child1 = (function() {
      var child0 = (function() {
        return {
          isHTMLBars: true,
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("          ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("div");
            dom.setAttribute(el1,"class","alert alert-info");
            dom.setAttribute(el1,"role","alert");
            var el2 = dom.createTextNode("\n            You have ");
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
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            var hooks = env.hooks, content = hooks.content;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            var morph0 = dom.createMorphAt(dom.childAt(fragment, [1]),0,1);
            content(env, morph0, context, "currentAccountSignedUp.length");
            return fragment;
          }
        };
      }());
      var child1 = (function() {
        return {
          isHTMLBars: true,
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("          ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("div");
            dom.setAttribute(el1,"class","alert alert-danger");
            dom.setAttribute(el1,"role","alert");
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
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            return fragment;
          }
        };
      }());
      return {
        isHTMLBars: true,
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, get = hooks.get, block = hooks.block;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          if (this.cachedFragment) { dom.repairClonedNode(fragment,[0,1]); }
          var morph0 = dom.createMorphAt(fragment,0,1,contextualElement);
          block(env, morph0, context, "if", [get(env, context, "currentAccountSignedUp")], {}, child0, child1);
          return fragment;
        }
      };
    }());
    var child2 = (function() {
      return {
        isHTMLBars: true,
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("        ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","alert alert-danger");
          dom.setAttribute(el1,"role","alert");
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
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","raid");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("section");
        dom.setAttribute(el2,"class","title");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("h1");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","stats");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"title","Seated accounts");
        dom.setAttribute(el4,"class","stat");
        var el5 = dom.createTextNode(" ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("i");
        dom.setAttribute(el5,"class","fa fa-check fa-fw");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"title","Accounts on the waiting list");
        dom.setAttribute(el4,"class","stat");
        var el5 = dom.createTextNode(" ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("i");
        dom.setAttribute(el5,"class","fa fa-bars fa-fw");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"title","Accounts signed up");
        dom.setAttribute(el4,"class","stat");
        var el5 = dom.createTextNode(" ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("i");
        dom.setAttribute(el5,"class","fa fa-users fa-fw");
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
        dom.setAttribute(el2,"class","alerts");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","wrapper");
        var el4 = dom.createTextNode("\n");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, content = hooks.content, get = hooks.get, block = hooks.block;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var element0 = dom.childAt(fragment, [0]);
        var element1 = dom.childAt(element0, [1]);
        var element2 = dom.childAt(element1, [3]);
        var element3 = dom.childAt(element0, [3, 1]);
        if (this.cachedFragment) { dom.repairClonedNode(element3,[1]); }
        var morph0 = dom.createMorphAt(dom.childAt(element1, [1]),-1,-1);
        var morph1 = dom.createMorphAt(dom.childAt(element2, [1]),-1,0);
        var morph2 = dom.createMorphAt(dom.childAt(element2, [3]),-1,0);
        var morph3 = dom.createMorphAt(dom.childAt(element2, [5]),-1,0);
        var morph4 = dom.createMorphAt(element3,0,1);
        var morph5 = dom.createMorphAt(element3,1,2);
        var morph6 = dom.createMorphAt(element0,4,5);
        content(env, morph0, context, "name");
        content(env, morph1, context, "accountSeated");
        content(env, morph2, context, "accountWaitingList");
        content(env, morph3, context, "accountSignups");
        block(env, morph4, context, "if", [get(env, context, "currentAccountSeated")], {}, child0, child1);
        block(env, morph5, context, "if", [get(env, context, "hiddenAndNotFinalized")], {}, child2, null);
        content(env, morph6, context, "liquid-outlet");
        return fragment;
      }
    };
  }()));

});
define('coretheloothound/templates/raid/edit', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      var child0 = (function() {
        return {
          isHTMLBars: true,
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("        ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("p");
            var el2 = dom.createElement("i");
            dom.setAttribute(el2,"class","fa fa-lock fa-fw");
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
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            var hooks = env.hooks, element = hooks.element;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            var element2 = dom.childAt(fragment, [1, 2]);
            element(env, element2, context, "action", ["unfinalize"], {});
            return fragment;
          }
        };
      }());
      var child1 = (function() {
        return {
          isHTMLBars: true,
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("        ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("p");
            var el2 = dom.createElement("i");
            dom.setAttribute(el2,"class","fa fa-unlock fa-fw");
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
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            var hooks = env.hooks, element = hooks.element;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            var element1 = dom.childAt(fragment, [1, 2]);
            element(env, element1, context, "action", ["finalize"], {});
            return fragment;
          }
        };
      }());
      return {
        isHTMLBars: true,
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("      ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("p");
          var el2 = dom.createElement("i");
          dom.setAttribute(el2,"class","fa fa-eye-slash fa-fw");
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
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, get = hooks.get, block = hooks.block, element = hooks.element;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          if (this.cachedFragment) { dom.repairClonedNode(fragment,[0]); }
          var element3 = dom.childAt(fragment, [2, 2]);
          var morph0 = dom.createMorphAt(fragment,0,1,contextualElement);
          block(env, morph0, context, "if", [get(env, context, "finalized")], {}, child0, child1);
          element(env, element3, context, "action", ["unhide"], {});
          return fragment;
        }
      };
    }());
    var child1 = (function() {
      return {
        isHTMLBars: true,
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("      ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("p");
          var el2 = dom.createElement("i");
          dom.setAttribute(el2,"class","fa fa-eye fa-fw");
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
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, element = hooks.element;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var element0 = dom.childAt(fragment, [1, 2]);
          element(env, element0, context, "action", ["hide"], {});
          return fragment;
        }
      };
    }());
    var child2 = (function() {
      return {
        isHTMLBars: true,
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createTextNode("Back");
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    var child3 = (function() {
      return {
        isHTMLBars: true,
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createElement("p");
          var el1 = dom.createElement("i");
          dom.setAttribute(el1,"class","fa fa-file-text-o fa-fw");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode(" ");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, content = hooks.content;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var morph0 = dom.createMorphAt(fragment,1,-1);
          content(env, morph0, context, "note");
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","raid-wrapper");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("section");
        dom.setAttribute(el2,"class","info");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("p");
        var el4 = dom.createElement("i");
        dom.setAttribute(el4,"class","fa fa-calendar fa-fw");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode(" ");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode(" ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("small");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("p");
        var el4 = dom.createElement("i");
        dom.setAttribute(el4,"class","fa fa-users fa-fw");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode(" ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("a");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("p");
        var el4 = dom.createElement("i");
        dom.setAttribute(el4,"class","fa fa-trash-o fa-fw");
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
        dom.setAttribute(el4,"class","fa fa-arrow-left fa-fw");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode(" ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("section");
        dom.setAttribute(el2,"class","signups");
        var el3 = dom.createTextNode("\n    ");
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
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, content = hooks.content, get = hooks.get, element = hooks.element, block = hooks.block, inline = hooks.inline;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var element4 = dom.childAt(fragment, [0]);
        var element5 = dom.childAt(element4, [1]);
        var element6 = dom.childAt(element5, [1]);
        var element7 = dom.childAt(element5, [3, 2]);
        var element8 = dom.childAt(element5, [6, 2]);
        var morph0 = dom.createMorphAt(element6,1,2);
        var morph1 = dom.createMorphAt(dom.childAt(element6, [3]),-1,-1);
        var morph2 = dom.createMorphAt(element7,-1,-1);
        var morph3 = dom.createMorphAt(element5,4,5);
        var morph4 = dom.createMorphAt(dom.childAt(element5, [8]),1,-1);
        var morph5 = dom.createMorphAt(element5,9,10);
        var morph6 = dom.createMorphAt(dom.childAt(element4, [3]),0,1);
        content(env, morph0, context, "dateCalendar");
        content(env, morph1, context, "dateAgo");
        element(env, element7, context, "bind-attr", [], {"href": get(env, context, "guild.url")});
        content(env, morph2, context, "guild.name");
        block(env, morph3, context, "if", [get(env, context, "hidden")], {}, child0, child1);
        element(env, element8, context, "action", ["delete"], {});
        block(env, morph4, context, "link-to", ["raid.index", get(env, context, "this")], {}, child2, null);
        block(env, morph5, context, "if", [get(env, context, "note")], {}, child3, null);
        inline(env, morph6, context, "raid-permissions", [], {"raid": get(env, context, "this"), "account": get(env, context, "account"), "newPermission": "newPermission", "deletePermission": "deletePermission"});
        return fragment;
      }
    };
  }()));

});
define('coretheloothound/templates/raid/index', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      var child0 = (function() {
        var child0 = (function() {
          return {
            isHTMLBars: true,
            blockParams: 0,
            cachedFragment: null,
            hasRendered: false,
            build: function build(dom) {
              var el0 = dom.createDocumentFragment();
              var el1 = dom.createTextNode("          ");
              dom.appendChild(el0, el1);
              var el1 = dom.createElement("p");
              var el2 = dom.createElement("i");
              dom.setAttribute(el2,"class","fa fa-lock fa-fw");
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
            render: function render(context, env, contextualElement) {
              var dom = env.dom;
              var hooks = env.hooks, element = hooks.element;
              dom.detectNamespace(contextualElement);
              var fragment;
              if (env.useFragmentCache && dom.canClone) {
                if (this.cachedFragment === null) {
                  fragment = this.build(dom);
                  if (this.hasRendered) {
                    this.cachedFragment = fragment;
                  } else {
                    this.hasRendered = true;
                  }
                }
                if (this.cachedFragment) {
                  fragment = dom.cloneNode(this.cachedFragment, true);
                }
              } else {
                fragment = this.build(dom);
              }
              var element5 = dom.childAt(fragment, [1, 2]);
              element(env, element5, context, "action", ["unfinalize"], {});
              return fragment;
            }
          };
        }());
        var child1 = (function() {
          return {
            isHTMLBars: true,
            blockParams: 0,
            cachedFragment: null,
            hasRendered: false,
            build: function build(dom) {
              var el0 = dom.createDocumentFragment();
              var el1 = dom.createTextNode("          ");
              dom.appendChild(el0, el1);
              var el1 = dom.createElement("p");
              var el2 = dom.createElement("i");
              dom.setAttribute(el2,"class","fa fa-unlock fa-fw");
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
            render: function render(context, env, contextualElement) {
              var dom = env.dom;
              var hooks = env.hooks, element = hooks.element;
              dom.detectNamespace(contextualElement);
              var fragment;
              if (env.useFragmentCache && dom.canClone) {
                if (this.cachedFragment === null) {
                  fragment = this.build(dom);
                  if (this.hasRendered) {
                    this.cachedFragment = fragment;
                  } else {
                    this.hasRendered = true;
                  }
                }
                if (this.cachedFragment) {
                  fragment = dom.cloneNode(this.cachedFragment, true);
                }
              } else {
                fragment = this.build(dom);
              }
              var element4 = dom.childAt(fragment, [1, 2]);
              element(env, element4, context, "action", ["finalize"], {});
              return fragment;
            }
          };
        }());
        return {
          isHTMLBars: true,
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("        ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("p");
            var el2 = dom.createElement("i");
            dom.setAttribute(el2,"class","fa fa-eye-slash fa-fw");
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
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            var hooks = env.hooks, get = hooks.get, block = hooks.block, element = hooks.element;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            if (this.cachedFragment) { dom.repairClonedNode(fragment,[0]); }
            var element6 = dom.childAt(fragment, [2, 2]);
            var morph0 = dom.createMorphAt(fragment,0,1,contextualElement);
            block(env, morph0, context, "if", [get(env, context, "finalized")], {}, child0, child1);
            element(env, element6, context, "action", ["unhide"], {});
            return fragment;
          }
        };
      }());
      var child1 = (function() {
        return {
          isHTMLBars: true,
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("        ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("p");
            var el2 = dom.createElement("i");
            dom.setAttribute(el2,"class","fa fa-eye fa-fw");
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
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            var hooks = env.hooks, element = hooks.element;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            var element3 = dom.childAt(fragment, [1, 2]);
            element(env, element3, context, "action", ["hide"], {});
            return fragment;
          }
        };
      }());
      var child2 = (function() {
        return {
          isHTMLBars: true,
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createTextNode("Edit");
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            return fragment;
          }
        };
      }());
      return {
        isHTMLBars: true,
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("      ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("p");
          var el2 = dom.createElement("i");
          dom.setAttribute(el2,"class","fa fa-legal fa-fw");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode(" You're an admin");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n      ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("p");
          var el2 = dom.createElement("i");
          dom.setAttribute(el2,"class","fa fa-pencil fa-fw");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode(" ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, get = hooks.get, block = hooks.block;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          if (this.cachedFragment) { dom.repairClonedNode(fragment,[0]); }
          var morph0 = dom.createMorphAt(fragment,0,1,contextualElement);
          var morph1 = dom.createMorphAt(dom.childAt(fragment, [4]),1,-1);
          block(env, morph0, context, "if", [get(env, context, "hidden")], {}, child0, child1);
          block(env, morph1, context, "link-to", ["raid.edit", get(env, context, "this")], {}, child2, null);
          return fragment;
        }
      };
    }());
    var child1 = (function() {
      var child0 = (function() {
        return {
          isHTMLBars: true,
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("        ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("p");
            var el2 = dom.createElement("i");
            dom.setAttribute(el2,"class","fa fa-lock fa-fw");
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode(" Finalized");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            return fragment;
          }
        };
      }());
      var child1 = (function() {
        return {
          isHTMLBars: true,
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("        ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("p");
            var el2 = dom.createElement("i");
            dom.setAttribute(el2,"class","fa fa-unlock fa-fw");
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode(" Not Finalized");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            return fragment;
          }
        };
      }());
      return {
        isHTMLBars: true,
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, get = hooks.get, block = hooks.block;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          if (this.cachedFragment) { dom.repairClonedNode(fragment,[0,1]); }
          var morph0 = dom.createMorphAt(fragment,0,1,contextualElement);
          block(env, morph0, context, "if", [get(env, context, "finalized")], {}, child0, child1);
          return fragment;
        }
      };
    }());
    var child2 = (function() {
      return {
        isHTMLBars: true,
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createElement("p");
          var el1 = dom.createElement("i");
          dom.setAttribute(el1,"class","fa fa-file-text-o fa-fw");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode(" ");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, content = hooks.content;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var morph0 = dom.createMorphAt(fragment,1,-1);
          content(env, morph0, context, "note");
          return fragment;
        }
      };
    }());
    var child3 = (function() {
      var child0 = (function() {
        return {
          isHTMLBars: true,
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("          ");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            var hooks = env.hooks, get = hooks.get, inline = hooks.inline;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            var morph0 = dom.createMorphAt(fragment,0,1,contextualElement);
            inline(env, morph0, context, "raid-signup", [], {"signup": get(env, context, "signup"), "currentAccount": get(env, context, "currentAccount"), "seat": "seat", "unseat": "unseat", "unsignup": "unsignup"});
            return fragment;
          }
        };
      }());
      return {
        isHTMLBars: true,
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("          ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("h4");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, content = hooks.content, get = hooks.get, block = hooks.block;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          if (this.cachedFragment) { dom.repairClonedNode(fragment,[3]); }
          var morph0 = dom.createMorphAt(dom.childAt(fragment, [1]),-1,-1);
          var morph1 = dom.createMorphAt(fragment,2,3,contextualElement);
          content(env, morph0, context, "waitingListAccount.account.battletag");
          block(env, morph1, context, "each", [get(env, context, "waitingListAccount.signups")], {"itemController": "signup", "keyword": "signup"}, child0, null);
          return fragment;
        }
      };
    }());
    var child4 = (function() {
      var child0 = (function() {
        return {
          isHTMLBars: true,
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("          ");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            var hooks = env.hooks, get = hooks.get, inline = hooks.inline;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            var morph0 = dom.createMorphAt(fragment,0,1,contextualElement);
            inline(env, morph0, context, "raid-signup", [], {"signup": get(env, context, "signup"), "currentAccount": get(env, context, "currentAccount"), "seat": "seat", "unseat": "unseat", "unsignup": "unsignup"});
            return fragment;
          }
        };
      }());
      return {
        isHTMLBars: true,
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("        ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","signup-wrapper");
          var el2 = dom.createTextNode("\n          ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("h3");
          var el3 = dom.createElement("i");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode(" ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("small");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("        ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, element = hooks.element, content = hooks.content, get = hooks.get, block = hooks.block;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var element0 = dom.childAt(fragment, [1]);
          var element1 = dom.childAt(element0, [1]);
          var element2 = dom.childAt(element1, [0]);
          var morph0 = dom.createMorphAt(dom.childAt(element1, [2]),-1,-1);
          var morph1 = dom.createMorphAt(element0,2,3);
          element(env, element2, context, "bind-attr", [], {"class": "seatedRole.role.iconClasses"});
          content(env, morph0, context, "seatedRole.role.name");
          block(env, morph1, context, "each", [get(env, context, "seatedRole.signups")], {"itemController": "signup", "keyword": "signup"}, child0, null);
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","raid-wrapper");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("section");
        dom.setAttribute(el2,"class","info");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("p");
        var el4 = dom.createElement("i");
        dom.setAttribute(el4,"class","fa fa-calendar fa-fw");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode(" ");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode(" ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("small");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("p");
        var el4 = dom.createElement("i");
        dom.setAttribute(el4,"class","fa fa-users fa-fw");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode(" ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("a");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("section");
        dom.setAttribute(el2,"class","signups");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","wrapper");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","signup-wrapper waiting-list");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("h3");
        var el6 = dom.createElement("i");
        dom.setAttribute(el6,"class","fa fa-clock-o fa-fw");
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
        var el5 = dom.createTextNode("      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n");
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
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, content = hooks.content, get = hooks.get, element = hooks.element, block = hooks.block, inline = hooks.inline;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var element7 = dom.childAt(fragment, [0]);
        var element8 = dom.childAt(element7, [1]);
        var element9 = dom.childAt(element8, [1]);
        var element10 = dom.childAt(element8, [3, 2]);
        var element11 = dom.childAt(element7, [3, 1]);
        var morph0 = dom.createMorphAt(element9,1,2);
        var morph1 = dom.createMorphAt(dom.childAt(element9, [3]),-1,-1);
        var morph2 = dom.createMorphAt(element10,-1,-1);
        var morph3 = dom.createMorphAt(element8,4,5);
        var morph4 = dom.createMorphAt(element8,5,6);
        var morph5 = dom.createMorphAt(element8,6,7);
        var morph6 = dom.createMorphAt(dom.childAt(element11, [1]),2,3);
        var morph7 = dom.createMorphAt(element11,2,3);
        content(env, morph0, context, "dateCalendar");
        content(env, morph1, context, "dateAgo");
        element(env, element10, context, "bind-attr", [], {"href": get(env, context, "guild.url")});
        content(env, morph2, context, "guild.name");
        block(env, morph3, context, "if", [get(env, context, "admin")], {}, child0, child1);
        block(env, morph4, context, "if", [get(env, context, "note")], {}, child2, null);
        inline(env, morph5, context, "character-select", [], {"characters": get(env, context, "characters"), "action": "signup"});
        block(env, morph6, context, "each", [get(env, context, "waitingListByAccount")], {"keyword": "waitingListAccount"}, child3, null);
        block(env, morph7, context, "each", [get(env, context, "seatedByRole")], {"keyword": "seatedRole"}, child4, null);
        return fragment;
      }
    };
  }()));

});
define('coretheloothound/templates/raids', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","raids");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("h2");
        var el3 = dom.createTextNode("Raids");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, content = hooks.content;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var morph0 = dom.createMorphAt(dom.childAt(fragment, [0]),2,3);
        content(env, morph0, context, "liquid-outlet");
        return fragment;
      }
    };
  }()));

});
define('coretheloothound/templates/raids/index', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        isHTMLBars: true,
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createElement("i");
          dom.setAttribute(el1,"class","fa fa-plus");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode(" New Raid");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    var child1 = (function() {
      var child0 = (function() {
        var child0 = (function() {
          return {
            isHTMLBars: true,
            blockParams: 0,
            cachedFragment: null,
            hasRendered: false,
            build: function build(dom) {
              var el0 = dom.createDocumentFragment();
              var el1 = dom.createTextNode("              ");
              dom.appendChild(el0, el1);
              var el1 = dom.createElement("div");
              dom.setAttribute(el1,"class","emblem");
              var el2 = dom.createTextNode("\n                ");
              dom.appendChild(el1, el2);
              var el2 = dom.createElement("div");
              dom.setAttribute(el2,"class","background");
              var el3 = dom.createTextNode("\n                  ");
              dom.appendChild(el2, el3);
              var el3 = dom.createElement("div");
              dom.setAttribute(el3,"class","icon");
              var el4 = dom.createTextNode("\n                  ");
              dom.appendChild(el3, el4);
              dom.appendChild(el2, el3);
              var el3 = dom.createTextNode("\n                ");
              dom.appendChild(el2, el3);
              dom.appendChild(el1, el2);
              var el2 = dom.createTextNode("\n              ");
              dom.appendChild(el1, el2);
              dom.appendChild(el0, el1);
              var el1 = dom.createTextNode("\n");
              dom.appendChild(el0, el1);
              return el0;
            },
            render: function render(context, env, contextualElement) {
              var dom = env.dom;
              var hooks = env.hooks, element = hooks.element;
              dom.detectNamespace(contextualElement);
              var fragment;
              if (env.useFragmentCache && dom.canClone) {
                if (this.cachedFragment === null) {
                  fragment = this.build(dom);
                  if (this.hasRendered) {
                    this.cachedFragment = fragment;
                  } else {
                    this.hasRendered = true;
                  }
                }
                if (this.cachedFragment) {
                  fragment = dom.cloneNode(this.cachedFragment, true);
                }
              } else {
                fragment = this.build(dom);
              }
              var element0 = dom.childAt(fragment, [1, 1]);
              var element1 = dom.childAt(element0, [1]);
              element(env, element0, context, "bind-attr", [], {"style": "raid.guild.backgroundStyle"});
              element(env, element1, context, "bind-attr", [], {"style": "raid.guild.iconStyle"});
              return fragment;
            }
          };
        }());
        return {
          isHTMLBars: true,
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("            ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("br");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("small");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            var hooks = env.hooks, get = hooks.get, block = hooks.block, content = hooks.content;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            if (this.cachedFragment) { dom.repairClonedNode(fragment,[0]); }
            var morph0 = dom.createMorphAt(fragment,0,1,contextualElement);
            var morph1 = dom.createMorphAt(fragment,1,2,contextualElement);
            var morph2 = dom.createMorphAt(dom.childAt(fragment, [3]),-1,-1);
            block(env, morph0, context, "if", [get(env, context, "raid.guild.icon")], {}, child0, null);
            content(env, morph1, context, "raid.guild.name");
            content(env, morph2, context, "raid.guild.realm");
            return fragment;
          }
        };
      }());
      var child1 = (function() {
        return {
          isHTMLBars: true,
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("            ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("i");
            dom.setAttribute(el1,"title","You're an admin");
            dom.setAttribute(el1,"class","fa fa-legal fa-fw");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode(" \n");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            return fragment;
          }
        };
      }());
      var child2 = (function() {
        var child0 = (function() {
          return {
            isHTMLBars: true,
            blockParams: 0,
            cachedFragment: null,
            hasRendered: false,
            build: function build(dom) {
              var el0 = dom.createDocumentFragment();
              var el1 = dom.createTextNode("");
              dom.appendChild(el0, el1);
              var el1 = dom.createTextNode("");
              dom.appendChild(el0, el1);
              return el0;
            },
            render: function render(context, env, contextualElement) {
              var dom = env.dom;
              var hooks = env.hooks, content = hooks.content;
              dom.detectNamespace(contextualElement);
              var fragment;
              if (env.useFragmentCache && dom.canClone) {
                if (this.cachedFragment === null) {
                  fragment = this.build(dom);
                  if (this.hasRendered) {
                    this.cachedFragment = fragment;
                  } else {
                    this.hasRendered = true;
                  }
                }
                if (this.cachedFragment) {
                  fragment = dom.cloneNode(this.cachedFragment, true);
                }
              } else {
                fragment = this.build(dom);
              }
              if (this.cachedFragment) { dom.repairClonedNode(fragment,[0,1]); }
              var morph0 = dom.createMorphAt(fragment,0,1,contextualElement);
              content(env, morph0, context, "raid.name");
              return fragment;
            }
          };
        }());
        return {
          isHTMLBars: true,
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("            ");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            var hooks = env.hooks, get = hooks.get, block = hooks.block;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            var morph0 = dom.createMorphAt(fragment,0,1,contextualElement);
            block(env, morph0, context, "link-to", ["raid", get(env, context, "raid.id")], {"data-content": get(env, context, "raid.note"), "data-toggle": "popover"}, child0, null);
            return fragment;
          }
        };
      }());
      var child3 = (function() {
        var child0 = (function() {
          return {
            isHTMLBars: true,
            blockParams: 0,
            cachedFragment: null,
            hasRendered: false,
            build: function build(dom) {
              var el0 = dom.createDocumentFragment();
              var el1 = dom.createTextNode("");
              dom.appendChild(el0, el1);
              var el1 = dom.createTextNode("");
              dom.appendChild(el0, el1);
              return el0;
            },
            render: function render(context, env, contextualElement) {
              var dom = env.dom;
              var hooks = env.hooks, content = hooks.content;
              dom.detectNamespace(contextualElement);
              var fragment;
              if (env.useFragmentCache && dom.canClone) {
                if (this.cachedFragment === null) {
                  fragment = this.build(dom);
                  if (this.hasRendered) {
                    this.cachedFragment = fragment;
                  } else {
                    this.hasRendered = true;
                  }
                }
                if (this.cachedFragment) {
                  fragment = dom.cloneNode(this.cachedFragment, true);
                }
              } else {
                fragment = this.build(dom);
              }
              if (this.cachedFragment) { dom.repairClonedNode(fragment,[0,1]); }
              var morph0 = dom.createMorphAt(fragment,0,1,contextualElement);
              content(env, morph0, context, "raid.name");
              return fragment;
            }
          };
        }());
        return {
          isHTMLBars: true,
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("            ");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            var hooks = env.hooks, get = hooks.get, block = hooks.block;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            var morph0 = dom.createMorphAt(fragment,0,1,contextualElement);
            block(env, morph0, context, "link-to", ["raid", get(env, context, "raid.id")], {}, child0, null);
            return fragment;
          }
        };
      }());
      var child4 = (function() {
        return {
          isHTMLBars: true,
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("            ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("strong");
            dom.setAttribute(el1,"class","text-success");
            var el2 = dom.createTextNode("Seated on ");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            var hooks = env.hooks, content = hooks.content;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            var morph0 = dom.createMorphAt(dom.childAt(fragment, [1]),0,-1);
            content(env, morph0, context, "raid.currentAccountSeated.character.name");
            return fragment;
          }
        };
      }());
      var child5 = (function() {
        var child0 = (function() {
          return {
            isHTMLBars: true,
            blockParams: 0,
            cachedFragment: null,
            hasRendered: false,
            build: function build(dom) {
              var el0 = dom.createDocumentFragment();
              var el1 = dom.createTextNode("              ");
              dom.appendChild(el0, el1);
              var el1 = dom.createElement("strong");
              dom.setAttribute(el1,"class","text-info");
              var el2 = dom.createTextNode("Signed Up");
              dom.appendChild(el1, el2);
              dom.appendChild(el0, el1);
              var el1 = dom.createTextNode("\n");
              dom.appendChild(el0, el1);
              return el0;
            },
            render: function render(context, env, contextualElement) {
              var dom = env.dom;
              dom.detectNamespace(contextualElement);
              var fragment;
              if (env.useFragmentCache && dom.canClone) {
                if (this.cachedFragment === null) {
                  fragment = this.build(dom);
                  if (this.hasRendered) {
                    this.cachedFragment = fragment;
                  } else {
                    this.hasRendered = true;
                  }
                }
                if (this.cachedFragment) {
                  fragment = dom.cloneNode(this.cachedFragment, true);
                }
              } else {
                fragment = this.build(dom);
              }
              return fragment;
            }
          };
        }());
        var child1 = (function() {
          return {
            isHTMLBars: true,
            blockParams: 0,
            cachedFragment: null,
            hasRendered: false,
            build: function build(dom) {
              var el0 = dom.createDocumentFragment();
              var el1 = dom.createTextNode("              ");
              dom.appendChild(el0, el1);
              var el1 = dom.createElement("strong");
              dom.setAttribute(el1,"class","text-danger");
              var el2 = dom.createTextNode("Not Signed Up!");
              dom.appendChild(el1, el2);
              dom.appendChild(el0, el1);
              var el1 = dom.createTextNode("\n");
              dom.appendChild(el0, el1);
              return el0;
            },
            render: function render(context, env, contextualElement) {
              var dom = env.dom;
              dom.detectNamespace(contextualElement);
              var fragment;
              if (env.useFragmentCache && dom.canClone) {
                if (this.cachedFragment === null) {
                  fragment = this.build(dom);
                  if (this.hasRendered) {
                    this.cachedFragment = fragment;
                  } else {
                    this.hasRendered = true;
                  }
                }
                if (this.cachedFragment) {
                  fragment = dom.cloneNode(this.cachedFragment, true);
                }
              } else {
                fragment = this.build(dom);
              }
              return fragment;
            }
          };
        }());
        return {
          isHTMLBars: true,
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("          ");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            var hooks = env.hooks, get = hooks.get, block = hooks.block;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            if (this.cachedFragment) { dom.repairClonedNode(fragment,[0]); }
            var morph0 = dom.createMorphAt(fragment,0,1,contextualElement);
            block(env, morph0, context, "if", [get(env, context, "raid.currentAccountSignedUp")], {}, child0, child1);
            return fragment;
          }
        };
      }());
      var child6 = (function() {
        var child0 = (function() {
          return {
            isHTMLBars: true,
            blockParams: 0,
            cachedFragment: null,
            hasRendered: false,
            build: function build(dom) {
              var el0 = dom.createDocumentFragment();
              var el1 = dom.createTextNode("                ");
              dom.appendChild(el0, el1);
              var el1 = dom.createElement("i");
              dom.setAttribute(el1,"class","fa fa-lock fa-fw");
              dom.appendChild(el0, el1);
              var el1 = dom.createTextNode(" Finalized\n");
              dom.appendChild(el0, el1);
              return el0;
            },
            render: function render(context, env, contextualElement) {
              var dom = env.dom;
              dom.detectNamespace(contextualElement);
              var fragment;
              if (env.useFragmentCache && dom.canClone) {
                if (this.cachedFragment === null) {
                  fragment = this.build(dom);
                  if (this.hasRendered) {
                    this.cachedFragment = fragment;
                  } else {
                    this.hasRendered = true;
                  }
                }
                if (this.cachedFragment) {
                  fragment = dom.cloneNode(this.cachedFragment, true);
                }
              } else {
                fragment = this.build(dom);
              }
              return fragment;
            }
          };
        }());
        var child1 = (function() {
          return {
            isHTMLBars: true,
            blockParams: 0,
            cachedFragment: null,
            hasRendered: false,
            build: function build(dom) {
              var el0 = dom.createDocumentFragment();
              var el1 = dom.createTextNode("                ");
              dom.appendChild(el0, el1);
              var el1 = dom.createElement("i");
              dom.setAttribute(el1,"class","fa fa-unlock fa-fw");
              dom.appendChild(el0, el1);
              var el1 = dom.createTextNode(" Not Finalized\n");
              dom.appendChild(el0, el1);
              return el0;
            },
            render: function render(context, env, contextualElement) {
              var dom = env.dom;
              dom.detectNamespace(contextualElement);
              var fragment;
              if (env.useFragmentCache && dom.canClone) {
                if (this.cachedFragment === null) {
                  fragment = this.build(dom);
                  if (this.hasRendered) {
                    this.cachedFragment = fragment;
                  } else {
                    this.hasRendered = true;
                  }
                }
                if (this.cachedFragment) {
                  fragment = dom.cloneNode(this.cachedFragment, true);
                }
              } else {
                fragment = this.build(dom);
              }
              return fragment;
            }
          };
        }());
        return {
          isHTMLBars: true,
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            var hooks = env.hooks, get = hooks.get, block = hooks.block;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            if (this.cachedFragment) { dom.repairClonedNode(fragment,[0,1]); }
            var morph0 = dom.createMorphAt(fragment,0,1,contextualElement);
            block(env, morph0, context, "if", [get(env, context, "raid.finalized")], {}, child0, child1);
            return fragment;
          }
        };
      }());
      return {
        isHTMLBars: true,
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("      ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("tr");
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("td");
          var el3 = dom.createTextNode("\n");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("        ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("td");
          var el3 = dom.createTextNode("\n");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("        ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("td");
          var el3 = dom.createElement("i");
          dom.setAttribute(el3,"class","fa fa-calendar");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode(" ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("br");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("small");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("td");
          var el3 = dom.createTextNode("\n");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("br");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n          ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("small");
          var el4 = dom.createTextNode("\n");
          dom.appendChild(el3, el4);
          var el4 = dom.createTextNode("          ");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n        ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("td");
          var el3 = dom.createTextNode("\n          ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("span");
          dom.setAttribute(el3,"title","Accounts signed up");
          var el4 = dom.createTextNode(" ");
          dom.appendChild(el3, el4);
          var el4 = dom.createElement("i");
          dom.setAttribute(el4,"class","fa fa-users fa-fw");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("   \n          ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("span");
          dom.setAttribute(el3,"title","Accounts on the waiting list");
          var el4 = dom.createTextNode(" ");
          dom.appendChild(el3, el4);
          var el4 = dom.createElement("i");
          dom.setAttribute(el4,"class","fa fa-bars fa-fw");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("   \n          ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("span");
          dom.setAttribute(el3,"title","Seated accounts");
          var el4 = dom.createTextNode(" ");
          dom.appendChild(el3, el4);
          var el4 = dom.createElement("i");
          dom.setAttribute(el4,"class","fa fa-check fa-fw");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("   \n        ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n      ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, get = hooks.get, block = hooks.block, content = hooks.content;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var element2 = dom.childAt(fragment, [1]);
          var element3 = dom.childAt(element2, [3]);
          if (this.cachedFragment) { dom.repairClonedNode(element3,[1]); }
          var element4 = dom.childAt(element2, [5]);
          var element5 = dom.childAt(element2, [7]);
          var element6 = dom.childAt(element2, [9]);
          var morph0 = dom.createMorphAt(dom.childAt(element2, [1]),0,1);
          var morph1 = dom.createMorphAt(element3,0,1);
          var morph2 = dom.createMorphAt(element3,1,2);
          var morph3 = dom.createMorphAt(element4,1,2);
          var morph4 = dom.createMorphAt(dom.childAt(element4, [3]),-1,-1);
          var morph5 = dom.createMorphAt(element5,0,1);
          var morph6 = dom.createMorphAt(dom.childAt(element5, [3]),0,1);
          var morph7 = dom.createMorphAt(dom.childAt(element6, [1]),-1,0);
          var morph8 = dom.createMorphAt(dom.childAt(element6, [3]),-1,0);
          var morph9 = dom.createMorphAt(dom.childAt(element6, [5]),-1,0);
          block(env, morph0, context, "if", [get(env, context, "raid.guild")], {}, child0, null);
          block(env, morph1, context, "if", [get(env, context, "raid.admin")], {}, child1, null);
          block(env, morph2, context, "if", [get(env, context, "raid.note")], {}, child2, child3);
          content(env, morph3, context, "raid.dateCalendar");
          content(env, morph4, context, "raid.dateAgo");
          block(env, morph5, context, "if", [get(env, context, "raid.currentAccountSeated")], {}, child4, child5);
          block(env, morph6, context, "if", [get(env, context, "raid.hidden")], {}, child6, null);
          content(env, morph7, context, "raid.accountSignups");
          content(env, morph8, context, "raid.accountWaitingList");
          content(env, morph9, context, "raid.accountSeated");
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createTextNode("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("table");
        dom.setAttribute(el1,"class","table");
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
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, block = hooks.block, get = hooks.get;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        if (this.cachedFragment) { dom.repairClonedNode(fragment,[0]); }
        var morph0 = dom.createMorphAt(fragment,0,1,contextualElement);
        var morph1 = dom.createMorphAt(dom.childAt(fragment, [2, 3]),0,1);
        block(env, morph0, context, "link-to", ["raids.new"], {"class": "btn btn-primary"}, child0, null);
        block(env, morph1, context, "each", [get(env, context, "controller")], {"keyword": "raid"}, child1, null);
        return fragment;
      }
    };
  }()));

});
define('coretheloothound/templates/raids/new', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("form");
        dom.setAttribute(el1,"class","form");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","form-group");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("label");
        dom.setAttribute(el3,"for","raid-name");
        var el4 = dom.createTextNode("Name");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","row");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","col-md-6");
        var el5 = dom.createTextNode("\n        ");
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
        dom.setAttribute(el2,"class","form-group");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("label");
        dom.setAttribute(el3,"for","raid-name");
        var el4 = dom.createTextNode("Guild");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","row");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","col-md-6");
        var el5 = dom.createTextNode("\n        ");
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
        dom.setAttribute(el2,"class","form-group");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","row");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","col-md-6");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5,"class","checkbox");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("label");
        var el7 = dom.createTextNode("\n            ");
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
        dom.setAttribute(el2,"class","form-group");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("label");
        dom.setAttribute(el3,"for","raid-name");
        var el4 = dom.createTextNode("Date");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("button");
        dom.setAttribute(el2,"class","btn btn-primary");
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
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, inline = hooks.inline, element = hooks.element;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var element0 = dom.childAt(fragment, [0]);
        var element1 = dom.childAt(element0, [9]);
        var morph0 = dom.createMorphAt(dom.childAt(element0, [1, 3, 1]),0,1);
        var morph1 = dom.createMorphAt(dom.childAt(element0, [3, 3, 1]),0,1);
        var morph2 = dom.createMorphAt(dom.childAt(element0, [5, 1, 1, 1, 1]),0,1);
        var morph3 = dom.createMorphAt(dom.childAt(element0, [7]),2,3);
        inline(env, morph0, context, "input", [], {"type": "text", "id": "raid-name", "value": get(env, context, "name"), "class": "form-control", "placeholder": "Name"});
        inline(env, morph1, context, "guild-select", [], {"account": get(env, context, "account"), "guild": get(env, context, "guild")});
        inline(env, morph2, context, "input", [], {"type": "checkbox", "id": "raid-hidden", "checked": get(env, context, "hidden"), "class": "form-control"});
        inline(env, morph3, context, "date-time", [], {"date": get(env, context, "date")});
        element(env, element1, context, "action", ["create"], {});
        return fragment;
      }
    };
  }()));

});
define('coretheloothound/templates/user', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        isHTMLBars: true,
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","character");
          var el2 = dom.createTextNode("\n      ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("h3");
          var el3 = dom.createTextNode(" ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("small");
          var el4 = dom.createTextNode(" ");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n      ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("img");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n      ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("p");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n      ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("p");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n      ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("p");
          var el3 = dom.createElement("span");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, content = hooks.content, element = hooks.element, get = hooks.get, inline = hooks.inline;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var element0 = dom.childAt(fragment, [1]);
          var element1 = dom.childAt(element0, [1]);
          var element2 = dom.childAt(element1, [1]);
          var element3 = dom.childAt(element0, [3]);
          var element4 = dom.childAt(element0, [9, 0]);
          var morph0 = dom.createMorphAt(element1,-1,0);
          var morph1 = dom.createMorphAt(element2,-1,0);
          var morph2 = dom.createMorphAt(element2,0,-1);
          var morph3 = dom.createMorphAt(dom.childAt(element0, [5]),-1,-1);
          var morph4 = dom.createMorphAt(dom.childAt(element0, [7]),-1,-1);
          var morph5 = dom.createMorphAt(element4,-1,-1);
          content(env, morph0, context, "character.name");
          content(env, morph1, context, "character.level");
          content(env, morph2, context, "character.realm");
          element(env, element3, context, "bind-attr", [], {"src": "character.image_url"});
          inline(env, morph3, context, "class", [get(env, context, "character.class")], {});
          content(env, morph4, context, "character.spec.name");
          element(env, element4, context, "bind-attr", [], {"class": "character.faction character.race"});
          inline(env, morph5, context, "race", [get(env, context, "character.race")], {});
          return fragment;
        }
      };
    }());
    var child1 = (function() {
      var child0 = (function() {
        return {
          isHTMLBars: true,
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createTextNode("Max Level ");
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            return fragment;
          }
        };
      }());
      return {
        isHTMLBars: true,
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","alert alert-info");
          var el2 = dom.createTextNode("No ");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("Characters");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, get = hooks.get, block = hooks.block;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var morph0 = dom.createMorphAt(dom.childAt(fragment, [1]),0,1);
          block(env, morph0, context, "if", [get(env, context, "onlyMax")], {}, child0, null);
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("h1");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("dl");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("dt");
        var el3 = dom.createTextNode("By Fire Be Purged API Key");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("dd");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","characters");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("h2");
        var el3 = dom.createTextNode("Characters");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","well form-inline");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","col-xs-2");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("label");
        dom.setAttribute(el4,"for","realms");
        var el5 = dom.createTextNode("Realm");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","checkbox col-xs-4");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("label");
        dom.setAttribute(el4,"class","checkbox-inline");
        var el5 = dom.createTextNode(" Only show level 90 characters");
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
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, content = hooks.content, get = hooks.get, inline = hooks.inline, block = hooks.block;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var element5 = dom.childAt(fragment, [4]);
        var element6 = dom.childAt(element5, [3]);
        var morph0 = dom.createMorphAt(dom.childAt(fragment, [0]),-1,-1);
        var morph1 = dom.createMorphAt(dom.childAt(fragment, [2, 3]),-1,-1);
        var morph2 = dom.createMorphAt(dom.childAt(element6, [1]),2,3);
        var morph3 = dom.createMorphAt(dom.childAt(element6, [3, 1]),-1,0);
        var morph4 = dom.createMorphAt(element5,4,-1);
        content(env, morph0, context, "user.battle_tag");
        content(env, morph1, context, "session.apikey");
        inline(env, morph2, context, "view", [get(env, context, "Ember.Select")], {"id": "realms", "content": get(env, context, "realms"), "value": get(env, context, "realm")});
        inline(env, morph3, context, "input", [], {"type": "checkbox", "checked": get(env, context, "onlyMax")});
        block(env, morph4, context, "each", [get(env, context, "characters")], {"keyword": "character"}, child0, child1);
        return fragment;
      }
    };
  }()));

});
define('coretheloothound/tests/adapters/application.jshint', function () {

  'use strict';

  module('JSHint - adapters');
  test('adapters/application.js should pass jshint', function() { 
    ok(true, 'adapters/application.js should pass jshint.'); 
  });

});
define('coretheloothound/tests/app.jshint', function () {

  'use strict';

  module('JSHint - .');
  test('app.js should pass jshint', function() { 
    ok(true, 'app.js should pass jshint.'); 
  });

});
define('coretheloothound/tests/components/character-select.jshint', function () {

  'use strict';

  module('JSHint - components');
  test('components/character-select.js should pass jshint', function() { 
    ok(true, 'components/character-select.js should pass jshint.'); 
  });

});
define('coretheloothound/tests/components/date-time.jshint', function () {

  'use strict';

  module('JSHint - components');
  test('components/date-time.js should pass jshint', function() { 
    ok(true, 'components/date-time.js should pass jshint.'); 
  });

});
define('coretheloothound/tests/components/donut-graph.jshint', function () {

  'use strict';

  module('JSHint - components');
  test('components/donut-graph.js should pass jshint', function() { 
    ok(true, 'components/donut-graph.js should pass jshint.'); 
  });

});
define('coretheloothound/tests/components/guild-select.jshint', function () {

  'use strict';

  module('JSHint - components');
  test('components/guild-select.js should pass jshint', function() { 
    ok(true, 'components/guild-select.js should pass jshint.'); 
  });

});
define('coretheloothound/tests/components/raid-group.jshint', function () {

  'use strict';

  module('JSHint - components');
  test('components/raid-group.js should pass jshint', function() { 
    ok(true, 'components/raid-group.js should pass jshint.'); 
  });

});
define('coretheloothound/tests/components/raid-permission.jshint', function () {

  'use strict';

  module('JSHint - components');
  test('components/raid-permission.js should pass jshint', function() { 
    ok(true, 'components/raid-permission.js should pass jshint.'); 
  });

});
define('coretheloothound/tests/components/raid-permissions.jshint', function () {

  'use strict';

  module('JSHint - components');
  test('components/raid-permissions.js should pass jshint', function() { 
    ok(true, 'components/raid-permissions.js should pass jshint.'); 
  });

});
define('coretheloothound/tests/components/raid-signup.jshint', function () {

  'use strict';

  module('JSHint - components');
  test('components/raid-signup.js should pass jshint', function() { 
    ok(true, 'components/raid-signup.js should pass jshint.'); 
  });

});
define('coretheloothound/tests/controllers/account.jshint', function () {

  'use strict';

  module('JSHint - controllers');
  test('controllers/account.js should pass jshint', function() { 
    ok(true, 'controllers/account.js should pass jshint.'); 
  });

});
define('coretheloothound/tests/controllers/application.jshint', function () {

  'use strict';

  module('JSHint - controllers');
  test('controllers/application.js should pass jshint', function() { 
    ok(true, 'controllers/application.js should pass jshint.'); 
  });

});
define('coretheloothound/tests/controllers/auth.jshint', function () {

  'use strict';

  module('JSHint - controllers');
  test('controllers/auth.js should pass jshint', function() { 
    ok(true, 'controllers/auth.js should pass jshint.'); 
  });

});
define('coretheloothound/tests/controllers/character.jshint', function () {

  'use strict';

  module('JSHint - controllers');
  test('controllers/character.js should pass jshint', function() { 
    ok(true, 'controllers/character.js should pass jshint.'); 
  });

});
define('coretheloothound/tests/controllers/characters/index.jshint', function () {

  'use strict';

  module('JSHint - controllers/characters');
  test('controllers/characters/index.js should pass jshint', function() { 
    ok(true, 'controllers/characters/index.js should pass jshint.'); 
  });

});
define('coretheloothound/tests/controllers/raid.jshint', function () {

  'use strict';

  module('JSHint - controllers');
  test('controllers/raid.js should pass jshint', function() { 
    ok(true, 'controllers/raid.js should pass jshint.'); 
  });

});
define('coretheloothound/tests/controllers/raid/index.jshint', function () {

  'use strict';

  module('JSHint - controllers/raid');
  test('controllers/raid/index.js should pass jshint', function() { 
    ok(true, 'controllers/raid/index.js should pass jshint.'); 
  });

});
define('coretheloothound/tests/controllers/raids/index.jshint', function () {

  'use strict';

  module('JSHint - controllers/raids');
  test('controllers/raids/index.js should pass jshint', function() { 
    ok(true, 'controllers/raids/index.js should pass jshint.'); 
  });

});
define('coretheloothound/tests/controllers/raids/new.jshint', function () {

  'use strict';

  module('JSHint - controllers/raids');
  test('controllers/raids/new.js should pass jshint', function() { 
    ok(true, 'controllers/raids/new.js should pass jshint.'); 
  });

});
define('coretheloothound/tests/controllers/role.jshint', function () {

  'use strict';

  module('JSHint - controllers');
  test('controllers/role.js should pass jshint', function() { 
    ok(true, 'controllers/role.js should pass jshint.'); 
  });

});
define('coretheloothound/tests/controllers/signup.jshint', function () {

  'use strict';

  module('JSHint - controllers');
  test('controllers/signup.js should pass jshint', function() { 
    ok(true, 'controllers/signup.js should pass jshint.'); 
  });

});
define('coretheloothound/tests/helpers/character-class.jshint', function () {

  'use strict';

  module('JSHint - helpers');
  test('helpers/character-class.js should pass jshint', function() { 
    ok(true, 'helpers/character-class.js should pass jshint.'); 
  });

});
define('coretheloothound/tests/helpers/character-faction.jshint', function () {

  'use strict';

  module('JSHint - helpers');
  test('helpers/character-faction.js should pass jshint', function() { 
    ok(true, 'helpers/character-faction.js should pass jshint.'); 
  });

});
define('coretheloothound/tests/helpers/character-race.jshint', function () {

  'use strict';

  module('JSHint - helpers');
  test('helpers/character-race.js should pass jshint', function() { 
    ok(true, 'helpers/character-race.js should pass jshint.'); 
  });

});
define('coretheloothound/tests/helpers/resolver', ['exports', 'ember/resolver', 'coretheloothound/config/environment'], function (exports, Resolver, config) {

  'use strict';

  var resolver = Resolver['default'].create();

  resolver.namespace = {
    modulePrefix: config['default'].modulePrefix,
    podModulePrefix: config['default'].podModulePrefix
  };

  exports['default'] = resolver;

});
define('coretheloothound/tests/helpers/resolver.jshint', function () {

  'use strict';

  module('JSHint - helpers');
  test('helpers/resolver.js should pass jshint', function() { 
    ok(true, 'helpers/resolver.js should pass jshint.'); 
  });

});
define('coretheloothound/tests/helpers/start-app', ['exports', 'ember', 'coretheloothound/app', 'coretheloothound/router', 'coretheloothound/config/environment'], function (exports, Ember, Application, Router, config) {

  'use strict';



  exports['default'] = startApp;
  function startApp(attrs) {
    var application;

    var attributes = Ember['default'].merge({}, config['default'].APP);
    attributes = Ember['default'].merge(attributes, attrs); // use defaults, but you can override;

    Ember['default'].run(function () {
      application = Application['default'].create(attributes);
      application.setupForTesting();
      application.injectTestHelpers();
    });

    return application;
  }

});
define('coretheloothound/tests/helpers/start-app.jshint', function () {

  'use strict';

  module('JSHint - helpers');
  test('helpers/start-app.js should pass jshint', function() { 
    ok(true, 'helpers/start-app.js should pass jshint.'); 
  });

});
define('coretheloothound/tests/initializers/link-view.jshint', function () {

  'use strict';

  module('JSHint - initializers');
  test('initializers/link-view.js should pass jshint', function() { 
    ok(true, 'initializers/link-view.js should pass jshint.'); 
  });

});
define('coretheloothound/tests/initializers/storage.jshint', function () {

  'use strict';

  module('JSHint - initializers');
  test('initializers/storage.js should pass jshint', function() { 
    ok(true, 'initializers/storage.js should pass jshint.'); 
  });

});
define('coretheloothound/tests/mixins/after-render.jshint', function () {

  'use strict';

  module('JSHint - mixins');
  test('mixins/after-render.js should pass jshint', function() { 
    ok(true, 'mixins/after-render.js should pass jshint.'); 
  });

});
define('coretheloothound/tests/models/account.jshint', function () {

  'use strict';

  module('JSHint - models');
  test('models/account.js should pass jshint', function() { 
    ok(true, 'models/account.js should pass jshint.'); 
  });

});
define('coretheloothound/tests/models/character.jshint', function () {

  'use strict';

  module('JSHint - models');
  test('models/character.js should pass jshint', function() { 
    ok(true, 'models/character.js should pass jshint.'); 
  });

});
define('coretheloothound/tests/models/guild.jshint', function () {

  'use strict';

  module('JSHint - models');
  test('models/guild.js should pass jshint', function() { 
    ok(true, 'models/guild.js should pass jshint.'); 
  });

});
define('coretheloothound/tests/models/permission.jshint', function () {

  'use strict';

  module('JSHint - models');
  test('models/permission.js should pass jshint', function() { 
    ok(true, 'models/permission.js should pass jshint.'); 
  });

});
define('coretheloothound/tests/models/permissioned.jshint', function () {

  'use strict';

  module('JSHint - models');
  test('models/permissioned.js should pass jshint', function() { 
    ok(true, 'models/permissioned.js should pass jshint.'); 
  });

});
define('coretheloothound/tests/models/raid.jshint', function () {

  'use strict';

  module('JSHint - models');
  test('models/raid.js should pass jshint', function() { 
    ok(true, 'models/raid.js should pass jshint.'); 
  });

});
define('coretheloothound/tests/models/role.jshint', function () {

  'use strict';

  module('JSHint - models');
  test('models/role.js should pass jshint', function() { 
    ok(true, 'models/role.js should pass jshint.'); 
  });

});
define('coretheloothound/tests/models/signup.jshint', function () {

  'use strict';

  module('JSHint - models');
  test('models/signup.js should pass jshint', function() { 
    ok(true, 'models/signup.js should pass jshint.'); 
  });

});
define('coretheloothound/tests/models/storage.jshint', function () {

  'use strict';

  module('JSHint - models');
  test('models/storage.js should pass jshint', function() { 
    ok(true, 'models/storage.js should pass jshint.'); 
  });

});
define('coretheloothound/tests/router.jshint', function () {

  'use strict';

  module('JSHint - .');
  test('router.js should pass jshint', function() { 
    ok(true, 'router.js should pass jshint.'); 
  });

});
define('coretheloothound/tests/routes/apikey.jshint', function () {

  'use strict';

  module('JSHint - routes');
  test('routes/apikey.js should pass jshint', function() { 
    ok(true, 'routes/apikey.js should pass jshint.'); 
  });

});
define('coretheloothound/tests/routes/application.jshint', function () {

  'use strict';

  module('JSHint - routes');
  test('routes/application.js should pass jshint', function() { 
    ok(true, 'routes/application.js should pass jshint.'); 
  });

});
define('coretheloothound/tests/routes/characters/index.jshint', function () {

  'use strict';

  module('JSHint - routes/characters');
  test('routes/characters/index.js should pass jshint', function() { 
    ok(true, 'routes/characters/index.js should pass jshint.'); 
  });

});
define('coretheloothound/tests/routes/raid.jshint', function () {

  'use strict';

  module('JSHint - routes');
  test('routes/raid.js should pass jshint', function() { 
    ok(true, 'routes/raid.js should pass jshint.'); 
  });

});
define('coretheloothound/tests/routes/raid/index.jshint', function () {

  'use strict';

  module('JSHint - routes/raid');
  test('routes/raid/index.js should pass jshint', function() { 
    ok(true, 'routes/raid/index.js should pass jshint.'); 
  });

});
define('coretheloothound/tests/routes/raids/index.jshint', function () {

  'use strict';

  module('JSHint - routes/raids');
  test('routes/raids/index.js should pass jshint', function() { 
    ok(true, 'routes/raids/index.js should pass jshint.'); 
  });

});
define('coretheloothound/tests/serializers/signup.jshint', function () {

  'use strict';

  module('JSHint - serializers');
  test('serializers/signup.js should pass jshint', function() { 
    ok(true, 'serializers/signup.js should pass jshint.'); 
  });

});
define('coretheloothound/tests/test-helper', ['coretheloothound/tests/helpers/resolver', 'ember-qunit'], function (resolver, ember_qunit) {

	'use strict';

	ember_qunit.setResolver(resolver['default']);

});
define('coretheloothound/tests/test-helper.jshint', function () {

  'use strict';

  module('JSHint - .');
  test('test-helper.js should pass jshint', function() { 
    ok(true, 'test-helper.js should pass jshint.'); 
  });

});
define('coretheloothound/tests/transitions.jshint', function () {

  'use strict';

  module('JSHint - .');
  test('transitions.js should pass jshint', function() { 
    ok(true, 'transitions.js should pass jshint.'); 
  });

});
define('coretheloothound/tests/unit/adapters/application-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("adapter:application", "ApplicationAdapter", {});

  // Replace this with your real tests.
  ember_qunit.test("it exists", function () {
    var adapter = this.subject();
    ok(adapter);
  });
  // Specify the other units that are required for this test.
  // needs: ['serializer:foo']

});
define('coretheloothound/tests/unit/adapters/application-test.jshint', function () {

  'use strict';

  module('JSHint - unit/adapters');
  test('unit/adapters/application-test.js should pass jshint', function() { 
    ok(true, 'unit/adapters/application-test.js should pass jshint.'); 
  });

});
define('coretheloothound/tests/unit/components/character-select-test', ['ember', 'ember-qunit'], function (Ember, ember_qunit) {

  'use strict';

  ember_qunit.moduleForComponent("character-select", "CharacterSelectComponent", {});

  ember_qunit.test("it renders", function () {
    expect(2);

    // creates the component instance
    var component = this.subject({
      characters: []
    });
    equal(component._state, "preRender");

    // appends the component to the page
    this.append();
    equal(component._state, "inDOM");
  });
  // specify the other units that are required for this test
  // needs: ['view:select']

});
define('coretheloothound/tests/unit/components/character-select-test.jshint', function () {

  'use strict';

  module('JSHint - unit/components');
  test('unit/components/character-select-test.js should pass jshint', function() { 
    ok(true, 'unit/components/character-select-test.js should pass jshint.'); 
  });

});
define('coretheloothound/tests/unit/components/date-time-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForComponent("date-time", "DateTimeComponent", {});

  ember_qunit.test("it renders", function () {
    expect(2);

    // creates the component instance
    var component = this.subject();
    equal(component._state, "preRender");

    // appends the component to the page
    this.append();
    equal(component._state, "inDOM");
  });
  // specify the other units that are required for this test
  // needs: ['component:foo', 'helper:bar']

});
define('coretheloothound/tests/unit/components/date-time-test.jshint', function () {

  'use strict';

  module('JSHint - unit/components');
  test('unit/components/date-time-test.js should pass jshint', function() { 
    ok(true, 'unit/components/date-time-test.js should pass jshint.'); 
  });

});
define('coretheloothound/tests/unit/components/donut-graph-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForComponent("donut-graph", "DonutGraphComponent", {});

  ember_qunit.test("it renders", function () {
    expect(2);

    // creates the component instance
    var component = this.subject({
      data: {}
    });
    equal(component._state, "preRender");

    // appends the component to the page
    this.append();
    equal(component._state, "inDOM");
  });
  // specify the other units that are required for this test
  // needs: ['component:foo', 'helper:bar']

});
define('coretheloothound/tests/unit/components/donut-graph-test.jshint', function () {

  'use strict';

  module('JSHint - unit/components');
  test('unit/components/donut-graph-test.js should pass jshint', function() { 
    ok(true, 'unit/components/donut-graph-test.js should pass jshint.'); 
  });

});
define('coretheloothound/tests/unit/components/guild-select-test', ['ember', 'ember-qunit'], function (Ember, ember_qunit) {

  'use strict';

  ember_qunit.moduleForComponent("guild-select", "GuildSelectComponent", {
    // specify the other units that are required for this test
    // needs: ['component:foo', 'helper:bar']
    needs: ["controller:application"]
  });

  ember_qunit.test("it renders", function () {
    expect(2);

    // creates the component instance
    var component = this.subject();
    equal(component._state, "preRender");

    // appends the component to the page
    this.append();
    equal(component._state, "inDOM");
  });

});
define('coretheloothound/tests/unit/components/guild-select-test.jshint', function () {

  'use strict';

  module('JSHint - unit/components');
  test('unit/components/guild-select-test.js should pass jshint', function() { 
    ok(true, 'unit/components/guild-select-test.js should pass jshint.'); 
  });

});
define('coretheloothound/tests/unit/components/raid-group-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForComponent("raid-group", {});

  ember_qunit.test("it renders", function (assert) {
    assert.expect(2);

    // creates the component instance
    var component = this.subject();
    assert.equal(component._state, "preRender");

    // renders the component to the page
    this.render();
    assert.equal(component._state, "inDOM");
  });
  // specify the other units that are required for this test
  // needs: ['component:foo', 'helper:bar']

});
define('coretheloothound/tests/unit/components/raid-group-test.jshint', function () {

  'use strict';

  module('JSHint - unit/components');
  test('unit/components/raid-group-test.js should pass jshint', function() { 
    ok(true, 'unit/components/raid-group-test.js should pass jshint.'); 
  });

});
define('coretheloothound/tests/unit/components/raid-permission-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForComponent("raid-permission", "RaidPermissionComponent", {});

  ember_qunit.test("it renders", function () {
    expect(2);

    // creates the component instance
    var component = this.subject();
    equal(component._state, "preRender");

    // appends the component to the page
    this.append();
    equal(component._state, "inDOM");
  });
  // specify the other units that are required for this test
  // needs: ['component:foo', 'helper:bar']

});
define('coretheloothound/tests/unit/components/raid-permission-test.jshint', function () {

  'use strict';

  module('JSHint - unit/components');
  test('unit/components/raid-permission-test.js should pass jshint', function() { 
    ok(true, 'unit/components/raid-permission-test.js should pass jshint.'); 
  });

});
define('coretheloothound/tests/unit/components/raid-permissions-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForComponent("raid-permissions", "RaidPermissionsComponent", {});

  ember_qunit.test("it renders", function () {
    expect(2);

    // creates the component instance
    var component = this.subject();
    equal(component._state, "preRender");

    // appends the component to the page
    this.append();
    equal(component._state, "inDOM");
  });
  // specify the other units that are required for this test
  // needs: ['component:foo', 'helper:bar']

});
define('coretheloothound/tests/unit/components/raid-permissions-test.jshint', function () {

  'use strict';

  module('JSHint - unit/components');
  test('unit/components/raid-permissions-test.js should pass jshint', function() { 
    ok(true, 'unit/components/raid-permissions-test.js should pass jshint.'); 
  });

});
define('coretheloothound/tests/unit/components/raid-signup-test', ['ember', 'ember-qunit'], function (Ember, ember_qunit) {

  'use strict';

  ember_qunit.moduleForComponent("raid-signup", "RaidSignupComponent", {
    // specify the other units that are required for this test
    needs: ["controller:role"]
  });

  ember_qunit.test("it renders", function () {
    expect(2);

    // creates the component instance
    var component = this.subject();
    equal(component._state, "preRender");

    // appends the component to the page
    this.append();
    equal(component._state, "inDOM");
  });

});
define('coretheloothound/tests/unit/components/raid-signup-test.jshint', function () {

  'use strict';

  module('JSHint - unit/components');
  test('unit/components/raid-signup-test.js should pass jshint', function() { 
    ok(true, 'unit/components/raid-signup-test.js should pass jshint.'); 
  });

});
define('coretheloothound/tests/unit/controllers/account-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("controller:account", "AccountController", {
    // Specify the other units that are required for this test.
    needs: ["controller:application"]
  });

  // Replace this with your real tests.
  ember_qunit.test("it exists", function () {
    var controller = this.subject();
    ok(controller);
  });

});
define('coretheloothound/tests/unit/controllers/account-test.jshint', function () {

  'use strict';

  module('JSHint - unit/controllers');
  test('unit/controllers/account-test.js should pass jshint', function() { 
    ok(true, 'unit/controllers/account-test.js should pass jshint.'); 
  });

});
define('coretheloothound/tests/unit/controllers/application-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("controller:application", "ApplicationController", {});

  // Replace this with your real tests.
  ember_qunit.test("it exists", function () {
    var controller = this.subject();
    ok(controller);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('coretheloothound/tests/unit/controllers/application-test.jshint', function () {

  'use strict';

  module('JSHint - unit/controllers');
  test('unit/controllers/application-test.js should pass jshint', function() { 
    ok(true, 'unit/controllers/application-test.js should pass jshint.'); 
  });

});
define('coretheloothound/tests/unit/controllers/auth-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("controller:auth", "AuthController", {
    // Specify the other units that are required for this test.
    needs: ["controller:application"]
  });

  // Replace this with your real tests.
  ember_qunit.test("it exists", function () {
    var controller = this.subject();
    ok(controller);
  });

});
define('coretheloothound/tests/unit/controllers/auth-test.jshint', function () {

  'use strict';

  module('JSHint - unit/controllers');
  test('unit/controllers/auth-test.js should pass jshint', function() { 
    ok(true, 'unit/controllers/auth-test.js should pass jshint.'); 
  });

});
define('coretheloothound/tests/unit/controllers/character-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("controller:character", "CharacterController", {});

  // Replace this with your real tests.
  ember_qunit.test("it exists", function () {
    var controller = this.subject();
    ok(controller);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('coretheloothound/tests/unit/controllers/character-test.jshint', function () {

  'use strict';

  module('JSHint - unit/controllers');
  test('unit/controllers/character-test.js should pass jshint', function() { 
    ok(true, 'unit/controllers/character-test.js should pass jshint.'); 
  });

});
define('coretheloothound/tests/unit/controllers/characters/index-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("controller:characters/index", "CharactersIndexController", {});

  // Replace this with your real tests.
  ember_qunit.test("it exists", function () {
    var controller = this.subject();
    ok(controller);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('coretheloothound/tests/unit/controllers/characters/index-test.jshint', function () {

  'use strict';

  module('JSHint - unit/controllers/characters');
  test('unit/controllers/characters/index-test.js should pass jshint', function() { 
    ok(true, 'unit/controllers/characters/index-test.js should pass jshint.'); 
  });

});
define('coretheloothound/tests/unit/controllers/raids/index-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("controller:raids/index", "RaidsIndexController", {
    // Specify the other units that are required for this test.
    needs: ["controller:application"]
  });

  // Replace this with your real tests.
  ember_qunit.test("it exists", function () {
    var controller = this.subject();
    ok(controller);
  });

});
define('coretheloothound/tests/unit/controllers/raids/index-test.jshint', function () {

  'use strict';

  module('JSHint - unit/controllers/raids');
  test('unit/controllers/raids/index-test.js should pass jshint', function() { 
    ok(true, 'unit/controllers/raids/index-test.js should pass jshint.'); 
  });

});
define('coretheloothound/tests/unit/controllers/raids/new-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("controller:raids/new", "RaidsNewController", {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
    needs: ["controller:application"]
  });

  // Replace this with your real tests.
  ember_qunit.test("it exists", function () {
    var controller = this.subject();
    ok(controller);
  });

});
define('coretheloothound/tests/unit/controllers/raids/new-test.jshint', function () {

  'use strict';

  module('JSHint - unit/controllers/raids');
  test('unit/controllers/raids/new-test.js should pass jshint', function() { 
    ok(true, 'unit/controllers/raids/new-test.js should pass jshint.'); 
  });

});
define('coretheloothound/tests/unit/controllers/role-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("controller:role", "RoleController", {});

  // Replace this with your real tests.
  ember_qunit.test("it exists", function () {
    var controller = this.subject();
    ok(controller);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('coretheloothound/tests/unit/controllers/role-test.jshint', function () {

  'use strict';

  module('JSHint - unit/controllers');
  test('unit/controllers/role-test.js should pass jshint', function() { 
    ok(true, 'unit/controllers/role-test.js should pass jshint.'); 
  });

});
define('coretheloothound/tests/unit/controllers/signup-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("controller:signup", "SignupController", {});

  // Replace this with your real tests.
  ember_qunit.test("it exists", function () {
    var controller = this.subject();
    ok(controller);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('coretheloothound/tests/unit/controllers/signup-test.jshint', function () {

  'use strict';

  module('JSHint - unit/controllers');
  test('unit/controllers/signup-test.js should pass jshint', function() { 
    ok(true, 'unit/controllers/signup-test.js should pass jshint.'); 
  });

});
define('coretheloothound/tests/unit/helpers/character-class-test', ['coretheloothound/helpers/character-class'], function (character_class) {

  'use strict';

  module("CharacterClassHelper");

  // Replace this with your real tests.
  test("it works", function () {
    var result = character_class.characterClass(42);
    ok(result);
  });

});
define('coretheloothound/tests/unit/helpers/character-class-test.jshint', function () {

  'use strict';

  module('JSHint - unit/helpers');
  test('unit/helpers/character-class-test.js should pass jshint', function() { 
    ok(true, 'unit/helpers/character-class-test.js should pass jshint.'); 
  });

});
define('coretheloothound/tests/unit/helpers/character-faction-test', ['coretheloothound/helpers/character-faction'], function (character_faction) {

  'use strict';

  module("CharacterFactionHelper");

  // Replace this with your real tests.
  test("it works", function () {
    var result = character_faction.characterFaction(42);
    ok(result);
  });

});
define('coretheloothound/tests/unit/helpers/character-faction-test.jshint', function () {

  'use strict';

  module('JSHint - unit/helpers');
  test('unit/helpers/character-faction-test.js should pass jshint', function() { 
    ok(true, 'unit/helpers/character-faction-test.js should pass jshint.'); 
  });

});
define('coretheloothound/tests/unit/helpers/character-race-test', ['coretheloothound/helpers/character-race'], function (character_race) {

  'use strict';

  module("CharacterRaceHelper");

  // Replace this with your real tests.
  test("it works", function () {
    var result = character_race.characterRace(42);
    ok(result);
  });

});
define('coretheloothound/tests/unit/helpers/character-race-test.jshint', function () {

  'use strict';

  module('JSHint - unit/helpers');
  test('unit/helpers/character-race-test.js should pass jshint', function() { 
    ok(true, 'unit/helpers/character-race-test.js should pass jshint.'); 
  });

});
define('coretheloothound/tests/unit/initializers/link-view-test', ['ember', 'coretheloothound/initializers/link-view'], function (Ember, link_view) {

  'use strict';

  var container, application;

  module("LinkViewInitializer", {
    setup: function () {
      Ember['default'].run(function () {
        container = new Ember['default'].Container();
        application = Ember['default'].Application.create();
        application.deferReadiness();
      });
    }
  });

  // Replace this with your real tests.
  test("it works", function () {
    link_view.initialize(container, application);

    // you would normally confirm the results of the initializer here
    ok(true);
  });

});
define('coretheloothound/tests/unit/initializers/link-view-test.jshint', function () {

  'use strict';

  module('JSHint - unit/initializers');
  test('unit/initializers/link-view-test.js should pass jshint', function() { 
    ok(true, 'unit/initializers/link-view-test.js should pass jshint.'); 
  });

});
define('coretheloothound/tests/unit/initializers/storage-test', ['ember', 'coretheloothound/initializers/storage'], function (Ember, storage) {

  'use strict';

  var container, application;

  module("StorageInitializer", {
    setup: function () {
      Ember['default'].run(function () {
        container = new Ember['default'].Container();
        application = Ember['default'].Application.create();
        application.deferReadiness();
      });
    }
  });

  // Replace this with your real tests.
  test("it works", function () {
    storage.initialize(container, application);

    // you would normally confirm the results of the initializer here
    ok(true);
  });

});
define('coretheloothound/tests/unit/initializers/storage-test.jshint', function () {

  'use strict';

  module('JSHint - unit/initializers');
  test('unit/initializers/storage-test.js should pass jshint', function() { 
    ok(true, 'unit/initializers/storage-test.js should pass jshint.'); 
  });

});
define('coretheloothound/tests/unit/mixins/after-render-test', ['ember', 'coretheloothound/mixins/after-render'], function (Ember, AfterRenderMixin) {

  'use strict';

  module("AfterRenderMixin");

  // Replace this with your real tests.
  test("it works", function () {
    var AfterRenderObject = Ember['default'].Object.extend(AfterRenderMixin['default']);
    var subject = AfterRenderObject.create();
    ok(subject);
  });

});
define('coretheloothound/tests/unit/mixins/after-render-test.jshint', function () {

  'use strict';

  module('JSHint - unit/mixins');
  test('unit/mixins/after-render-test.js should pass jshint', function() { 
    ok(true, 'unit/mixins/after-render-test.js should pass jshint.'); 
  });

});
define('coretheloothound/tests/unit/models/account-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForModel("account", "Account", {
    // Specify the other units that are required for this test.
    needs: ["model:character", "model:guild", "model:permission", "model:raid", "model:role", "model:signup"]
  });

  ember_qunit.test("it exists", function () {
    var model = this.subject();
    // var store = this.store();
    ok(!!model);
  });

});
define('coretheloothound/tests/unit/models/account-test.jshint', function () {

  'use strict';

  module('JSHint - unit/models');
  test('unit/models/account-test.js should pass jshint', function() { 
    ok(true, 'unit/models/account-test.js should pass jshint.'); 
  });

});
define('coretheloothound/tests/unit/models/character-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForModel("character", "Character", {
    // Specify the other units that are required for this test.
    needs: ["model:account", "model:guild", "model:signup", "model:raid", "model:role"]
  });

  ember_qunit.test("it exists", function () {
    var model = this.subject();
    // var store = this.store();
    ok(!!model);
  });

});
define('coretheloothound/tests/unit/models/character-test.jshint', function () {

  'use strict';

  module('JSHint - unit/models');
  test('unit/models/character-test.js should pass jshint', function() { 
    ok(true, 'unit/models/character-test.js should pass jshint.'); 
  });

});
define('coretheloothound/tests/unit/models/guild-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForModel("guild", "Guild", {
    // Specify the other units that are required for this test.
    needs: ["model:account", "model:character", "model:signup", "model:raid", "model:role"]
  });

  ember_qunit.test("it exists", function () {
    var model = this.subject();
    // var store = this.store();
    ok(!!model);
  });

});
define('coretheloothound/tests/unit/models/guild-test.jshint', function () {

  'use strict';

  module('JSHint - unit/models');
  test('unit/models/guild-test.js should pass jshint', function() { 
    ok(true, 'unit/models/guild-test.js should pass jshint.'); 
  });

});
define('coretheloothound/tests/unit/models/permission-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForModel("permission", "Permission", {
    // Specify the other units that are required for this test.
    needs: ["model:permissioned"]
  });

  ember_qunit.test("it exists", function () {
    var model = this.subject();
    // var store = this.store();
    ok(!!model);
  });

});
define('coretheloothound/tests/unit/models/permission-test.jshint', function () {

  'use strict';

  module('JSHint - unit/models');
  test('unit/models/permission-test.js should pass jshint', function() { 
    ok(true, 'unit/models/permission-test.js should pass jshint.'); 
  });

});
define('coretheloothound/tests/unit/models/permissioned-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForModel("permissioned", "Permissioned", {
    // Specify the other units that are required for this test.
    needs: ["model:permission"]
  });

  ember_qunit.test("it exists", function () {
    var model = this.subject();
    // var store = this.store();
    ok(!!model);
  });

});
define('coretheloothound/tests/unit/models/permissioned-test.jshint', function () {

  'use strict';

  module('JSHint - unit/models');
  test('unit/models/permissioned-test.js should pass jshint', function() { 
    ok(true, 'unit/models/permissioned-test.js should pass jshint.'); 
  });

});
define('coretheloothound/tests/unit/models/raid-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForModel("raid", "Raid", {
    // Specify the other units that are required for this test.
    needs: ["model:account", "model:character", "model:guild", "model:permission", "model:permissioned", "model:role", "model:signup"]
  });

  ember_qunit.test("it exists", function () {
    var model = this.subject();
    // var store = this.store();
    ok(!!model);
  });

});
define('coretheloothound/tests/unit/models/raid-test.jshint', function () {

  'use strict';

  module('JSHint - unit/models');
  test('unit/models/raid-test.js should pass jshint', function() { 
    ok(true, 'unit/models/raid-test.js should pass jshint.'); 
  });

});
define('coretheloothound/tests/unit/models/role-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForModel("role", "Role", {
    // Specify the other units that are required for this test.
    needs: []
  });

  ember_qunit.test("it exists", function () {
    var model = this.subject();
    // var store = this.store();
    ok(!!model);
  });

});
define('coretheloothound/tests/unit/models/role-test.jshint', function () {

  'use strict';

  module('JSHint - unit/models');
  test('unit/models/role-test.js should pass jshint', function() { 
    ok(true, 'unit/models/role-test.js should pass jshint.'); 
  });

});
define('coretheloothound/tests/unit/models/signup-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForModel("signup", "Signup", {
    // Specify the other units that are required for this test.
    needs: ["model:account", "model:character", "model:guild", "model:permission", "model:raid", "model:role"]
  });

  ember_qunit.test("it exists", function () {
    var model = this.subject();
    // var store = this.store();
    ok(!!model);
  });

});
define('coretheloothound/tests/unit/models/signup-test.jshint', function () {

  'use strict';

  module('JSHint - unit/models');
  test('unit/models/signup-test.js should pass jshint', function() { 
    ok(true, 'unit/models/signup-test.js should pass jshint.'); 
  });

});
define('coretheloothound/tests/unit/routes/apikey-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("route:apikey", "ApikeyRoute", {});

  ember_qunit.test("it exists", function () {
    var route = this.subject();
    ok(route);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('coretheloothound/tests/unit/routes/apikey-test.jshint', function () {

  'use strict';

  module('JSHint - unit/routes');
  test('unit/routes/apikey-test.js should pass jshint', function() { 
    ok(true, 'unit/routes/apikey-test.js should pass jshint.'); 
  });

});
define('coretheloothound/tests/unit/routes/application-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("route:application", "ApplicationRoute", {});

  ember_qunit.test("it exists", function () {
    var route = this.subject();
    ok(route);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('coretheloothound/tests/unit/routes/application-test.jshint', function () {

  'use strict';

  module('JSHint - unit/routes');
  test('unit/routes/application-test.js should pass jshint', function() { 
    ok(true, 'unit/routes/application-test.js should pass jshint.'); 
  });

});
define('coretheloothound/tests/unit/routes/characters/index-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("route:characters/index", "CharactersIndexRoute", {});

  ember_qunit.test("it exists", function () {
    var route = this.subject();
    ok(route);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('coretheloothound/tests/unit/routes/characters/index-test.jshint', function () {

  'use strict';

  module('JSHint - unit/routes/characters');
  test('unit/routes/characters/index-test.js should pass jshint', function() { 
    ok(true, 'unit/routes/characters/index-test.js should pass jshint.'); 
  });

});
define('coretheloothound/tests/unit/routes/raid-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("route:raid", "RaidRoute", {});

  ember_qunit.test("it exists", function () {
    var route = this.subject();
    ok(route);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('coretheloothound/tests/unit/routes/raid-test.jshint', function () {

  'use strict';

  module('JSHint - unit/routes');
  test('unit/routes/raid-test.js should pass jshint', function() { 
    ok(true, 'unit/routes/raid-test.js should pass jshint.'); 
  });

});
define('coretheloothound/tests/unit/routes/raid/index-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("route:raid/index", {});

  ember_qunit.test("it exists", function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('coretheloothound/tests/unit/routes/raid/index-test.jshint', function () {

  'use strict';

  module('JSHint - unit/routes/raid');
  test('unit/routes/raid/index-test.js should pass jshint', function() { 
    ok(true, 'unit/routes/raid/index-test.js should pass jshint.'); 
  });

});
define('coretheloothound/tests/unit/routes/raids/index-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("route:raids/index", "RaidsIndexRoute", {});

  ember_qunit.test("it exists", function () {
    var route = this.subject();
    ok(route);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('coretheloothound/tests/unit/routes/raids/index-test.jshint', function () {

  'use strict';

  module('JSHint - unit/routes/raids');
  test('unit/routes/raids/index-test.js should pass jshint', function() { 
    ok(true, 'unit/routes/raids/index-test.js should pass jshint.'); 
  });

});
define('coretheloothound/tests/unit/serializers/signup-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("serializer:signup", "SignupSerializer", {});

  // Replace this with your real tests.
  ember_qunit.test("it exists", function () {
    var serializer = this.subject();
    ok(serializer);
  });
  // Specify the other units that are required for this test.
  // needs: ['serializer:foo']

});
define('coretheloothound/tests/unit/serializers/signup-test.jshint', function () {

  'use strict';

  module('JSHint - unit/serializers');
  test('unit/serializers/signup-test.js should pass jshint', function() { 
    ok(true, 'unit/serializers/signup-test.js should pass jshint.'); 
  });

});
define('coretheloothound/tests/unit/views/raids/index-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("view:raids/index", "RaidsIndexView");

  // Replace this with your real tests.
  ember_qunit.test("it exists", function () {
    var view = this.subject();
    ok(view);
  });

});
define('coretheloothound/tests/unit/views/raids/index-test.jshint', function () {

  'use strict';

  module('JSHint - unit/views/raids');
  test('unit/views/raids/index-test.js should pass jshint', function() { 
    ok(true, 'unit/views/raids/index-test.js should pass jshint.'); 
  });

});
define('coretheloothound/tests/views/raids/index.jshint', function () {

  'use strict';

  module('JSHint - views/raids');
  test('views/raids/index.js should pass jshint', function() { 
    ok(true, 'views/raids/index.js should pass jshint.'); 
  });

});
define('coretheloothound/transitions', ['exports'], function (exports) {

  'use strict';

  exports['default'] = function () {
    this.transition(this.toRoute("index"), this.use("crossFade"), this.reverse("crossFade"));

    this.transition(this.fromRoute("raids", "raid"), this.toRoute("account"), this.use("toDown"), this.reverse("toUp"));

    this.transition(this.fromRoute("raids"), this.toRoute("raid"), this.use("toLeft"), this.reverse("toRight"));

    this.transition(this.fromRoute("raid.index"), this.toRoute("raid.edit"), this.use("toLeft"), this.reverse("toRight"));
  };

});
define('coretheloothound/transitions/cross-fade', ['exports', 'liquid-fire'], function (exports, liquid_fire) {

  'use strict';


  exports['default'] = crossFade;
  // BEGIN-SNIPPET cross-fade-definition
  function crossFade(oldView, insertNewView, opts) {
    liquid_fire.stop(oldView);
    return insertNewView().then(function (newView) {
      return liquid_fire.Promise.all([liquid_fire.animate(oldView, { opacity: 0 }, opts), liquid_fire.animate(newView, { opacity: [1, 0] }, opts)]);
    });
  } // END-SNIPPET

});
define('coretheloothound/transitions/fade', ['exports', 'liquid-fire'], function (exports, liquid_fire) {

  'use strict';


  exports['default'] = fade;
  // BEGIN-SNIPPET fade-definition
  function fade(oldView, insertNewView, opts) {
    var firstStep,
        outOpts = opts;

    if (liquid_fire.isAnimating(oldView, "fade-out")) {
      // if the old view is already fading out, let it finish.
      firstStep = liquid_fire.finish(oldView, "fade-out");
    } else {
      if (liquid_fire.isAnimating(oldView, "fade-in")) {
        // if the old view is partially faded in, scale its fade-out
        // duration appropriately.
        outOpts = { duration: liquid_fire.timeSpent(oldView, "fade-in") };
      }
      liquid_fire.stop(oldView);
      firstStep = liquid_fire.animate(oldView, { opacity: 0 }, outOpts, "fade-out");
    }

    return firstStep.then(insertNewView).then(function (newView) {
      return liquid_fire.animate(newView, { opacity: [1, 0] }, opts, "fade-in");
    });
  } // END-SNIPPET

});
define('coretheloothound/transitions/flex-grow', ['exports', 'liquid-fire'], function (exports, liquid_fire) {

  'use strict';


  exports['default'] = flexGrow;
  function flexGrow(oldView, insertNewView, opts) {
    liquid_fire.stop(oldView);
    return insertNewView().then(function (newView) {
      return liquid_fire.Promise.all([liquid_fire.animate(oldView, { "flex-grow": 0 }, opts), liquid_fire.animate(newView, { "flex-grow": [1, 0] }, opts)]);
    });
  }

});
define('coretheloothound/transitions/modal-popup', ['exports', 'ember', 'liquid-fire'], function (exports, Ember, liquid_fire) {

  'use strict';



  exports['default'] = modalPopup;
  var Velocity = Ember['default'].$.Velocity;

  function hideModal(oldView) {
    var box, obscure;
    if (!oldView || !(box = oldView.$(".lm-container > div")) || !(box = box[0]) || !(obscure = oldView.$(".lf-overlay")) || !(obscure = obscure[0])) {
      return liquid_fire.Promise.resolve();
    }

    return liquid_fire.Promise.all([Velocity.animate(obscure, { opacity: [0, 0.5] }, { duration: 250 }), Velocity.animate(box, { scale: [0, 1] }, { duration: 250 })]);
  }

  function revealModal(insertNewView) {
    return insertNewView().then(function (newView) {
      var box, obscure;
      if (!newView || !(box = newView.$(".lm-container > div")[0]) || !(obscure = newView.$(".lf-overlay")[0])) {
        return;
      }

      // we're not going to animate the whole view, rather we're going
      // to animate two pieces of it separately. So we move the view
      // properties down onto the individual elements, so that the
      // animate function can reveal them at precisely the right time.
      Ember['default'].$(box).css({
        display: "none"
      });

      Ember['default'].$(obscure).css({
        display: "none"
      });
      newView.$().css({
        display: "",
        visibility: ""
      });

      return liquid_fire.Promise.all([Velocity.animate(obscure, { opacity: [0.5, 0] }, { duration: 250, display: "" }), Velocity.animate(box, { scale: [1, 0] }, { duration: 250, display: "" })]);
    });
  }function modalPopup(oldView, insertNewView) {
    return hideModal(oldView).then(function () {
      return revealModal(insertNewView);
    });
  }

});
define('coretheloothound/transitions/move-over', ['exports', 'liquid-fire'], function (exports, liquid_fire) {

  'use strict';



  exports['default'] = moveOver;
  function moveOver(oldView, insertNewView, dimension, direction, opts) {
    var oldParams = {},
        newParams = {},
        firstStep,
        property,
        measure;

    if (dimension.toLowerCase() === "x") {
      property = "translateX";
      measure = "width";
    } else {
      property = "translateY";
      measure = "height";
    }

    if (liquid_fire.isAnimating(oldView, "moving-in")) {
      firstStep = liquid_fire.finish(oldView, "moving-in");
    } else {
      liquid_fire.stop(oldView);
      firstStep = liquid_fire.Promise.resolve();
    }


    return firstStep.then(insertNewView).then(function (newView) {
      if (newView && newView.$() && oldView && oldView.$()) {
        var sizes = [parseInt(newView.$().css(measure), 10), parseInt(oldView.$().css(measure), 10)];
        var bigger = Math.max.apply(null, sizes);
        oldParams[property] = bigger * direction + "px";
        newParams[property] = ["0px", -1 * bigger * direction + "px"];
      } else {
        oldParams[property] = 100 * direction + "%";
        newParams[property] = ["0%", -100 * direction + "%"];
      }

      return liquid_fire.Promise.all([liquid_fire.animate(oldView, oldParams, opts), liquid_fire.animate(newView, newParams, opts, "moving-in")]);
    });
  }

});
define('coretheloothound/transitions/scroll-then', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = function () {
    Ember['default'].assert("You must provide a transition name as the first argument to scrollThen. Example: this.use('scrollThen', 'toLeft')", "string" === typeof arguments[2]);

    var el = document.getElementsByTagName("html"),
        transitionArgs = Array.prototype.slice.call(arguments, 0, 2),
        nextTransition = this.lookup(arguments[2]),
        self = this,
        options = arguments[3] || {};

    Ember['default'].assert("The second argument to scrollThen is passed to Velocity's scroll function and must be an object", "object" === typeof options);

    // set scroll options via: this.use('scrollThen', 'ToLeft', {easing: 'spring'})
    options = Ember['default'].merge({ duration: 500, offset: 0 }, options);

    // additional args can be passed through after the scroll options object
    // like so: this.use('scrollThen', 'moveOver', {duration: 100}, 'x', -1);
    transitionArgs.push.apply(transitionArgs, Array.prototype.slice.call(arguments, 4));

    return window.$.Velocity(el, "scroll", options).then(function () {
      nextTransition.apply(self, transitionArgs);
    });
  };

});
define('coretheloothound/transitions/to-down', ['exports', 'liquid-fire'], function (exports, liquid_fire) {

	'use strict';

	exports['default'] = liquid_fire.curryTransition("move-over", "y", 1);

});
define('coretheloothound/transitions/to-left', ['exports', 'liquid-fire'], function (exports, liquid_fire) {

	'use strict';

	exports['default'] = liquid_fire.curryTransition("move-over", "x", -1);

});
define('coretheloothound/transitions/to-right', ['exports', 'liquid-fire'], function (exports, liquid_fire) {

	'use strict';

	exports['default'] = liquid_fire.curryTransition("move-over", "x", 1);

});
define('coretheloothound/transitions/to-up', ['exports', 'liquid-fire'], function (exports, liquid_fire) {

	'use strict';

	exports['default'] = liquid_fire.curryTransition("move-over", "y", -1);

});
define('coretheloothound/views/liquid-child', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].ContainerView.extend({
    classNames: ["liquid-child"],
    resolveInsertionPromise: Ember['default'].on("didInsertElement", function () {
      // Children start out hidden and invisible.
      // Measurement will `show` them and Velocity will make them visible.
      // This prevents a flash of pre-animated content.
      this.$().css({ visibility: "hidden" }).hide();
      if (this._resolveInsertion) {
        this._resolveInsertion(this);
      }
    })
  });

});
define('coretheloothound/views/liquid-if', ['exports', 'coretheloothound/views/liquid-outlet', 'ember'], function (exports, LiquidOutlet, Ember) {

  'use strict';

  var isHTMLBars = !!Ember['default'].HTMLBars;

  exports['default'] = LiquidOutlet['default'].extend({
    liquidUpdate: Ember['default'].on("init", Ember['default'].observer("showFirst", function () {
      var template = this.get("templates")[this.get("showFirst") ? 0 : 1];
      if (!template || !isHTMLBars && template === Ember['default'].Handlebars.VM.noop) {
        this.set("currentView", null);
        return;
      }
      var view = Ember['default']._MetamorphView.create({
        container: this.container,
        template: template,
        liquidParent: this,
        contextBinding: "liquidParent.context",
        liquidContext: this.get("showFirst"),
        hasLiquidContext: true
      });
      this.set("currentView", view);
    }))

  });

});
define('coretheloothound/views/liquid-outlet', ['exports', 'ember', 'liquid-fire'], function (exports, Ember, liquid_fire) {

  'use strict';

  var capitalize = Ember['default'].String.capitalize;

  exports['default'] = Ember['default'].ContainerView.extend({
    classNames: ["liquid-container"],
    growDuration: 250,
    growPixelsPerSecond: 200,
    growEasing: "slide",
    enableGrowth: true,

    init: function () {
      // The ContainerView constructor normally sticks our "currentView"
      // directly into _childViews, but we want to leave that up to
      // _currentViewDidChange so we have the opportunity to launch a
      // transition.
      this._super();
      Ember['default'].A(this._childViews).clear();

      if (this.get("containerless")) {
        // This prevents Ember from throwing an assertion when we try to
        // render as a virtual view.
        this.set("innerClassNameBindings", this.get("classNameBindings"));
        this.set("classNameBindings", Ember['default'].A());
      }
    },

    // Deliberately overriding a private method from
    // Ember.ContainerView!
    //
    // We need to stop it from destroying our outgoing child view
    // prematurely.
    _currentViewWillChange: Ember['default'].beforeObserver("currentView", function () {}),

    // Deliberately overriding a private method from
    // Ember.ContainerView!
    _currentViewDidChange: Ember['default'].on("init", Ember['default'].observer("currentView", function () {
      // Normally there is only one child (the view we're
      // replacing). But sometimes there may be two children (because a
      // transition is already in progress). In any case, we tell all of
      // them to start heading for the exits now.

      var oldView = this.get("childViews.lastObject"),
          newView = this.get("currentView"),
          firstTime;

      // For the convenience of the transition rules, we explicitly
      // track our first transition, which happens at initial render.
      firstTime = !this._hasTransitioned;
      this._hasTransitioned = true;

      // Idempotence
      if (!oldView && !newView || oldView && oldView.get("currentView") === newView || this._runningTransition && this._runningTransition.oldView === oldView && this._runningTransition.newContent === newView) {
        return;
      }

      // `transitions` comes from dependency injection, see the
      // liquid-fire app initializer.
      var transition = this.get("transitions").transitionFor(this, oldView, newView, this.get("use"), firstTime);

      if (this._runningTransition) {
        this._runningTransition.interrupt();
      }

      this._runningTransition = transition;
      transition.run()["catch"](function (err) {
        // Force any errors through to the RSVP error handler, because
        // of https://github.com/tildeio/rsvp.js/pull/278.  The fix got
        // into Ember 1.7, so we can drop this once we decide 1.6 is
        // EOL.
        Ember['default'].RSVP.Promise.resolve()._onerror(err);
      });
    })),

    _liquidChildFor: function (content) {
      if (content && !content.get("hasLiquidContext")) {
        content.set("liquidContext", content.get("context"));
      }
      var LiquidChild = this.container.lookupFactory("view:liquid-child");
      var childProperties = {
        currentView: content
      };
      if (this.get("containerless")) {
        childProperties.classNames = this.get("classNames").without("liquid-container");
        childProperties.classNameBindings = this.get("innerClassNameBindings");
      }
      return LiquidChild.create(childProperties);
    },

    _pushNewView: function (newView) {
      if (!newView) {
        return liquid_fire.Promise.resolve();
      }
      var child = this._liquidChildFor(newView),
          promise = new liquid_fire.Promise(function (resolve) {
        child._resolveInsertion = resolve;
      });
      this.pushObject(child);
      return promise;
    },

    cacheSize: function () {
      var elt = this.$();
      if (elt) {
        // Measure original size.
        this._cachedSize = getSize(elt);
      }
    },

    unlockSize: function () {
      var self = this;
      function doUnlock() {
        var elt = self.$();
        if (elt) {
          elt.css({ width: "", height: "" });
        }
      }
      if (this._scaling) {
        this._scaling.then(doUnlock);
      } else {
        doUnlock();
      }
    },

    _durationFor: function (before, after) {
      return Math.min(this.get("growDuration"), 1000 * Math.abs(before - after) / this.get("growPixelsPerSecond"));
    },

    _adaptDimension: function (dimension, before, after) {
      if (before[dimension] === after[dimension] || !this.get("enableGrowth")) {
        var elt = this.$();
        if (elt) {
          elt[dimension](after[dimension]);
        }
        return liquid_fire.Promise.resolve();
      } else {
        // Velocity deals in literal width/height, whereas jQuery deals
        // in box-sizing-dependent measurements.
        var target = {};
        target[dimension] = [after["literal" + capitalize(dimension)], before["literal" + capitalize(dimension)]];
        return liquid_fire.animate(this, target, {
          duration: this._durationFor(before[dimension], after[dimension]),
          queue: false,
          easing: this.get("growEasing")
        });
      }
    },

    adaptSize: function () {
      liquid_fire.stop(this);

      var elt = this.$();
      if (!elt) {
        return;
      }

      // Measure new size.
      var newSize = getSize(elt);
      if (typeof this._cachedSize === "undefined") {
        this._cachedSize = newSize;
      }

      // Now that measurements have been taken, lock the size
      // before the invoking the scaling transition.
      elt.width(this._cachedSize.width);
      elt.height(this._cachedSize.height);

      this._scaling = liquid_fire.Promise.all([this._adaptDimension("width", this._cachedSize, newSize), this._adaptDimension("height", this._cachedSize, newSize)]);
    }

  });

  // We're tracking both jQuery's box-sizing dependent measurements and
  // the literal CSS properties, because it's nice to get/set dimensions
  // with jQuery and not worry about boz-sizing *but* Velocity needs the
  // raw values.
  function getSize(elt) {
    return {
      width: elt.width(),
      literalWidth: parseInt(elt.css("width"), 10),
      height: elt.height(),
      literalHeight: parseInt(elt.css("height"), 10)
    };
  }

});
define('coretheloothound/views/liquid-with', ['exports', 'coretheloothound/views/liquid-outlet', 'ember'], function (exports, LiquidOutlet, Ember) {

  'use strict';

  exports['default'] = LiquidOutlet['default'].extend({
    liquidUpdate: Ember['default'].on("init", Ember['default'].observer("boundContext", function () {
      var context = this.get("boundContext");
      if (Ember['default'].isEmpty(context)) {
        this.set("currentView", null);
        return;
      }
      var view = Ember['default']._MetamorphView.create({
        container: this.container,
        templateName: "liquid-with",
        boundContext: context,
        liquidWithParent: this,
        liquidContext: context,
        hasLiquidContext: true });
      this.set("currentView", view);
    }))

  });

});
define('coretheloothound/views/raids/index', ['exports', 'ember', 'coretheloothound/mixins/after-render'], function (exports, Ember, AfterRender) {

  'use strict';

  exports['default'] = Ember['default'].View.extend(AfterRender['default'], {
    afterRenderEvent: function () {
      Ember['default'].$("[data-toggle=\"popover\"]").popover({
        title: "Raid Note",
        placement: "top",
        trigger: "hover"
      });
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
  var rawConfig = Ember['default'].$('meta[name="' + metaName + '"]').attr('content');
  var config = JSON.parse(unescape(rawConfig));

  return { 'default': config };
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

/* jshint ignore:end */

});

if (runningTests) {
  require("coretheloothound/tests/test-helper");
} else {
  require("coretheloothound/app")["default"].create({"LOG_TRANSITIONS":true,"LOG_TRANSITIONS_INTERNAL":true,"LOG_VIEW_LOOKUPS":true,"name":"coretheloothound","version":"0.0.0.a1e9f493"});
}

/* jshint ignore:end */
//# sourceMappingURL=coretheloothound.map