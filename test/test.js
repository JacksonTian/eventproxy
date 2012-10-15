var assert = require('chai').assert;
var EventProxy = require('../lib/eventproxy');

describe("EventProxy", function () {
  it('create on line ways', function () {
    var counter = 0;
    var ep = EventProxy.create('event', function (data) {
      counter += 1;
      assert.deepEqual(data, 'event data');
    });
    ep.emit("event", 'event data');
    assert.equal(counter, 1, 'Counter should be incremented.');
  });

  it('bind/trigger', function () {
    var ep = EventProxy.create();
    var counter = 0;
    ep.bind("event", function (data) {
        counter += 1;
    });
    ep.trigger("event");
    assert.equal(counter, 1, 'Counter should be incremented.');
    ep.trigger("event");
    assert.equal(counter, 2, 'Counter should be incremented.');
    ep.trigger("event");
    assert.equal(counter, 3, 'Counter should be incremented.');
    ep.trigger("event");
    assert.equal(counter, 4, 'Counter should be incremented.');
  });

  it('bind, then unbind all functions', function () {
    var ep = EventProxy.create();
    var counter = 0;
    ep.bind('event', function () {
        counter += 1;
    });
    ep.trigger('event');
    assert.equal(counter, 1, 'counter should be incremented.');
    ep.unbind('event');
    ep.trigger('event');
    assert.equal(counter, 1, 'counter should have only been incremented once.');
  });

  it('once/trigger', function () {
    var ep = EventProxy.create();
    var counter = 0;
    ep.once('event', function () {
        counter += 1;
    });
    ep.trigger('event');
    assert.equal(counter, 1, 'counter should be incremented.');
    ep.trigger('event');
    assert.equal(counter, 1, 'counter should have only been incremented once.');
  });

  it('immediate', function () {
    var ep = EventProxy.create();
    var counter = 0;
    ep.immediate('event', function (){
        counter +=1;
    });
    assert.equal(counter, 1, "counter should be incremented.");
    ep.trigger('event');
    assert.equal(counter, 2, "counter should be incremented.");
  });

  it('immediate/parameter', function () {
    var ep = EventProxy.create();
    var param = new Date(), counter = 0;
    ep.immediate('event', function (data) {
        assert.equal(data, param, "data should same as param.");
        counter += 1;
    }, param);
    assert.equal(counter, 1, "counter should be incremented.");
    ep.trigger('event', param);
    assert.equal(counter, 2, "counter should be incremented.");
  });

  it('assign one event', function () {
    var ep = EventProxy.create();
    var counter = 0;
    ep.assign('event', function () {
        counter += 1;
    });
    ep.trigger('event');
    assert.equal(counter, 1, 'counter should be incremented.');
    ep.trigger('event');
    assert.equal(counter, 1, 'counter should have only been incremented once.');
  });

  it('assign two events', function () {
    var ep = EventProxy.create();
    var counter = 0;
    ep.assign('event1', 'event2', function (event1, event2) {
        assert.equal(event1, 'event1', 'counter should not be incremented.');
        assert.equal(event2, 'event2', 'counter should not be incremented.');
        counter += 1;
    });
    ep.trigger('event1', 'event1');
    assert.equal(counter, 0, 'counter should not be incremented.');
    ep.trigger('event2', 'event2');
    assert.equal(counter, 1, 'counter should be incremented.');
    ep.trigger('event2');
    assert.equal(counter, 1, 'counter should have only been incremented once.');
  });

  it('assign two events with array events', function () {
    var ep = EventProxy.create();
    var counter = 0;
    var events = ['event1', 'event2'];
    ep.assign(events, function (event1, event2) {
        assert.equal(event1, 'event1', 'counter should not be incremented.');
        assert.equal(event2, 'event2', 'counter should not be incremented.');
        counter += 1;
    });
    ep.trigger('event1', 'event1');
    assert.equal(counter, 0, 'counter should not be incremented.');
    ep.trigger('event2', 'event2');
    assert.equal(counter, 1, 'counter should be incremented.');
    ep.trigger('event2');
    assert.equal(counter, 1, 'counter should have only been incremented once.');
  });

  it('assignAlways', function () {
    var ep = EventProxy.create();
    var counter = 0;
    var event2 = null;
    ep.assignAlways('event1', 'event2', function (data1, data2) {
        counter += 1;
        assert.equal(data1, 'event1');
        assert.equal(data2, event2, 'Second data should same as event2.');
    });
    ep.trigger('event1', 'event1');
    assert.equal(counter, 0, 'counter should not be incremented.');
    event2 = "event2_1";
    ep.trigger('event2', event2);
    assert.equal(counter, 1, 'counter should be incremented.');
    event2 = "event2_2";
    ep.trigger('event2', event2);
    assert.equal(counter, 2, 'counter should be incremented.');
    ep.trigger('event3', "The event not in list");
    assert.equal(counter, 2, 'counter should not be incremented.');
  });

  it('after, n times', function () {
    var ep = EventProxy.create();
    var n = Math.round(Math.random() * 100) + 1;
    var counter = 0;
    ep.after('event', n, function (data) {
        assert.deepEqual(data.length, n);
        for(var i = 0, l = data.length; i < l; i++) {
          assert.deepEqual(data[i], i);
        }
        counter += 1;
    });
    for(var i = 0, last = n - 1; i < n; i++) {
      ep.trigger('event', i);
      if (i !== last) {
        assert.deepEqual(counter, 0, 'counter should not be incremented.');
      } else {
        assert.deepEqual(counter, 1, 'counter should be incremented.');
      }
    }
    ep.trigger('event', n);
    assert.deepEqual(counter, 1, 'counter should have only been incremented once.');
  });

  it('after, 1 time', function () {
    var ep = EventProxy.create();

    var counter = 0;
    ep.after('event', 1, function (data) {
        assert.deepEqual(data.length, 1);
        assert.deepEqual(data[0], "1 time");
        counter += 1;
    });

    ep.trigger('event', "1 time");
    assert.deepEqual(counter, 1, 'counter should have only been incremented once.');
  });

  it('after, 0 time', function () {
    var obj = new EventProxy();
    var counter = 0;
    obj.after('event', 0, function (data) {
        assert.deepEqual(data.join(","), "", 'Return array should be []');
        counter += 1;
    });
    assert.deepEqual(counter, 1, 'counter should be incremented.');
  });

  it('any', function () {
    var ep = EventProxy.create();
    var counter = 0;
    var eventData1 = "eventData1";
    var eventData2 = "eventData2";
    ep.any('event1', 'event2', function (map) {
      assert.deepEqual(map.data, eventData1, 'Return data should be evnetData1.');
      assert.deepEqual(map.eventName, "event1", 'Event name should be event1.');
      counter += 1;
    });
    ep.trigger('event1', eventData1);
    assert.deepEqual(counter, 1, 'counter should be incremented.');
    ep.trigger('event2', eventData2);
    assert.deepEqual(counter, 1, 'counter should not be incremented.');
    ep.trigger('event1', eventData1);
    assert.deepEqual(counter, 1, 'counter should not be incremented.');
  });

  it('not', function () {
    var ep = EventProxy.create();
    var counter = 0;
    ep.not('event1', function (data) {
        counter += 1;
    });
    ep.trigger('event1', 1);
    assert.deepEqual(counter, 0, 'counter should not be incremented.');
    ep.trigger('event2', 2);
    assert.deepEqual(counter, 1, 'counter should be incremented.');
    ep.trigger('event2', 2);
    assert.deepEqual(counter, 2, 'counter should be incremented.');
  });
});
