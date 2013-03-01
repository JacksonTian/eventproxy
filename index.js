module.exports = process.env.EVENTPROXY_COV ? require('./lib-cov/eventproxy') : require('./lib/eventproxy');
