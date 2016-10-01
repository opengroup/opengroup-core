/**
 * Events is an object to easily add events to object.
 */
class Events {


  /**
   * @method on(type: String, fn, context?: Object): this
   * Adds a listener function (`fn`) to a particular event type of the object. You can optionally specify the context of the listener (object the this keyword will point to). You can also pass several space-separated types (e.g. `'click dblclick'`).
   *
   * @alternative
   * @method on(eventMap: Object): this
   * Adds a set of type/listener pairs, e.g. `{click: onClick, mousemove: onMouseMove}`
   */
  on (types, fn, context) {
    if (typeof types === 'object') {
      for (var type in types) {
        this._on(type, types[type], fn);
      }
  
    } else {
      types = types.trim().split(' ');
  
      for (var i = 0, len = types.length; i < len; i++) {
        this._on(types[i], fn, context);
      }
    }
  
    return this;
  }

  /**
   * @method off(type: String, fn?, context?: Object): this
   * Removes a previously added listener function. If no function is specified, it will remove all the listeners of that particular event from the object. Note that if you passed a custom context to `on`, you must pass the same context to `off` in order to remove the listener.
   *
   * @alternative
   * @method off(eventMap: Object): this
   * Removes a set of type/listener pairs.
   *
   * @alternative
   * @method off: this
   * Removes all listeners to all events on the object.
   */
  off (types, fn, context) {
    if (!types) {
      delete this._events;
    } else if (typeof types === 'object') {
      for (var type in types) {
        this._off(type, types[type], fn);
      }
    } else {
      types = types.trim().split(' ');
      for (var i = 0, len = types.length; i < len; i++) {
        this._off(types[i], fn, context);
      }
    }

    return this;
  }

  /**
   * attach listener (without syntactic sugar now)
   */
  _on (type, fn, context) {
    this._events = this._events || {};
    var typeListeners = this._events[type];
    if (!typeListeners) {
      typeListeners = [];
      this._events[type] = typeListeners;
    }

    if (context === this) {
      context = undefined;
    }
    var newListener = {fn: fn, ctx: context},
      listeners = typeListeners;

    for (var i = 0, len = listeners.length; i < len; i++) {
      if (listeners[i].fn === fn && listeners[i].ctx === context) {
        return;
      }
    }

    listeners.push(newListener);
    typeListeners.count++;
  }

  /**
   * detach listener (without syntactic sugar now)
   */
  _off (type, fn, context) {
    var listeners,
      i,
      len;

    if (!this._events) { return; }
    listeners = this._events[type];
    if (!listeners) {
      return;
    }

    if (!fn) {
      for (i = 0, len = listeners.length; i < len; i++) {
        listeners[i].fn = () => {
          return false;
        };
      }
      delete this._events[type];
      return;
    }

    if (context === this) {
      context = undefined;
    }

    if (listeners) {
      for (i = 0, len = listeners.length; i < len; i++) {
        var l = listeners[i];
        if (l.ctx !== context) { continue; }
        if (l.fn === fn) {

          l.fn = () => {
            return false;
          };

          if (this._firingCount) {
            this._events[type] = listeners = listeners.slice();
          }
          listeners.splice(i, 1);

          return;
        }
      }
    }
  }

  /**
   * @method fire(type: String, data?: Object): this
   * Fires an event of the specified type. You can optionally provide an data
   * object — the first argument of the listener function will contain its
   * properties.
   */
  fire (type, data) {
    if (!this.listens(type)) { return this; }

    if (this._events) {
      var listeners = this._events[type];

      if (listeners) {
        this._firingCount = (this._firingCount + 1) || 1;
        for (var i = 0, len = listeners.length; i < len; i++) {
          var l = listeners[i];
          l.fn.call(l.ctx || this, data);
        }

        this._firingCount--;
      }
    }

    return this;
  }

  /**
   * @method listens(type: String): Boolean
   * Returns `true` if a particular event type has any listeners attached to it.
   */
  listens (type) {
    var listeners = this._events && this._events[type];
    return (listeners && listeners.length);
  }

  /**
   * @method once(…): this
   * Behaves as [`on(…)`](#evented-on), except the listener will only get fired once and then removed.
   */
  once (types, fn, context) {

    if (typeof types === 'object') {
      for (var type in types) {
        this.once(type, types[type], fn);
      }
      return this;
    }

    var handler = this.bind(function () {
      this
      .off(types, fn, context)
      .off(types, handler, context);
    }, this);

    // add a listener that's executed once and removed after that
    return this
    .on(types, fn, context)
    .on(types, handler, context);
  }

  /**
   * Binds the event to the function.
   */
  bind (fn, obj) {
    var slice = Array.prototype.slice;

    if (fn.bind) {
      return fn.bind.apply(fn, slice.call(arguments, 1));
    }

    var args = slice.call(arguments, 2);

    return function () {
      return fn.apply(obj, args.length ? args.concat(slice.call(arguments)) : arguments);
    };
  }
}

export default Events;
