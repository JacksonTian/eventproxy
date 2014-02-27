var assert = require('chai').assert;
var should = require('chai').should();
var pedding = require('pedding');

try {
  var EventProxy = require('../');
  var http = require('http');
  var fs = require('fs');
} catch (e) {
  var EventProxy = require('eventproxy');
  var http = {
    get: function (options, callback) {
      setTimeout(function () {
        callback({
          statusCode: 200
        });
      }, 0);
    }
  };
  var __filename = 'mock_file.txt';
  var fs = {
    readFile: function (filename, encode, callback) {
      if (typeof encode === 'function') {
        callback = encode;
        encode = null;
      }
      setTimeout(function () {
        if (filename === 'not exist file') {
          return callback(new Error('ENOENT, open \'not exist file\''));
        }
        callback(null, 'Foo bar baz');
      }, 10);
    }
  };
  if (typeof process === 'undefined') {
    process = Mocha.process;
    process.nextTick = function (cb) {
      setTimeout(cb, 0);
    };
  }
}

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

  it('headbind/trigger', function () {
    var ep = EventProxy.create();
    var str = '';
    ep.bind("event", function (data) {
      str += 'bind';
    });
    ep.headbind("event", function (data) {
      str += 'headbind';
    });
    ep.trigger("event");
    assert.equal(str, 'headbindbind', 'the callback that headbinded should execute first.');
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
    ep.immediate('event', function () {
      counter += 1;
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
        for (var i = 0, l = data.length; i < l; i++) {
          assert.deepEqual(data[i], i);
        }
        counter += 1;
      });
      for (var i = 0, last = n - 1; i < n; i++) {
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
        }, Math.random() * 10, input);
      };

      input.forEach(function (val) {
        async(val, obj.group('event'));
      });
    });

    it('after/group with multi parameters', function (done) {
      var obj = new EventProxy();
      var input = [1, 2, 3, 4, 5];

      obj.after('event', input.length, function (output) {
        assert.deepEqual(output.join(','), input.join(','), "output should be keep sequence");
        done();
      });

      var async = function (input, callback) {
        setTimeout(function (data1, data2) {
          callback(null, data1, data2);
        }, Math.random() * 10, input, input * 2);
      };

      input.forEach(function (val) {
        async(val, obj.group('event', function (data1, data2) {
          assert.deepEqual(data1 * 2, data2, "should have multi parameters");
          return data1;
        }));
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
        }, Math.random() * 10, input);
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

  it('done(fn)', function () {
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

  it('done(event)', function (done) {
    var ep = EventProxy.create();
    ep.bind('event1', function (data) {
      should.exist(data);
      done();
    });
    ep.bind('error', done);
    fs.readFile(__filename, ep.done('event1'));
  });

  it('done(event, fn)', function (done) {
    var ep = EventProxy.create();
    ep.bind('event1', function (data) {
      should.exist(data);
      assert.deepEqual(data, 'hehe', 'data should be modified');
      done();
    });
    ep.bind('error', done);
    fs.readFile(__filename, ep.done('event1', function (data) {
      return 'hehe';
    }));
  });

  it('done(event, fn) multi data', function (done) {
    var async = function (callback) {
      process.nextTick(function () {
        callback(null, 'data1', 'data2');
      });
    };
    var ep = EventProxy.create();
    ep.on("file", function (data) {
      should.exist(data);
      assert.deepEqual(data, 'data1data2', 'data should be modified');
      done();
    });
    ep.bind('error', done);
    async(ep.done('file', function (data1, data2) {
      return data1 + data2;
    }));
  });

  it('done(event) should emit multi args', function (done) {
    var async = function (callback) {
      process.nextTick(function () {
        callback(null, 'data1', 'data2');
      });
    };
    var ep = EventProxy.create();
    ep.on("file", function (data1, data2) {
      assert.deepEqual(data1, 'data1', 'data1 shoule be "data1"');
      assert.deepEqual(data2, 'data2', 'data1 shoule be "data2"');
      done();
    });
    ep.bind('error', done);
    async(ep.done('file'));
  });

  it('doneLater(event, fn)', function (done) {
    var ep = EventProxy.create();
    fs.readFile(__filename, "utf-8", ep.doneLater("file", function (str) {
      return 'hehe';
    }));

    ep.on("file", function (data) {
      should.exist(data);
      assert.deepEqual(data, 'hehe', 'data should be modified');
      done();
    });
    ep.bind('error', done);
  });

  it('doneLater(event, fn) multi data', function (done) {
    var async = function (callback) {
      process.nextTick(function () {
        callback(null, 'data1', 'data2');
      });
    };
    var ep = EventProxy.create();
    async(ep.doneLater('file', function (data1, data2) {
      return data1 + data2;
    }));

    ep.on("file", function (data) {
      should.exist(data);
      assert.deepEqual(data, 'data1data2', 'data should be modified');
      done();
    });
    ep.bind('error', done);
  });

  it('doneLater(event) should emit multi args', function (done) {
    var async = function (callback) {
      process.nextTick(function () {
        callback(null, 'data1', 'data2');
      });
    };
    var ep = EventProxy.create();
    async(ep.doneLater('file'));

    ep.on("file", function (data1, data2) {
      assert.deepEqual(data1, 'data1', 'data1 should be "data1"');
      assert.deepEqual(data2, 'data2', 'data2 should be "data2"');
      done();
    });
    ep.bind('error', done);
  });

  it('fail should pass multi args', function () {
    var ep = new EventProxy();
    ep.fail(function (err, arg) {
      assert.equal(arguments.length, 2, 'fail handler should get two args');
      assert.equal(err, 'custom_error');
      assert.equal(arg, 200);
    });

    ep.emit('error', 'custom_error', 200);
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
      http.get({ host: 'cnodejs.org' }, function (res) {
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
      var ep = EventProxy.create('data', 'data2', 'cnodejs', function (data, data2, cnodejs) {
        should.exist(data);
        should.exist(data2);
        should.exist(cnodejs);
        done();
      }, function (err) {
        throw new Error('should not call this');
      });
      fs.readFile(__filename, ep.done('data'));
      http.get({ host: 'cnodejs.org' }, function (res) {
        assert.deepEqual(res.statusCode, 200);
        ep.emit('cnodejs', res);
        done();
      });
      process.nextTick(function () {
        fs.readFile(__filename, ep.done('data2'));
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
      http.get({ host: 'nodejs.org' }, function (res) {
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
        fs.readFile(__filename, ep.done('dirs'));
        done();
      });
    });
  });

  describe('emit later', function () {
    function check(query, callback) {
      if (query === 'laterQuery') {
        return callback(null, true);
      }
      if (query === 'errorQuery') {
        return callback(new Error('sync error'));
      }      
      process.nextTick(callback.bind(null, null, true));
    }

    function mcheck(query, callback) {
      if (query === 'laterQuery') {
        return callback(null, true, true);
      }
      process.nextTick(callback.bind(null, null, true, false));
    }
    function mockGet(query, callback) {
      process.nextTick(callback.bind(null, null, query + 'args1'));
    }

    function mockGetSync(query, callback) {
      callback(null, query + 'args1');
    }

    it('should doneLater work fine', function (done) {
      var query = 'laterQuery';
      var ep = EventProxy.create();
      check(query, ep.doneLater('check'));

      ep.once('check', function (permission) {
        permission && mockGet(query, ep.done('mockGet'));
      });

      ep.once('mockGet', function (a1) {
        a1.should.equal('laterQueryargs1');
        done();
      });
    });

    it('should doneLater work fine when both sync', function (done) {
      var query = 'laterQuery';
      var ep = EventProxy.create();

      check(query, ep.doneLater('check'));

      ep.once('check', function (permission) {
        permission && mockGetSync(query, ep.done('mockGetSync'));
      });

      ep.once('mockGetSync', function (a1) {
        a1.should.equal('laterQueryargs1');
        done();
      });
    });

    it('should doneLater work fine when is handler', function (done) {
      var query = 'laterQuery';
      var ep = EventProxy.create();

      check(query, ep.doneLater(function (permission) {
        permission && mockGetSync(query, ep.done('mockGetSync'));
      }));

      ep.once('mockGetSync', function (a1) {
        a1.should.equal('laterQueryargs1');
        done();
      });
    });

    it('should doneLater work fine when callback(args1, args2)', function (done) {
      var query = 'laterQuery';
      var ep = EventProxy.create();

      mcheck(query, ep.doneLater(function (permission1, permission2) {
        permission1 && permission2 && mockGet(query, ep.done('mockGet'));
      }));

      ep.once('mockGet', function (a1) {
        a1.should.equal('laterQueryargs1');
        done();
      });
    });

    it('should doneLater error ok', function (done) {
      var query = 'errorQuery';
      var ep = EventProxy.create();

      check(query, ep.doneLater('check'));

      ep.fail(function (err) {
        err.message.should.equal('sync error');
        done();
      });
    });

    it('should emitLater ok', function (done) {
      var query = 'laterQuery';
      var ep = EventProxy.create();

      check(query, function (err, data) {
        if (err) {
          return ep.emitLater('error', err);
        }
        ep.emitLater('check', data);
      });

      ep.once('check', function (data) {
        data.should.be.ok;
        done();
      });
    });
  });
});
