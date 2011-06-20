这个世界上不存在所谓的嵌套回调函数过多的问题。——Jackson Tian(http://weibo.com/shyvo)
---
    var proxy = new EventProxy();
    var render = function (template, data){
        _.template(template, data);
    };
    proxy.assign("template", "data", render);
    $.get("template", function (template) {
        proxy.trigger("template", template);
    });
    $.get("data", function (data) {
        proxy.trigger("data", data);
    });
