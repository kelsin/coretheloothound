/* global Modernizr */

import Ember from 'ember';

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
export default Ember.Object.extend({
  base: 'coretheloothound_',

  getValue(key) {
    if (Modernizr.localstorage) {
      return window.localStorage.getItem(this.get('base') + key);
    } else {
      return Ember.$.cookie(this.get('base') + key);
    }
  },

  setValue(key, value) {
    if (Modernizr.localstorage) {
      window.localStorage.setItem(this.get('base') + key, value);
    } else {
      Ember.$.cookie(this.get('base') + key, value);
    }
  },

  removeValue(key) {
    if (Modernizr.localstorage) {
      window.localStorage.removeItem(this.get('base') + key);
    } else {
      Ember.$.removeCookie(this.get('base') + key);
    }
  }
});
