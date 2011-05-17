// EventEmitter
// -----------------

// A module that can be mixed in to *any object* in order to provide it with
// custom events. You may `bind` or `unbind` a callback function to an event;
// `trigger`-ing an event fires all callbacks in succession.
//
//     var object = {};
//     _.extend(object, Backbone.Events);
//     object.bind('expand', function(){ alert('expanded'); });
//     object.trigger('expand');
//
var EventEmitter = function () {
};
// Bind an event, specified by a string name, `ev`, to a `callback` function.
// Passing `"all"` will bind the callback to all events fired.
EventEmitter.prototype.bind = EventEmitter.prototype.on = EventEmitter.prototype.addListener = function(ev, callback) {
  var calls = this._callbacks || (this._callbacks = {});
  var list  = this._callbacks[ev] || (this._callbacks[ev] = []);
  list.push(callback);
  return this;
};

// Remove one or many callbacks. If `callback` is null, removes all
// callbacks for the event. If `ev` is null, removes all bound callbacks
// for all events.
EventEmitter.prototype.unbind = function(ev, callback) {
  var calls;
  if (!ev) {
    this._callbacks = {};
  } else if (calls = this._callbacks) {
    if (!callback) {
      calls[ev] = [];
    } else {
      var list = calls[ev];
      if (!list) return this;
      for (var i = 0, l = list.length; i < l; i++) {
        if (callback === list[i]) {
          list[i] = null;
          break;
        }
      }
    }
  }
  return this;
};

// Trigger an event, firing all bound callbacks. Callbacks are passed the
// same arguments as `trigger` is, apart from the event name.
// Listening for `"all"` passes the true event name as the first argument.
EventEmitter.prototype.emit = EventEmitter.prototype.trigger = function(eventName) {
  var list, calls, ev, callback, args, i, l;
  var both = 2;
  if (!(calls = this._callbacks)) return this;
  while (both--) {
    ev = both ? eventName : 'all';
    if (list = calls[ev]) {
      for (i = 0, l = list.length; i < l; i++) {
        if (!(callback = list[i])) {
          list.splice(i, 1); i--; l--;
        } else {
          args = both ? Array.prototype.slice.call(arguments, 1) : arguments;
          callback.apply(this, args);
        }
      }
    }
  }
  return this;
};

if (typeof exports !== "undefined") {
    exports.EventEmitter = EventEmitter;
}


    App.EventProxy = function (first, second, callback) {
        _.extend(this, Backbone.Events);
        var proxy = this, length = arguments.length, index = 0;
        var _deps = {};
        var args = [].slice.apply(arguments, [0, length - 1]);
        var callback = [].pop.apply(arguments, []);
        length = args.length;
        for (index = 0; index < length; index++) {
            (function (key) {
                proxy.bind(key, function (data) {
                    _deps[key] = {};
                    var flag = _deps[key];
                    flag.ready = true;
                    flag.data = data;
                });
            } (args[index]));
        }
        proxy.bind("all", function () {
            console.log("all:");
            console.log(arguments);
            var fire = true, data = [];
            for (index = 0; index < length; index++) {
                if (_deps[args[index]] && _deps[args[index]].ready) {
                    data.push(_deps[args[index]].data);
                } else {
                    fire = false;
                    break;
                }
            }
            if (fire) {
                callback.apply(null, data);
            }
        });
    };