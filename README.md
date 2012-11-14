EventProxy [![Build Status](https://secure.travis-ci.org/JacksonTian/eventproxy.png)](http://travis-ci.org/JacksonTian/eventproxy)
======

> 这个世界上不存在所谓回调函数深度嵌套的问题。 —— [Jackson Tian](http://weibo.com/shyvo)

> 世界上本没有嵌套回调，写得人多了，也便有了`}}}}}}}}}}}}`。 -- [fengmk2](http://fengmk2.github.com)

* API文档: [EventProxy API Documentation](http://eventproxy.html5ify.com/jsdoc/symbols/EventProxy.html)
* jscoverage: [95%](http://fengmk2.github.com/coverage/eventproxy.html)

EventProxy 仅仅是一个很轻量的工具，但是能够带来一种事件式编程的思维变化。有几个特点：

1. 利用事件机制解耦复杂业务逻辑
2. 移除被广为诟病的深度callback嵌套问题
3. 将串行等待变成并行等待，提升多异步场景下的执行效率
4. 无平台依赖，适合前后端，能用于浏览器和Node.js

现在的，无深度嵌套的，并行的

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

过去的，深度嵌套的，串行的。

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

## For Frontend user:

### Assign once. 

The callback will be executed once when all event were fired.

```js
<script src="https://raw.github.com/JacksonTian/eventproxy/master/lib/eventproxy.js"></script>
<script>
  var render = function (template, data, l10n) {
    _.template(template, data, l10n);
  };
  var ep = EventProxy.create("template", "data", "l10n", render);
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
</script>
```

### Assign always. 

The callback will be executed first time when all event were fired. And after that, 
any event was fired will trigger callback. It's useful when you need refresh UI with newest data, e.g. stock app.

```js
<script src="https://raw.github.com/JacksonTian/eventproxy/master/lib/eventproxy.js"></script>
<script>
  var render = function (template, data, l10n) {
    _.template(template, data, l10n);
  };
  var ep = EventProxy.create();

  ep.assignAll("template", "dataUpdate", "l10n", render);
  $.get("template", function (template) {
    // something
    proxy.emit("template", template);
  });

  $.get("l10n", function (l10n) {
    // something
    proxy.emit("l10n", l10n);
  });

  // Need refresh data and UI for some realtime application.
  setInterval(function () {
    $.get("data", function (data) {
      // something
      proxy.emit("dataUpdate", data);
    });
  }, 1000);
</script>
```

## For Node.js:

```bash
$ npm install eventproxy
```

Sample code:

```js
var eventproxy = require("eventproxy");

var ep = eventproxy.create("template", "data", "l10n", function (template, data, l10n) {
  return _.template(template, data);
});

$.get("template", function (template) {
  // something
  proxy.emit("template", template);
});
$.get("data", function (data) {
  // something
  proxy.emit("data", data);
});
$.get("l10n", function (l10n) {
  // something
  proxy.emit("l10n", l10n);
});
```

## 统一处理error返回

这是来自我们实践代码总结，通过 `error` 事件统一处理所有异步请求的异常。

```js
var eventproxy = require('eventproxy');

exports.getTweet = function (userId, tweetId, callback) {
  // eventproxy.create(events, handler, errorHandler);
  var ep = eventproxy.create('user', 'tweet', 'retweets', 'friends', 'messages', 
  function (user, tweet, retweets, friends, messages) {
    user.friends = friends;
    user.messages = messages;
    tweet.user = user;
    tweet.retweets = retweets;
    callback(null, tweet);
  }, function (err) {
    callback(err);
  });

  // or you can use `ep.fail(errorHandler)` to listen 'error' event.

  twitter.get(tweetId, ep.done('tweet'));
  twitter.getRetweets(tweetId, ep.done('retweets'));
  twitter.getUser(userId, ep.done(function (user) {
    ep.emit('user', user);
    twitter.getUserFriends(user.id, ep.done('friends'));
  }));
  twitter.getUserMessages(userId, ep.done('message'));
};
```

在没使用上述方法前，我们会这样写代码:

```js
var eventproxy = require('eventproxy');

exports.getTweet = function (userId, tweetId, callback) {
  // eventproxy.create(events, handler);
  var ep = eventproxy.create('user', 'tweet', 'retweets', 'friends', 'messages', 
  function (user, tweet, retweets, friends, messages) {
    user.friends = friends;
    user.messages = messages;
    tweet.user = user;
    tweet.retweets = retweets;
    callback(null, tweet);
  });

  ep.once('error', function (err) {
    ep.unbind();
    callback(err);
  });

  twitter.get(tweetId, function (err, tweet) {
    if (err) {
      return ep.emit('error', err);
    }
    ep.emit('tweet', tweet);
  });
  twitter.getRetweets(tweetId, function (err, retweets) {
    if (err) {
      return ep.emit('error', err);
    }
    ep.emit('retweets', retweets);
  });
  twitter.getUser(userId, function (err, user) {
    if (err) {
      return ep.emit('error', err);
    }
    ep.emit('user', user);
    twitter.getUserFriends(user.id, function (err, friends) {
      if (err) {
        return ep.emit('error', err);
      }
      ep.emit('friends', friends);
    });
  });
  twitter.getUserMessages(userId, function (err, messages) {
    if (err) {
      return ep.emit('error', err);
    }
    ep.emit('messages', messages);
  });
};
```

## 注意事项

请勿使用`all`作为业务中的事件名。该事件名为保留事件。

## License 

(The MIT License)
