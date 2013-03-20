EventProxy [![Build Status](https://secure.travis-ci.org/JacksonTian/eventproxy.png)](http://travis-ci.org/JacksonTian/eventproxy)
======

> There is no so-called problem of callback function deep nesting. —— [Jackson Tian](http://weibo.com/shyvo)
> There is no nesting callback originally, more people have written, resulting in appearance `}}}}}}}}}}}}`. —— [fengmk2](http://fengmk2.github.com)

* [API Documentation](http://html5ify.com/eventproxy/api.html)
* [jscoverage 97%](http://html5ify.com/eventproxy/coverage.html)
* [Annotated Source](http://html5ify.com/eventproxy/eventproxy.html)

EventProxy is only a lightweight tool, which brings about a thinking change on event programming. There are some features:

1. Decouples complicated business nesting problems with event mechanism.
2. Removes widely criticized problem of deep callback nesting.
3. Changes serial waiting to parallel waiting, promoting executing efficiency under asynchronous collaboration sceneries.
4. Exception handling friendly.
5. No platform dependency, suitable for front as well as back, can be used by browser and Node.js
Compatible with CMD, AMD and CommonJS module environment.

Nowadays, no deep nesting, parallel:

```js
var ep = EventProxy.create("template", "data", "l10n", function (template, data, l10n) {
  _.template(template, data, l10n);
});

$.get("template", function (template) {
  // something
  ep.emit("template", template);
});
$.get("data", function (data) {
  // something
  ep.emit("data", data);
});
$.get("l10n", function (l10n) {
  // something
  ep.emit("l10n", l10n);
});
```

Past, deep nesting, serial:

```js
var render = function (template, data) {
  _.template(template, data);
};
$.get("template", function (template) {
  // something
  $.get("data", function (data) {
    // something
    $.get("l10n", function (l10n) {
      // something
      render(template, data, l10n);
    });
  });
});
```

## Installation

### For Node
Install with NPM:

```
$ npm install eventproxy
```

Invoke:

```
var EventProxy = require('eventproxy');
```

### For browser
Following examples direct resource address of Github, and you can also download resource files to your own projects. Comments in all files are completely, 500 lines in total including comments and blank line. To ensure the easy nesting of EventProxy, the project proves no compressed version. Users can use Uglify, YUI Compressor or Google Closure Complier to compress.

#### Common Environment
Available after nesting script:

```html
<script src="https://raw.github.com/JacksonTian/eventproxy/master/lib/eventproxy.js"></script>
```

Usage:

```js
// EventProxy is a global variables now
var ep = new EventProxy();
```

#### For SeaJS
Only need to configure alias, and then requires citation.

```js
// Configuration
seajs.config({
  alias: {
    eventproxy: 'https://raw.github.com/JacksonTian/eventproxy/master/lib/eventproxy.js'
  }
});
// Usage
seajs.use(['eventproxy'], function (EventProxy) {
  // TODO
});
// or
define('test', function (require, exports, modules) {
  var EventProxy = require('eventproxy');
});
```

#### For RequireJS
RequireJs implemented AMD specifications

```js
// Configure path
require.config({
  paths: {
    eventproxy: "https://raw.github.com/JacksonTian/eventproxy/master/lib/eventproxy.js"
  }
});
// Use
require(["eventproxy"], function (EventProxy) {
  // TODO
});
```

## Asynchronous collaboration
#### Multiple type asynchronous collaboration
Taking page rendering for example, template and data are needed when rendering pages. Suppose both need to read asynchronously.

```js
var ep = new EventProxy();
ep.all('tpl', 'data', function (tpl, data) {
  // Executed when all specified events are fired.
  // Parameters corresponds with each event name  
});
fs.readFile('template.tpl', 'utf-8', function (err, content) {
  ep.emit('tpl', content);
});
db.get('some sql', function (err, result) {
  ep.emit('data', result);
});
```

`all` methods will register handler to events combination. When more than one registered events are fired, handler will be invoked, transferred data of each event will be transferred to handler as parameters in the order of event names.

#### Shortcut
EventProxy has provided static method, fast finishing registering all event.

```js
var ep = EventProxy.create('tpl', 'data', function (tpl, data) {
  // TODO
});
```

Method above equals to: 

```js
var ep = new EventProxy();
ep.all('tpl', 'data', function (tpl, data) {
  // TODO
});
```

### Repeatly asynchronous collaboration
Take reading all files under a folder for example, in asynchronous operation, we need execute some operations after all asynchronous invokes.

```js
var ep = new EventProxy();
ep.after('got_file', files.length, function (list) {
  // Executed after all asynchronous executions on files finish.
  //All file contents are saved in list arrays. });
for (var i = 0; i < files.length; i++) {
  fs.readFile(files[i], 'utf-8', function (err, content) {
    // Fire result event
    ep.emit('got_file', content);
  });
}
```

`after` method suitable for repeat operations, such as reading 10 files, accessing database for 5 times. Registers handler on the fire of N times same event. When reaches the specified fire times, handler will be invoked, data from each fire will be saved as array and transferred as parameters in the fire orders.

### Continuous asynchronous collaboration
Taking stocks for example, data and templates are got asynchronously, while data will continuously be refreshed, view will need to be refreshed over again.

```
var ep = new EventProxy();
ep.tail('tpl', 'data', function (tpl, data) {
  // Executed when all specified events are fired.
  // Parameters correspond with latest data of each event name
 });
fs.readFile('template.tpl', 'utf-8', function (err, content) {
  ep.emit('tpl', content);
});
setInterval(function () {
  db.get('some sql', function (err, result) {
    ep.emit('data', result);
  });
}, 2000);
```

`tail` is similar to `all` method, which is also registered on event combination. The difference is, when specified events are all fired, if events are continuously fired, handler will be invoked after each event fire, which is like a tail.

## Basic Events
The realization of asynchronous collaboration through event is the main highlight of EventProxy. Besides, it is a basic event lib, with basic APIs as follows:

- `on`/`addListener`,  binding on event listener
- `emit`, fire event
- `once`, binding on event listener that only execute once
- `removeListener`, remove event listener
- `removeAllListeners`, remove single event or all event listeners

To consider developers of each environment, most of the methods above have alias names.

- YUI3 users, you should know `subscribe` and `fire` correspond with `on`/`addlistener` and `emit`.
- jQuery users, trigger corresponds with `emit`, `bind` corresponds with `on`/`addlistener`.
- `removeListener` and `removeAllListeners` are aliased by `unbind`.

So choose your favorite API under your environment.

More API descriptions please access [API Docs](http://html5ify.com/eventproxy/api.html).

## Exception Handling
In asynchronous method, actually, exception handling needs rather certain energy. During past times, we’ve dealt through adding error event, code as follows:

```
exports.getContent = function (callback) {
 var ep = new EventProxy();
  ep.all('tpl', 'data', function (tpl, data) {
    // Successfully callback
    callback(null, {
      template: tpl,
      data: data
    });
  });
  // Listen to error event
  ep.bind('error', function (err) {
    // Redmove all handlers
    ep.unbind();
    // Exception callback
    callback(err);
  });
  fs.readFile('template.tpl', 'utf-8', function (err, content) {
    if (err) {
      // Once exception occurs, hand to error handler to deal
      return ep.emit('error', err);
    }
    ep.emit('tpl', content);
  });
  db.get('some sql', function (err, result) {
    if (err) {
       // Once exception occurs, hand to error handler to deal
      return ep.emit('error', err);
    }
    ep.emit('data', result);
  });
};
```

Code lines ascends much for exception handling. After times of practice by EventProxy, we have provided optimized exception handling methods.

```js
exports.getContent = function (callback) {
 var ep = new EventProxy();
  ep.all('tpl', 'data', function (tpl, data) {
    // Successfully callback
    callback(null, {
      template: tpl,
      data: data
    });
  });
  // Adding error handler
  ep.fail(callback);

  fs.readFile('template.tpl', 'utf-8', ep.done('tpl'));
  db.get('some sql', ep.done('data'));
};
```

After code optimization above, business developers almost don’t have to care about exception handling. Code lines descend apparently. Some developers may not be assured about code converts here. The secret lies in method of fail and done.

### Amazing `fail`

```js
ep.fail(callback);
// For the same parameters account, it is actually:
ep.fail(function (err) {
  callback(err);
});

// Equals to
ep.bind('error', function (err) {
  // Remove all handler
  ep.unbind();
  // Exception callback
  callback(err);
});
```

`fail` method listens to `error` event, removes all handlers by default, then invoke callback method.

### Amazing `done`
ep.done('tpl');
// Equals to
function (err, content) {
  if (err) {
    // Once exception occurs, hand to error event handler to deal
    return ep.emit('error', err);
  }
  ep.emit('tpl', content);
}
In node best practice, the first parameter of callback function must be an error object. Error event will be fired after detecting exception. The remaining parameters will fire events and be transferred to correspond handler to deal.

#### `done` accept callback also
The method of `done` accepts callback function excepts event names. If it is function, it will remove the remaining parameters after the first `error` object(it is `null`), transfers to the callback function as parameters. The callback function will not need to consider exception handling.

```js
ep.done(function (content) {
  // No need to consider exception handling again
});
```

### Amazing `group`
`fail` can help to handle exception in `after` except the `all` method. Besides, in the callback of after, the order of result is related to the order of emit used by user. In order to get return results in the order of calling asynchronous invoke, EventProxy provides the group method.

```
var ep = new EventProxy();
ep.after('got_file', files.length, function (list) {
  // Executes after all file asynchronous executions
  // All file contents are saved in list arrays, in order
});
for (var i = 0; i < files.length; i++) {
  fs.readFile(files[i], 'utf-8', ep.group('got_file'));
}
```

The `group` method follows the done method design, including exception transferring. At the same time, it implies number for the return results, return results in order when finishes.

```js
ep.group('got_file');
// Similar equals to
function (err, data) {
  if (err) {
    return ep.emit('error', err);
  }
  ep.emit('got_file', data);
};
```

When callback data needs to process, adding callback function on the `group` method, only return result data after processing.

```
ep.group('got_file', function (data) {
  // some code
  return data;
});
```

## Attentions
- Do not using `all` as event name in business. The event stays as reserved event.
- In exception handling part, please follow the best practice of Node(The first parameter of callback is exception).

## [Contributors](https://github.com/JacksonTian/eventproxy/graphs/contributors)
Thanks to EventProxy users, enjoy using EventProxy, as well as feeding back much.

```bash
project  : eventproxy
 repo age : 1 year, 10 months
 active   : 58 days
 commits  : 136
 files    : 18
 authors  : 
   123  Jackson Tian            90.4%
     6  fengmk2                 4.4%
     4  dead-horse              2.9%
     1  haoxin                  0.7%
     1  redky                   0.7%
     1  yaoazhen                0.7%

```

## License 

[The MIT License](https://github.com/JacksonTian/eventproxy/blob/master/MIT-License). Please enjoy open source.
