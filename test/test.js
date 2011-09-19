test("EventProxy - bind/trigger", function() {
    var obj = new EventProxy();
    var counter = 0;
    obj.bind("event", function(data) {
        counter += 1;
    });
    obj.trigger("event");
    equals(counter, 1, 'Counter should be incremented.');
    obj.trigger("event");
    equals(counter, 2, 'Counter should be incremented.');
    obj.trigger("event");
    equals(counter, 3, 'Counter should be incremented.');
    obj.trigger("event");
    equals(counter, 4, 'Counter should be incremented.');
});

test("EventProxy - bind, then unbind all functions", function () {
    var obj = new EventProxy();
    var counter = 0;
    obj.bind('event', function() {
        counter += 1;
    });
    obj.trigger('event');
    equals(counter, 1, 'counter should be incremented.');
    obj.unbind('event');
    obj.trigger('event');
    equals(counter, 1, 'counter should have only been incremented once.');
});

test("EventProxy - once/trigger", function () {
    var obj = new EventProxy();
    var counter = 0;
    obj.once('event', function() {
        counter += 1;
    });
    obj.trigger('event');
    equals(counter, 1, 'counter should be incremented.');
    obj.trigger('event');
    equals(counter, 1, 'counter should have only been incremented once.');
});

test("EventProxy - assign one event", function () {
    var obj = new EventProxy();
    var counter = 0;
    obj.assign('event', function() {
        counter += 1;
    });
    obj.trigger('event');
    equals(counter, 1, 'counter should be incremented.');
});

test("EventProxy - assign two events", function () {
    var obj = new EventProxy();
    var counter = 0;
    obj.assign('event1', 'event2', function() {
        counter += 1;
    });
    obj.trigger('event1');
    equals(counter, 0, 'counter should not be incremented.');
    obj.trigger('event2');
    equals(counter, 1, 'counter should be incremented.');
    obj.trigger('event2');
    equals(counter, 1, 'counter should have only been incremented once.');
});


test("EventProxy - assignAlways", function () {
    var obj = new EventProxy();
    var counter = 0;
    obj.assignAlways('event1', 'event2', function() {
        counter += 1;
    });
    obj.trigger('event1');
    equals(counter, 0, 'counter should not be incremented.');
    obj.trigger('event2');
    equals(counter, 1, 'counter should be incremented.');
    obj.trigger('event2');
    equals(counter, 2, 'counter should be incremented.');
});

test("EventProxy - after, 5 times", function () {
    var obj = new EventProxy();
    var counter = 0;
    obj.after('event', 5, function() {
        counter += 1;
    });
    obj.trigger('event');
    equals(counter, 0, 'counter should not be incremented.');
    obj.trigger('event');
    equals(counter, 0, 'counter should not be incremented.');
    obj.trigger('event');
    equals(counter, 0, 'counter should not be incremented.');
    obj.trigger('event');
    equals(counter, 0, 'counter should not be incremented.');
    obj.trigger('event');
    equals(counter, 1, 'counter should be incremented.');
    obj.trigger('event');
    equals(counter, 1, 'counter should have only been incremented once.');
});