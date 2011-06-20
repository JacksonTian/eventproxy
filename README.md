这个世界上不存在所谓回调函数深度嵌套的问题。 —— Jackson Tian(http://weibo.com/shyvo)
---
现在的，无深度嵌套的，并行的
---
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
---
过去的，深度嵌套的，串行的。
---
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

