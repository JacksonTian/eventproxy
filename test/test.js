var assert = require('chai').assert;
var should = require('chai').should();
var EventProxy = require('../');
var pedding = require('pedding');
var fs = require('fs');

describe("EventProxy", function () {
  describe('constructor', function () {
    it('should get an instanceOf EventProxy with new', function () {
      var ep = new EventProxy();
      ep.should.be.an.instanceOf(EventProxy);
    });

    it('should get an instanceOf EventProxy without new', function () {
      var ep = EventProxy();
      ep.should.be.an.instanceOf(EventProxy);
    });
  });

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

  it('bind, then remove all functions', function () {
    var ep = EventProxy.create();
    var counter = 0;
    ep.bind('event', function () {
        counter += 1;
    });
    ep.trigger('event');
    assert.equal(counter, 1, 'counter should be incremented.');
    ep.removeAllListeners('event');
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

  describe('after', function () {
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

    it('after/group', function (done) {
      var obj = new EventProxy();
      var input = [1, 2, 3, 4, 5];

      obj.after('event', input.length, function (output) {
        assert.deepEqual(output.join(','), input.join(','), "output should be keep sequence");
        done();
      });

      var async = function (input, callback) {
        setTimeout(function (input) {
          callback(null, input);
        }, Math.random() * 100, input);
      };

      input.forEach(function (val) {
        async(val, obj.group('event'));
      });
    });

    it('after/group with err', function (done) {
      var obj = new EventProxy();
      var input = [1, 2, 3, 4, 5];

      obj.after('event', input.length, function (output) {
        // never be excuted
      }).fail(function (err) {
        assert.equal(err.message, 'Unexpected Exception', 'message should be equal');
        done();
      });

      var async = function (input, callback) {
        setTimeout(function (input) {
          callback(new Error('Unexpected Exception'), input);
        }, Math.random() * 100, input);
      };

      input.forEach(function (val) {
        async(val, obj.group('event'));
      });
    });
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

  it('done', function () {
    var ep = EventProxy.create();
    var counter = 0;
    var done = function (num) {
      counter += num;
    };
    ep.bind('event1', ep.done(done));
    assert.deepEqual(counter, 0, 'counter should not be incremented.');
    ep.trigger('event1', null, 1);
    assert.deepEqual(counter, 1, 'counter should be incremented.');
    ep.trigger('event1', null, 2);
    assert.deepEqual(counter, 3, 'counter should be incremented.');
  });

  describe('errorHandler mode', function () {
    it('should auto handler callback error', function (done) {
      done = pedding(2, done);
      var ep = EventProxy.create('data', 'foo', 'cnodejs', function (data, foo, cnodejs) {
        throw new Error('should not call this');
      }, function (err) {
        err.message.should.equal(err.message, 'ENOENT, open \'not exist file\'');
        done();
      });
      fs.readFile(__filename, ep.done('data'));
      require('http').get({ host: 'cnodejs.org' }, function (res) {
        should.exist(res);
        res.statusCode.should.equal(200);
        ep.emit('cnodejs', res);
        done();
      });
      process.nextTick(function () {
        fs.readFile('not exist file', ep.done('foo'));
      });
    });

    it('should success callback after all event emit', function (done) {
      done = pedding(3, done);
      var ep = EventProxy.create('data', 'dirs', 'cnodejs', function (data, dirs, cnodejs) {
        should.exist(data);
        should.exist(dirs);
        should.exist(cnodejs);
        done();
      }, function (err) {
        throw new Error('should not call this');
      });
      fs.readFile(__filename, ep.done('data'));
      require('http').get({ host: 'cnodejs.org' }, function (res) {
        assert.deepEqual(res.statusCode, 200);
        ep.emit('cnodejs', res);
        done();
      });
      process.nextTick(function () {
        fs.readdir(__dirname, ep.done('dirs'));
        done();
      });
    });

    it('should success callback(err, args1, args2) after all event emit', function (done) {
      done = pedding(3, done);
      var ep = EventProxy.create('data', 'dirs', 'cnodejs', 'mockGet', 'mockGet2',
      function (data, dirs, cnodejs, getDatas, getDatas2) {
        should.exist(data);
        should.exist(dirs);
        should.exist(cnodejs);
        should.exist(getDatas);
        getDatas.should.eql(['fooqueryargs1', 'fooqueryargs2' ]).with.length(2);
        getDatas2.should.equal('fooquery2args1');
        done();
      });

      ep.fail(function (err) {
        throw new Error('should not call this');
      });

      fs.readFile(__filename, ep.done('data'));
      require('http').get({ host: 'nodejs.org' }, function (res) {
        assert.deepEqual(res.statusCode, 200);
        ep.emit('cnodejs', res);
        done();
      });

      var mockGet = function (query, callback) {
        process.nextTick(callback.bind(null, null, query + 'args1', query + 'args2'));
      };
      mockGet('fooquery', ep.done(function (a1, a2) {
        a1.should.equal('fooqueryargs1');
        a2.should.equal('fooqueryargs2');
        ep.emit('mockGet', [ a1, a2 ]);
      }));

      mockGet('fooquery2', ep.done('mockGet2'));

      process.nextTick(function () {
        fs.readdir(__dirname, ep.done('dirs'));
        done();
      });
    });

  });
});
