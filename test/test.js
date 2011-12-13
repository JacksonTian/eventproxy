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

test("EventProxy - immediate", function () {
    var obj = new EventProxy();
    var counter = 0;
    obj.immediate('event', function (){
        counter +=1;
    });
    equals(counter, 1, "counter should be incremented.");
    obj.trigger('event');
    equals(counter, 2, "counter should be incremented.");
});

test("EventProxy - immediate/parameter", function () {
    var obj = new EventProxy();
    var param = 0;
    obj.immediate('event', function (data){
        equals(data, param, "data should same as param.");
    }, param);
});

test("EventProxy - assign one event", function () {
    var obj = new EventProxy();
    var counter = 0;
    obj.assign('event', function() {
        counter += 1;
    });
    obj.trigger('event');
    equals(counter, 1, 'counter should be incremented.');
    obj.trigger('event');
    equals(counter, 1, 'counter should have only been incremented once.');
});

test("EventProxy - assign two events", function () {
    var obj = new EventProxy();
    var counter = 0;
    obj.assign('event1', 'event2', function(event1, event2) {
        equals(event1, 'event1', 'counter should not be incremented.');
        equals(event2, 'event2', 'counter should not be incremented.');
        counter += 1;
    });
    obj.trigger('event1', 'event1');
    equals(counter, 0, 'counter should not be incremented.');
    obj.trigger('event2', 'event2');
    equals(counter, 1, 'counter should be incremented.');
    obj.trigger('event2');
    equals(counter, 1, 'counter should have only been incremented once.');
});


test("EventProxy - assignAlways", function () {
    var obj = new EventProxy();
    var counter = 0;
    var event2 = null;
    obj.assignAlways('event1', 'event2', function(data1, data2) {
        counter += 1;
        equals(data2, event2, 'Second data should same as event2.');
    });
    obj.trigger('event1', 'event1');
    equals(counter, 0, 'counter should not be incremented.');
    event2 = "event2_1";
    obj.trigger('event2', event2);
    equals(counter, 1, 'counter should be incremented.');
    event2 = "event2_2";
    obj.trigger('event2', event2);
    equals(counter, 2, 'counter should be incremented.');
});

test("EventProxy - after, 5 times", function () {
    var obj = new EventProxy();
    var counter = 0;
    obj.after('event', 5, function(data) {
        equals(data.join(","), "1,2,3,4,5", 'Return array should be 1,2,3,4,5');
        counter += 1;
    });
    obj.trigger('event', 1);
    equals(counter, 0, 'counter should not be incremented.');
    obj.trigger('event', 2);
    equals(counter, 0, 'counter should not be incremented.');
    obj.trigger('event', 3);
    equals(counter, 0, 'counter should not be incremented.');
    obj.trigger('event', 4);
    equals(counter, 0, 'counter should not be incremented.');
    obj.trigger('event', 5);
    equals(counter, 1, 'counter should be incremented.');
    obj.trigger('event', 6);
    equals(counter, 1, 'counter should have only been incremented once.');
});

test("EventProxy - after, 0 time", function () {
    var obj = new EventProxy();
    var counter = 0;
    obj.after('event', 0, function(data) {
        equals(data.join(","), "", 'Return array should be []');
        counter += 1;
    });
    equals(counter, 1, 'counter should be incremented.');
});

test("EventProxy - any", function () {
    var obj = new EventProxy();
    var counter = 0;
    var eventData1 = "eventData1";
    var eventData2 = "eventData2";
    obj.any('event1', 'event2', function(map) {
        equals(map.data, eventData1, 'Return data should be evnetData1.');
        equals(map.eventName, "event1", 'Event name should be event1.');
        counter += 1;
    });
    obj.trigger('event1', eventData1);
    equals(counter, 1, 'counter should be incremented.');
    obj.trigger('event2', 2);
    equals(counter, 1, 'counter should not be incremented.');
});

test("EventProxy - not", function () {
    var obj = new EventProxy();
    var counter = 0;
    obj.not('event1', function(data) {
        counter += 1;
    });
    obj.trigger('event1', 1);
    equals(counter, 0, 'counter should not be incremented.');
    obj.trigger('event2', 2);
    equals(counter, 1, 'counter should be incremented.');
    obj.trigger('event2', 2);
    equals(counter, 2, 'counter should be incremented.');
});