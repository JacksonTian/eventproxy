这个世界上不存在所谓回调函数深度嵌套的问题。 —— Jackson Tian(http://weibo.com/shyvo)

---

[EventProxy API Documentation](http://eventproxy.html5ify.com/jsdoc/symbols/EventProxy.html)  

    npm install eventproxy

---
EventProxy.js仅仅是一个很轻量的工具，但是能够带来一种事件式编程的思维变化。有几个特点：

   1. 利用事件机制解耦复杂业务逻辑
   2. 移除被广为诟病的深度callback嵌套问题
   3. 将串行等待变成并行等待，提升多异步场景下的执行效率
   4. 无平台依赖，适合前后端，能用于浏览器和Node.js

现在的，无深度嵌套的，并行的

    var proxy = new EventProxy();
    var render = function (template, data, l10n){
        _.template(template, data);
    };
    proxy.assign("template", "data", "l10n", render);
    $.get("template", function (template) {
        // something
        proxy.trigger("template", template);
    });
    $.get("data", function (data) {
        // something
        proxy.trigger("data", data);
    });
    $.get("l10n", function (l10n) {
        // something
        proxy.trigger("l10n", l10n);
    });

过去的，深度嵌套的，串行的。

    var render = function (template, data){
        _.template(template, data);
    };
    $.get("template", function (template) {
        // something
        $.get("data", function (data) {
            // something
            $.get("l10n", function (l10n) {
                // something
                render(template, data);
            });
        });
    });

For Frontend user:

Assign once. The callback will be executed once when all event were fired.

    <script src="eventproxy.js"></script>
    <script>
        var proxy = new EventProxy();
        var render = function (template, data, l10n){
            _.template(template, data);
        };
        proxy.assign("template", "data", "l10n", render);
        $.get("template", function (template) {
            // something
            proxy.trigger("template", template);
        });
        $.get("data", function (data) {
            // something
            proxy.trigger("data", data);
        });
        $.get("l10n", function (l10n) {
            // something
            proxy.trigger("l10n", l10n);
        });
    </script>

Assign always. The callback will be executed first time when all event were fired. And after that, any event was fired will trigger callback. It's useful when you need refresh UI with newest data, e.g. stock app.

    <script src="eventproxy.js"></script>
    <script>
        var proxy = new EventProxy();
        var render = function (template, data, l10n){
            _.template(template, data);
        };
        proxy.assignAll("template", "dataUpdate", "l10n", render);
        $.get("template", function (template) {
            // something
            proxy.trigger("template", template);
        });

        $.get("l10n", function (l10n) {
            // something
            proxy.trigger("l10n", l10n);
        });

        // Need refresh data and UI for some realtime application.
        setInterval(function () {
            $.get("data", function (data) {
                // something
                proxy.trigger("dataUpdate", data);
            });
        }, 1000);
    </script>

For Node.js:

    var EventProxy = require("eventproxy.js").EventProxy;

    var proxy = new EventProxy();
    var render = function (template, data, l10n){
        return _.template(template, data);
    };
    proxy.assign("template", "data", "l10n", render);
    $.get("template", function (template) {
        // something
        proxy.trigger("template", template);
    });
    $.get("data", function (data) {
        // something
        proxy.trigger("data", data);
    });
    $.get("l10n", function (l10n) {
        // something
        proxy.trigger("l10n", l10n);
    });

