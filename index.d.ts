type Callback0 = () => any;
type Callback1<T1> = (arg1: T1) => any;
type Callback2<T1, T2> = (arg1: T1, arg2: T2) => any;
type Callback3<T1, T2, T3> = (arg1: T1, arg2: T2, arg3: T3) => any;
type Callback4<T1, T2, T3, T4> = (arg1: T1, arg2: T2, arg3: T3, arg4: T4) => any;
type Callback5<T1, T2, T3, T4, T5> = (arg1: T1, arg2: T2, arg3: T3,
  arg4: T4, arg5: T5) => any;
type Callback6Rest<T1, T2, T3, T4, T5, T6> = (arg1: T1, arg2: T2, arg3: T3,
  arg4: T4, arg5: T5, arg6: T6,
  ...rest: any[]) => any;
type ErrorHandler<T> = (error: Error, arg: T) => any
type ErrorHandler2<T1, T2> = (error: Error, arg1: T1, arg2: T2) => any
type ErrorHandler3<T1, T2, T3> = (error: Error, arg1: T1, arg2: T2, arg3: T3) => any
type ErrorHandler4<T1, T2, T3, T4> = (error: Error, arg1: T1, arg2: T2, arg3: T3,
  arg4: T4) => any
type ErrorHandler5<T1, T2, T3, T4, T5> = (error: Error, arg1: T1, arg2: T2, arg3: T3,
  arg4: T4, arg5: T5) => any
type ErrorHandler6Rest<T1, T2, T3, T4, T5, T6> = (error: Error, arg1: T1, arg2: T2, arg3: T3,
  arg4: T4, arg5: T5, arg6: T6, ...rest: any[]) => any

export class EventProxy {
  /**
   * Create a new EventProxy
   * Examples:
   * ```js
   * var ep = EventProxy.create();
   * ep.assign('user', 'articles', function(user, articles) {
   *   // do something...
   * });
   * // or one line ways: Create EventProxy and Assign
   * var ep = EventProxy.create('user', 'articles', function(user, articles) {
   *   // do something...
   * });
   * ```
   * @return {EventProxy} EventProxy instance
   */
  static create(): EventProxy
  static create<T1>(ev1: string, callback: Callback1<T1>,
    errorHandler?: ErrorHandler<T1>): EventProxy
  static create<T1, T2>(ev1: string, ev2: string, callback: Callback2<T1, T2>,
    errorHandler?: ErrorHandler<T1 | T2>): EventProxy
  static create<T1, T2, T3>(ev1: string, ev2: string, ev3: string,
    callback: Callback3<T1, T2, T3>, errorHandler?: ErrorHandler<T1 | T2 | T3>): EventProxy
  static create<T1, T2, T3, T4>(ev1: string, ev2: string, ev3: string, ev4: string,
    callback: Callback4<T1, T2, T3, T4>, errorHandler?: ErrorHandler<T1 | T2 | T3 | T4>): EventProxy
  static create<T1, T2, T3, T4, T5>(ev1: string, ev2: string, ev3: string, ev4: string, ev5: string,
    callback: Callback5<T1, T2, T3, T4, T5>, errorHandler?: ErrorHandler<T1 | T2 | T3 | T4 | T5>): EventProxy
  static create<T1, T2, T3, T4, T5, T6>(ev1: string, ev2: string, ev3: string, ev4: string, ev5: string, ev6: string,
    ...rest: (string | ErrorHandler<any> | Callback6Rest<T1, T2, T3, T4, T5, T6>)[]): EventProxy

  /**
   * Bind an event, specified by a string name, `ev`, to a `callback` function.
   * Passing __ALL_EVENT__ will bind the callback to all events fired.
   * Examples:
   * ```js
   * var proxy = new EventProxy();
   * proxy.addListener("template", function (event) {
   *   // TODO
   * });
   * ```
   * @param {string} eventname Event name.
   * @param {Function} callback Callback.
   */
  addListener<T>(event: string, callback: Callback1<T>): this
  addListener<T1, T2>(event: string, callback: Callback2<T1, T2>): this
  addListener<T1, T2, T3>(event: string, callback: Callback3<T1, T2, T3>): this
  addListener<T1, T2, T3, T4>(event: string, callback: Callback4<T1, T2, T3, T4>): this
  addListener<T1, T2, T3, T4, T5>(event: string, callback: Callback5<T1, T2, T3, T4, T5>): this
  addListener<T1, T2, T3, T4, T5, T6>(event: string, callback: Callback6Rest<T1, T2, T3, T4, T5, T6>): this

  /**
   * `addListener` alias, `bind`
   */
  bind<T>(event: string, callback: Callback1<T>): this
  bind<T1, T2>(event: string, callback: Callback2<T1, T2>): this
  bind<T1, T2, T3>(event: string, callback: Callback3<T1, T2, T3>): this
  bind<T1, T2, T3, T4>(event: string, callback: Callback4<T1, T2, T3, T4>): this
  bind<T1, T2, T3, T4, T5>(event: string, callback: Callback5<T1, T2, T3, T4, T5>): this
  bind<T1, T2, T3, T4, T5, T6>(event: string, callback: Callback6Rest<T1, T2, T3, T4, T5, T6>): this

  /**
   * `addListener` alias, `on`
   */
  on<T>(event: string, callback: Callback1<T>): this
  on<T1, T2>(event: string, callback: Callback2<T1, T2>): this
  on<T1, T2, T3>(event: string, callback: Callback3<T1, T2, T3>): this
  on<T1, T2, T3, T4>(event: string, callback: Callback4<T1, T2, T3, T4>): this
  on<T1, T2, T3, T4, T5>(event: string, callback: Callback5<T1, T2, T3, T4, T5>): this
  on<T1, T2, T3, T4, T5, T6>(event: string, callback: Callback6Rest<T1, T2, T3, T4, T5, T6>): this

  /**
   * `addListener` alias, `subscribe`
   */
  subscribe<T>(event: string, callback: Callback1<T>): this
  subscribe<T1, T2>(event: string, callback: Callback2<T1, T2>): this
  subscribe<T1, T2, T3>(event: string, callback: Callback3<T1, T2, T3>): this
  subscribe<T1, T2, T3, T4>(event: string, callback: Callback4<T1, T2, T3, T4>): this
  subscribe<T1, T2, T3, T4, T5>(event: string, callback: Callback5<T1, T2, T3, T4, T5>): this
  subscribe<T1, T2, T3, T4, T5, T6>(event: string, callback: Callback6Rest<T1, T2, T3, T4, T5, T6>): this

  /**
   * Bind an event, but put the callback into head of all callbacks.
   * @param {String} eventname Event name.
   * @param {Function} callback Callback.
   */
  headbind<T>(event: string, callback: Callback1<T>): this
  headbind<T1, T2>(event: string, callback: Callback2<T1, T2>): this
  headbind<T1, T2, T3>(event: string, callback: Callback3<T1, T2, T3>): this
  headbind<T1, T2, T3, T4>(event: string, callback: Callback4<T1, T2, T3, T4>): this
  headbind<T1, T2, T3, T4, T5>(event: string, callback: Callback5<T1, T2, T3, T4, T5>): this
  headbind<T1, T2, T3, T4, T5, T6>(event: string, callback: Callback6Rest<T1, T2, T3, T4, T5, T6>): this

  /**
   * Remove one or many callbacks.
   *
   * - If `callback` is null, removes all callbacks for the event.
   * - If `eventname` is null, removes all bound callbacks for all events.
   * @param {String} eventname Event name.
   * @param {Function} callback Callback.
   */
  removeEventListener(event?: string, callback?: Function): this

  /**
   * `removeListener` alias, unbind
   */
  unbind(event?: string, callback?: Function): this

  /**
   * Remove all listeners. It equals unbind()
   * Just add this API for as same as Event.Emitter.
   * @param {String} event Event name.
   */
  removeAllListeners(event: string)

  /**
   * Bind the ALL_EVENT event
   */
  bindForAll(callback: Function)

  /**
   * Unbind the ALL_EVENT event
   */
  unbindForAll(callback: Function)

  /**
   * Trigger an event, firing all bound callbacks. Callbacks are passed the
   * same arguments as `trigger` is, apart from the event name.
   * Listening for `"all"` passes the true event name as the first argument.
   * @param {String} eventname Event name
   * @param {Mix} data Pass in data
   */
  trigger(event: string)
  trigger<T1>(event: string, arg: T1)
  trigger<T1, T2>(event: string, arg1: T1, arg2: T2)
  trigger<T1, T2, T3>(event: string, arg1: T1, arg2: T2, arg3: T3)
  trigger<T1, T2, T3, T4>(event: string, arg1: T1, arg2: T2, arg3: T3, arg4: T4)
  trigger<T1, T2, T3, T4, T5>(event: string, arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5)
  trigger<T1, T2, T3, T4, T5, T6>(event: string, arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5,
    arg6: T6, ...rest: any[])

  /**
   * `trigger` alias, `emit`
   */
  emit(event: string)
  emit<T1>(event: string, arg: T1)
  emit<T1, T2>(event: string, arg1: T1, arg2: T2)
  emit<T1, T2, T3>(event: string, arg1: T1, arg2: T2, arg3: T3)
  emit<T1, T2, T3, T4>(event: string, arg1: T1, arg2: T2, arg3: T3, arg4: T4)
  emit<T1, T2, T3, T4, T5>(event: string, arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5)
  emit<T1, T2, T3, T4, T5, T6>(event: string, arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5,
    arg6: T6, ...rest: any[])

  /**
   * `trigger` alias, `fire`
   */
  fire(event: string)
  fire<T1>(event: string, arg: T1)
  fire<T1, T2>(event: string, arg1: T1, arg2: T2)
  fire<T1, T2, T3>(event: string, arg1: T1, arg2: T2, arg3: T3)
  fire<T1, T2, T3, T4>(event: string, arg1: T1, arg2: T2, arg3: T3, arg4: T4)
  fire<T1, T2, T3, T4, T5>(event: string, arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5)
  fire<T1, T2, T3, T4, T5, T6>(event: string, arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5,
    arg6: T6, ...rest: any[])

  /**
   * Bind an event like the bind method, but will remove the listener after it was fired.
   * @param {String} ev Event name
   * @param {Function} callback Callback
   */
  once<T>(event: string, callback: Callback1<T>): this
  once<T1, T2>(event: string, callback: Callback2<T1, T2>): this
  once<T1, T2, T3>(event: string, callback: Callback3<T1, T2, T3>): this
  once<T1, T2, T3, T4>(event: string, callback: Callback4<T1, T2, T3, T4>): this
  once<T1, T2, T3, T4, T5>(event: string, callback: Callback5<T1, T2, T3, T4, T5>): this
  once<T1, T2, T3, T4, T5, T6>(event: string, callback: Callback6Rest<T1, T2, T3, T4, T5, T6>): this

  /**
   * emitLater
   * make emit async
   */
  emitLater<T>(event: string, callback: Callback1<T>): void
  emitLater<T1, T2>(event: string, callback: Callback2<T1, T2>): void
  emitLater<T1, T2, T3>(event: string, callback: Callback3<T1, T2, T3>): void
  emitLater<T1, T2, T3, T4>(event: string, callback: Callback4<T1, T2, T3, T4>): void
  emitLater<T1, T2, T3, T4, T5>(event: string, callback: Callback5<T1, T2, T3, T4, T5>): void
  emitLater<T1, T2, T3, T4, T5, T6>(event: string, callback: Callback6Rest<T1, T2, T3, T4, T5, T6>): void

  /**
   * Bind an event, and trigger it immediately.
   * @param {String} ev Event name.
   * @param {Function} callback Callback.
   * @param {Mix} data The data that will be passed to calback as arguments.
   */
  immediate<T>(event: string, callback: Callback1<T>, data: T): this

  /**
   * `immediate` alias, `asap`
   */
  asap<T>(event: string, callback: Callback1<T>, data: T): this

  /**
   * Assign some events, after all events were fired, the callback will be executed once.
   *
   * Examples:
   * ```js
   * proxy.all(ev1, ev2, callback);
   * proxy.all([ev1, ev2], callback);
   * proxy.all(ev1, [ev2, ev3], callback);
   * ```
   * @param {String} eventname1 First event name.
   * @param {String} eventname2 Second event name.
   * @param {Function} callback Callback, that will be called after predefined events were fired.
   */
  all(event1: string | string[], event2: string | string[], callback: Function)
  all(event: string[] | string, callback: Function)

  /**
   * `all` alias
   */
  assign(event1: string | string[], event2: string | string[], callback: Function)
  assign(event: string[] | string, callback: Function)

  /**
   * Assign the only one 'error' event handler.
   * @param {Function(err)} callback
   */
  fail<T>(callback: ErrorHandler<T>)
  fail<T1, T2>(callback: ErrorHandler2<T1, T2>)
  fail<T1, T2, T3>(callback: ErrorHandler3<T1, T2, T3>)
  fail<T1, T2, T3, T4>(callback: ErrorHandler4<T1, T2, T3, T4>)
  fail<T1, T2, T3, T4, T5>(callback: ErrorHandler5<T1, T2, T3, T4, T5>)
  fail<T1, T2, T3, T4, T5, T6>(callback: ErrorHandler6Rest<T1, T2, T3, T4, T5, T6>)

  /**
   * A shortcut of ep#emit('error', err)
   */
  throw(...args: any[])

  /**
   * Assign some events, after all events were fired, the callback will be executed first time.
   * Then any event that predefined be fired again, the callback will executed with the newest data.
   * Examples:
   * ```js
   * proxy.tail(ev1, ev2, callback);
   * proxy.tail([ev1, ev2], callback);
   * proxy.tail(ev1, [ev2, ev3], callback);
   * ```
   * @param {String} eventname1 First event name.
   * @param {String} eventname2 Second event name.
   * @param {Function} callback Callback, that will be called after predefined events were fired.
   */
  tail(event1: string | string[], event2: string | string[], callback: Function)
  tail(event: string[] | string, callback: Function)

  /**
   * `tail` alias, assignAll
   */
  assignAll(event1: string | string[], event2: string | string[], callback: Function)
  assignAll(event: string[] | string, callback: Function)

  /**
   * `tail` alias, assignAlways
   */
  assignAlways(event1: string | string[], event2: string | string[], callback: Function)
  assignAlways(event: string[] | string, callback: Function)

  /**
   * The callback will be executed after the event be fired N times.
   * @param {String} eventname Event name.
   * @param {Number} times N times.
   * @param {Function} callback Callback, that will be called after event was fired N times.
   */
  after<T>(event: string, times: number, callback: Callback1<T>): this
  after<T1, T2>(event: string, times: number, callback: Callback2<T1, T2>): this
  after<T1, T2, T3>(event: string, times: number, callback: Callback3<T1, T2, T3>): this
  after<T1, T2, T3, T4>(event: string, times: number, callback: Callback4<T1, T2, T3, T4>): this
  after<T1, T2, T3, T4, T5>(event: string, times: number, callback: Callback5<T1, T2, T3, T4, T5>): this
  after<T1, T2, T3, T4, T5, T6>(event: string, times: number, callback: Callback6Rest<T1, T2, T3, T4, T5, T6>): this

  /**
   * The `after` method's helper. Use it will return ordered results.
   * If you need manipulate result, you need callback
   * Examples:
   * ```js
   * var ep = new EventProxy();
   * ep.after('file', files.length, function (list) {
   *   // Ordered results
   * });
   * for (var i = 0; i < files.length; i++) {
   *   fs.readFile(files[i], 'utf-8', ep.group('file'));
   * }
   * ```
   * @param {String} eventname Event name, shoule keep consistent with `after`.
   * @param {Function} callback Callback function, should return the final result.
   */
  group(event: string)
  group<T1>(event: string, callback: Callback1<T1>): ErrorHandler<T1>
  group<T1, T2>(event: string, callback: Callback2<T1, T2>): ErrorHandler2<T1, T2>
  group<T1, T2, T3>(event: string, callback: Callback3<T1, T2, T3>): ErrorHandler3<T1, T2, T3>
  group<T1, T2, T3, T4>(event: string, callback: Callback4<T1, T2, T3, T4>): ErrorHandler4<T1, T2, T3, T4>
  group<T1, T2, T3, T4, T5>(event: string, callback: Callback5<T1, T2, T3, T4, T5>): ErrorHandler5<T1, T2, T3, T4, T5>
  group<T1, T2, T3, T4, T5, T6>(event: string, callback: Callback6Rest<T1, T2, T3, T4, T5, T6>)
    : ErrorHandler6Rest<T1, T2, T3, T4, T5, T6>

  /**
   * The callback will be executed after any registered event was fired. It only executed once.
   * @param {String} eventname1 Event name.
   * @param {String} eventname2 Event name.
   * @param {Function} callback The callback will get a map that has data and eventname attributes.
   */
  any<T1>(ev1: string, callback: Callback1<T1>)
  any<T1, T2>(ev1: string, ev2: string, callback: Callback2<T1, T2>)
  any<T1, T2, T3>(ev1: string, ev2: string, ev3: string, callback: Callback3<T1, T2, T3>)
  any<T1, T2, T3, T4>(ev1: string, ev2: string, ev3: string, ev4: string, callback: Callback4<T1, T2, T3, T4>)
  any<T1, T2, T3, T4, T5>(ev1: string, ev2: string, ev3: string, ev4: string, ev5: string,
    callback: Callback5<T1, T2, T3, T4, T5>)
  any<T1, T2, T3, T4, T5, T6>(ev1: string, ev2: string, ev3: string, ev4: string, ev5: string, ev6: string,
    ...rest: (string | Callback6Rest<T1, T2, T3, T4, T5, T6>)[])

  /**
   * The callback will be executed when the event name not equals with assigned event.
   * @param {String} eventname Event name.
   * @param {Function} callback Callback.
   */
  not(event: string, callback: Function)

  /**
   * Success callback wrapper, will handler err for you.
   *
   * ```js
   * fs.readFile('foo.txt', ep.done('content'));
   *
   * // equal to =>
   *
   * fs.readFile('foo.txt', function (err, content) {
   *   if (err) {
   *     return ep.emit('error', err);
   *   }
   *   ep.emit('content', content);
   * });
   * ```
   *
   * ```js
   * fs.readFile('foo.txt', ep.done('content', function (content) {
   *   return content.trim();
   * }));
   *
   * // equal to =>
   *
   * fs.readFile('foo.txt', function (err, content) {
   *   if (err) {
   *     return ep.emit('error', err);
   *   }
   *   ep.emit('content', content.trim());
   * });
   * ```
   * @param {Function|String} handler, success callback or event name will be emit after callback.
   * @return {Function}
   */
  done(handler: Function | string, callback?: Function)

  /**
   * make done async
   * @return {Function} delay done
   */
  doneLater(handler: Function | string, callback?: Function)
}

export default EventProxy
