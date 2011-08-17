(function () {
// EventProxy
// -----------------

// A module that can be mixed in to *any object* in order to provide it with
// custom events. You may `bind` or `unbind` a callback function to an event;
// `trigger`-ing an event fires all callbacks in succession.
//
//

/**
 * @description Event Proxy.
 * @constructor EventProxy.
 * @example 
 * var render = function (template, resources) {};
 * var proxy = new EventProxy();
 * proxy.assign("template", "l10n", render);
 * proxy.trigger("template", template);
 * proxy.trigger("l10n", resources);
 */
var EventProxy = function () {
    this._callbacks = {};
    this._fired = {};
};
/**
 * @description Bind an event, specified by a string name, `ev`, to a `callback` function.
 * Passing `"all"` will bind the callback to all events fired.
 * @param {string} eventName Event name.
 * @param {function} callback Callback.
 */
EventProxy.prototype.bind = EventProxy.prototype.on = EventProxy.prototype.addListener = function(ev, callback) {
    var list  = this._callbacks[ev] || (this._callbacks[ev] = []);
    list.push(callback);
    return this;
};

/**
 * @description Remove one or many callbacks. If `callback` is null, removes all
 * callbacks for the event. If `ev` is null, removes all bound callbacks
 * for all events.
 * @param {string} eventName Event name.
 * @param {function} callback Callback.
 */
EventProxy.prototype.unbind = EventProxy.prototype.removeListener = function(ev, callback) {
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

/**
 * @description Remove all listeners.
 * It equals proxy.unbind(); Just add this API for as same as Event.Emitter.
 * @param {string} event Event name.
 */
EventProxy.prototype.removeAllListeners = function (event) {
    return this.unbind(event);
};

/**
 * @description Trigger an event, firing all bound callbacks. Callbacks are passed the
 * same arguments as `trigger` is, apart from the event name.
 * Listening for `"all"` passes the true event name as the first argument.
 * @param {string} eventName Event name.
 * @param {mix} data Pass in data. 
 */
EventProxy.prototype.emit = EventProxy.prototype.fire = EventProxy.prototype.trigger = function(eventName, data, data2) {
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

/**
 * @description Bind an event like the bind method, but will remove the listener after it was fired.
 * @param {string} ev Event name.
 * @param {function} callback Callback.
 */
EventProxy.prototype.once = function (ev, callback) {
    var self = this;
    this.bind(ev, function () {
        callback.apply(self, arguments);
        self.unbind(ev, arguments.callee);
    });
    return this;
};

/**
 * @description Assign some events, after all events were fired, the callback will be executed.
 * @param {string} eventname1 First event name.
 * @param {string} eventname2 Second event name.
 * @param {function} cb Callback, that will be called after predefined events were fired.
 * @param {string} persistent, if persistent==="persistent", this function will be persistent lick function on
 */

EventProxy.prototype.assign = function (eventname1, eventname2, cb, persistent) {
    var proxy = this, length, index = 0, callback, argsLength = arguments.length,
    lastArg = arguments[argsLength - 1],
     times=0, isOnce, events;
    // Check the arguments length.
    if(typeof lastArg === "function"){        
    	if (argsLength < 2) {
        	return this;
    	}
    	callback = lastArg;
    	isOnce = true;
    	events = [].slice.apply(arguments, [0, argsLength - 1]);
    }
    else if(lastArg === "persistent"){
    	if(argsLength < 3)
    		return this;
    	isOnce = false;
    	callback = arguments[argsLength - 2];
		if(typeof callback!=="function")
			return this;
    	events = [].slice.apply(arguments, [0, argsLength - 2]);
    }
    else{
    	return this;
    }
    // Check the callback type.
    if (typeof callback !== "function") {
        return this;
    }
    length = events.length;

    var bind = function (key) {
            proxy.once(key, function (data) {
                    proxy._fired[key] = proxy._fired[key] || {};
                    var flag = proxy._fired[key];
                    flag.data = [].slice.call(arguments, 0);
                    times++;
                });
        };
    for (index = 0; index < length; index++) {
        bind(events[index]);
    }
    var all = function () {
    	if(times<length)
    		return;
    	var data=[];
    	for(index=0; index<length; ++index){
    		if(proxy._fired[events[index]].data){
    			data.push(proxy._fired[events[index]].data);
    		}
    	}
       callback.apply(null, data);
       if(!isOnce){	//检测是否只监听一次，如果不是，则重新绑定每个事件（调用bind函数），同时times清0，不解除'all'事件的绑定。
	       for (index = 0; index < length; index++) {
	       		bind(events[index]);
	       }
	       	times = 0;
       }
       else{//反之如果只监听一次，则解除'all'事件的绑定
       		proxy.unbind("all", all);
       }
    };
    proxy.bind("all", all);
    return this;
};


// Event proxy can be used in browser and Nodejs both.
if (typeof exports !== "undefined") {
    exports.EventProxy = EventProxy;
} else {
    window.EventProxy = EventProxy;
}

}());