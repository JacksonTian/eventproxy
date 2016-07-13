/*global define, process, setImmediate*/
!(function (name, definition) {
  // Check define
  var hasDefine = typeof define === 'function',
    // Check exports
    hasExports = typeof module !== 'undefined' && module.exports;

  if (hasDefine) {
    // AMD Module or CMD Module
    define('eventproxy_debug', function () {return function () {};});
    define(['eventproxy_debug'], definition);
  } else if (hasExports) {
    // Node.js Module
    module.exports = definition(require('debug')('eventproxy'));
  } else {
    // Assign to common namespaces or simply the global object (window)
    this[name] = definition();
  }
})('EventProxy', function (debug) {
  debug = debug || function () {};

  /*!
   * refs
   */
  var SLICE = Array.prototype.slice;
  var CONCAT = Array.prototype.concat;
  var ALL_EVENT = '__all__';

  var later = (typeof setImmediate !== 'undefined' && setImmediate) ||
    (typeof process !== 'undefined' && process.nextTick) || function (fn) {
      setTimeout(fn, 0);
    };

  var _assign = function (eventname1, eventname2, cb, once) {
    var proxy = this;
    var argsLength = arguments.length;
    var times = 0;
    var flag = {};

    // Check the arguments length.
    if (argsLength < 3) {
      return this;
    }

    var events = SLICE.call(arguments, 0, -2);
    var callback = arguments[argsLength - 2];
    var isOnce = arguments[argsLength - 1];

    // Check the callback type.
    if (typeof callback !== 'function') {
      return this;
    }

    debug('Assign listener for events %j, once is %s', events, !!isOnce);

    var method = isOnce ? 'once' : 'bind';

    var length = events.length;

    for (var index = 0; index < length; index++) {
      let key = events[index];
      proxy[method](key, (data) => {
        proxy._fired[key] = proxy._fired[key] || {};
        proxy._fired[key].data = data;
        if (!flag[key]) {
          flag[key] = true;
          times++;
        }
      });
    }

    var _all = function (event) {
      if (times < length) {
        return;
      }
      if (!flag[event]) {
        return;
      }
      var data = [];
      for (var index = 0; index < length; index++) {
        data.push(proxy._fired[events[index]].data);
      }
      if (isOnce) {
        proxy.unbindForAll(_all);
      }
      debug('Events %j all emited with data %j', events, data);
      callback(...data);
    };

    proxy.bindForAll(_all);
  };

  /**
   * EventProxy. An implementation of task/event based asynchronous pattern.
   * A module that can be mixed in to *any object* in order to provide it with custom events.
   * You may `bind` or `unbind` a callback function to an event;
   * `trigger`-ing an event fires all callbacks in succession.
   * Examples:
   * ```js
   * var render = function (template, resources) {};
   * var proxy = new EventProxy();
   * proxy.assign("template", "l10n", render);
   * proxy.trigger("template", template);
   * proxy.trigger("l10n", resources);
   * ```
   */
  class EventProxy {
    construct() {
      this._callbacks = {};
      this._fired = {};
    }

    /**
     * Bind an event, specified by a string name, `ev`, to a `callback` function.
     * Passing __ALL_EVENT__ will bind the callback to all events fired.
     * Examples:
     * ```js
     * var proxy = new EventProxy();
     * proxy.addListener("template", function (event) {
     *   // TODO
     * });
     * ```
     * @param {String} eventname Event name.
     * @param {Function} callback Callback.
     */
    addListener(ev, callback) {
      debug('Add listener for %s', ev);
      this._callbacks[ev] = this._callbacks[ev] || [];
      this._callbacks[ev].push(callback);
      return this;
    }

    /**
     * Bind an event, but put the callback into head of all callbacks.
     * @param {String} eventname Event name.
     * @param {Function} callback Callback.
     */
    headbind(ev, callback) {
      debug('Add listener for %s', ev);
      this._callbacks[ev] = this._callbacks[ev] || [];
      this._callbacks[ev].unshift(callback);
      return this;
    }

    /**
     * Remove one or many callbacks.
     *
     * - If `callback` is null, removes all callbacks for the event.
     * - If `eventname` is null, removes all bound callbacks for all events.
     * @param {String} eventname Event name.
     * @param {Function} callback Callback.
     */
    removeListener(eventname, callback) {
      var calls = this._callbacks;
      if (!eventname) {
        debug('Remove all listeners');
        this._callbacks = {};
      } else {
        if (!callback) {
          debug('Remove all listeners of %s', eventname);
          calls[eventname] = [];
        } else {
          var list = calls[eventname];
          if (list) {
            var l = list.length;
            for (var i = 0; i < l; i++) {
              if (callback === list[i]) {
                debug('Remove a listener of %s', eventname);
                list[i] = null;
              }
            }
          }
        }
      }
      return this;
    }

    /**
     * Remove all listeners. It equals unbind()
     * Just add this API for as same as Event.Emitter.
     * @param {String} event Event name.
     */
    removeAllListeners(event) {
      return this.unbind(event);
    }

    /**
     * Bind the ALL_EVENT event
     */
    bindForAll(callback) {
      this.bind(ALL_EVENT, callback);
    }

    /**
     * Unbind the ALL_EVENT event
     */
    unbindForAll(callback) {
      this.unbind(ALL_EVENT, callback);
    }

    /**
     * Trigger an event, firing all bound callbacks. Callbacks are passed the
     * same arguments as `trigger` is, apart from the event name.
     * Listening for `"all"` passes the true event name as the first argument.
     * @param {String} eventname Event name
     * @param {Mix} data Pass in data
     */
    trigger(eventname, data) {
      var list, ev, callback, i, l;
      var both = 2;
      var calls = this._callbacks;
      debug('Emit event %s with data %j', eventname, data);
      while (both--) {
        ev = both ? eventname : ALL_EVENT;
        list = calls[ev];
        if (list) {
          for (i = 0, l = list.length; i < l; i++) {
            if (!(callback = list[i])) {
              list.splice(i, 1);
              i--;
              l--;
            } else {
              var args = [];
              var start = both ? 1 : 0;
              for (var j = start; j < arguments.length; j++) {
                args.push(arguments[j]);
              }
              callback.apply(this, args);
            }
          }
        }
      }

      return this;
    }

    /**
     * Bind an event like the bind method, but will remove the listener after it was fired.
     * @param {String} ev Event name
     * @param {Function} callback Callback
     */
    once(ev, callback) {
      var wrapper = (...args) => {
        callback.call(self, ...args);
        this.unbind(ev, wrapper);
      };

      this.bind(ev, wrapper);

      return this;
    }

    /**
     * emitLater
     * make emit async
     */
    emitLater(...args) {
      later(() => {
        this.trigger(...args);
      });
    }

    /**
     * Bind an event, and trigger it immediately.
     * @param {String} ev Event name.
     * @param {Function} callback Callback.
     * @param {Mix} data The data that will be passed to calback as arguments.
     */
    immediate(ev, callback, data) {
      this.bind(ev, callback);
      this.trigger(ev, data);

      return this;
    }

    /**
     * Assign some events, after all events were fired, the callback will be executed once.
     *
     * Examples:
     * ```js
     * proxy.all(ev1, ev2, callback);
     * proxy.all([ev1, ev2], callback);
     * proxy.all(ev1, [ev2, ev3], callback);
     * ```
     * @param {String} eventname1 First event name.
     * @param {String} eventname2 Second event name.
     * @param {Function} callback Callback, that will be called after predefined events were fired.
     */
    all(eventname1, eventname2, callback) {
      var args = CONCAT.apply([], arguments);
      args.push(true);
      _assign.apply(this, args);

      return this;
    }

    /**
     * Assign the only one 'error' event handler.
     * @param {Function(err)} callback
     */
    fail(callback) {
      this.once('error', (...args) => {
        this.unbind();
        // put all arguments to the error handler
        // fail(function(err, args1, args2, ...){})
        callback(...args);
      });

      return this;
    }

    /**
     * A shortcut of ep#emit('error', err)
     */
    throw(...args) {
      this.emit('error', ...args);
    }

    /**
     * Assign some events, after all events were fired, the callback will be executed first time.
     * Then any event that predefined be fired again, the callback will executed with the newest data.
     * Examples:
     * ```js
     * proxy.tail(ev1, ev2, callback);
     * proxy.tail([ev1, ev2], callback);
     * proxy.tail(ev1, [ev2, ev3], callback);
     * ```
     * @param {String} eventname1 First event name.
     * @param {String} eventname2 Second event name.
     * @param {Function} callback Callback, that will be called after predefined events were fired.
     */
    tail() {
      var args = CONCAT.apply([], arguments);
      args.push(false);
      _assign.apply(this, args);
      return this;
    }

    /**
     * The callback will be executed after the event be fired N times.
     * @param {String} eventname Event name.
     * @param {Number} times N times.
     * @param {Function} callback Callback, that will be called after event was fired N times.
     */
    after(eventname, times, callback) {
      if (times === 0) {
        callback([]);
        return this;
      }

      var firedData = [];
      var group = eventname + '_group';
      this._after = this._after || {};
      this._after[group] = {
        index: 0,
        results: []
      };

      debug('After emit %s times, event %s\'s listenner will execute', times, eventname);
      var all = (name, data) => {
        if (name === eventname) {
          times--;
          firedData.push(data);
          if (times < 1) {
            debug('Event %s was emit %s, and execute the listenner', eventname, times);
            this.unbindForAll(all);
            callback(firedData);
          }
        }

        if (name === group) {
          times--;
          this._after[group].results[data.index] = data.result;
          if (times < 1) {
            debug('Event %s was emit %s, and execute the listenner', eventname, times);
            this.unbindForAll(all);
            callback(this._after[group].results);
          }
        }
      };

      this.bindForAll(all);

      return this;
    }

    /**
     * The `after` method's helper. Use it will return ordered results.
     * If you need manipulate result, you need callback
     * Examples:
     * ```js
     * var ep = new EventProxy();
     * ep.after('file', files.length, function (list) {
     *   // Ordered results
     * });
     * for (var i = 0; i < files.length; i++) {
     *   fs.readFile(files[i], 'utf-8', ep.group('file'));
     * }
     * ```
     * @param {String} eventname Event name, shoule keep consistent with `after`.
     * @param {Function} callback Callback function, should return the final result.
     */
    group(eventname, callback) {
      var group = eventname + '_group';
      var index = this._after[group].index;
      this._after[group].index++;

      return (err, data) => {
        if (err) {
          let args = [].concat(SLICE.call(arguments));
          // put all arguments to the error handler
          return this.emit('error', ...args);
        }

        var args = SLICE.call(arguments, 1);

        this.emit(group, {
          index: index,
          // callback(err, args1, args2, ...)
          result: callback ? callback(...args) : data
        });
      };
    }

    /**
     * The callback will be executed after any registered event was fired. It only executed once.
     * @param {String} eventname1 Event name.
     * @param {String} eventname2 Event name.
     * @param {Function} callback The callback will get a map that has data and eventname attributes.
     */
    any() {
      var callback = arguments[arguments.length - 1],
        events = SLICE.call(arguments, 0, -1),
        _eventname = events.join('_');

      debug('Add listenner for Any of events %j emit', events);
      this.once(_eventname, callback);

      for (var index = 0; index < events.length; index++) {
        let key = events[index];
        this.bind(key, (data) => {
          debug('One of events %j emited, execute the listenner');
          this.trigger(_eventname, {'data': data, eventName: key});
        });
      }
    }

    /**
     * The callback will be executed when the event name not equals with assigned event.
     * @param {String} eventname Event name.
     * @param {Function} callback Callback.
     */
    not(eventname, callback) {
      debug('Add listenner for not event %s', eventname);
      this.bindForAll((name, ...args) => {
        if (name !== eventname) {
          debug('listenner execute of event %s emit, but not event %s.', name, eventname);
          callback(...args);
        }
      });
    }

    /**
     * Success callback wrapper, will handler err for you.
     *
     * ```js
     * fs.readFile('foo.txt', ep.done('content'));
     *
     * // equal to =>
     *
     * fs.readFile('foo.txt', function (err, content) {
     *   if (err) {
     *     return ep.emit('error', err);
     *   }
     *   ep.emit('content', content);
     * });
     * ```
     *
     * ```js
     * fs.readFile('foo.txt', ep.done('content', function (content) {
     *   return content.trim();
     * }));
     *
     * // equal to =>
     *
     * fs.readFile('foo.txt', function (err, content) {
     *   if (err) {
     *     return ep.emit('error', err);
     *   }
     *   ep.emit('content', content.trim());
     * });
     * ```
     * @param {Function|String} handler, success callback or event name will be emit after callback.
     * @return {Function}
     */
    done(handler, callback) {
      return (err, data) => {
        if (err) {
          // put all arguments to the error handler
          let args = [].concat(SLICE.call(arguments));
          return this.emit('error', ...args);
        }

        // callback(err, args1, args2, ...)
        var args = SLICE.call(arguments, 1);

        if (typeof handler === 'string') {
          // getAsync(query, ep.done('query'));
          // or
          // getAsync(query, ep.done('query', function (data) {
          //   return data.trim();
          // }));
          if (callback) {
            // only replace the args when it really return a result
            return this.emit(handler, callback(...args));
          } else {
            // put all arguments to the done handler
            //ep.done('some');
            //ep.on('some', function(args1, args2, ...){});
            return this.emit(handler, ...args);
          }
        }

        // speed improve for mostly case: `callback(err, data)`
        if (arguments.length <= 2) {
          return handler(data);
        }

        // callback(err, args1, args2, ...)
        handler(...args);
      };
    }

    /**
     * make done async
     * @return {Function} delay done
     */
    doneLater(handler, callback) {
      var _doneHandler = this.done(handler, callback);
      return function (...args) {
        later(() => {
          _doneHandler(...args);
        });
      };
    }

    /**
     * Create a new EventProxy
     * Examples:
     * ```js
     * var ep = EventProxy.create();
     * ep.assign('user', 'articles', function(user, articles) {
     *   // do something...
     * });
     * // or one line ways: Create EventProxy and Assign
     * var ep = EventProxy.create('user', 'articles', function(user, articles) {
     *   // do something...
     * });
     * ```
     * @return {EventProxy} EventProxy instance
     */
    static create() {
      var ep = new EventProxy();
      var args = CONCAT.apply([], arguments);

      if (args.length) {
        var errorHandler = args[args.length - 1];
        var callback = args[args.length - 2];

        if (typeof errorHandler === 'function' && typeof callback === 'function') {
          args.pop();
          ep.fail(errorHandler);
        }

        ep.assign(...args);
      }

      return ep;
    }
  }

  /**
   * `addListener` alias, `bind`
   */
  EventProxy.prototype.bind = EventProxy.prototype.addListener;
  /**
   * `addListener` alias, `on`
   */
  EventProxy.prototype.on = EventProxy.prototype.addListener;
  /**
   * `addListener` alias, `subscribe`
   */
  EventProxy.prototype.subscribe = EventProxy.prototype.addListener;

  /**
   * `removeListener` alias, unbind
   */
  EventProxy.prototype.unbind = EventProxy.prototype.removeListener;

  /**
   * `trigger` alias
   */
  EventProxy.prototype.emit = EventProxy.prototype.trigger;
  /**
   * `trigger` alias
   */
  EventProxy.prototype.fire = EventProxy.prototype.trigger;

  /**
   * `immediate` alias
   */
  EventProxy.prototype.asap = EventProxy.prototype.immediate;

  /**
   * `all` alias
   */
  EventProxy.prototype.assign = EventProxy.prototype.all;

  /**
   * `tail` alias, assignAll
   */
  EventProxy.prototype.assignAll = EventProxy.prototype.tail;

  /**
   * `tail` alias, assignAlways
   */
  EventProxy.prototype.assignAlways = EventProxy.prototype.tail;

  // Backwards compatibility
  EventProxy.EventProxy = EventProxy;

  return EventProxy;
});
