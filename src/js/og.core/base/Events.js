/**
 * Events is an object to easily add events to object.
 */
class Events {


  /* @method on(type: String, fn: Function, context?: Object): this
   * Adds a listener function (`fn`) to a particular event type of the object. You can optionally specify the context of the listener (object the this keyword will point to). You can also pass several space-separated types (e.g. `'click dblclick'`).
   *
   * @alternative
   * @method on(eventMap: Object): this
   * Adds a set of type/listener pairs, e.g. `{click: onClick, mousemove: onMouseMove}`
   */
  on (types, fn, context) {

    // types can be a map of types/handlers
    if (typeof types === 'object') {
      for (var type in types) {
        // we don't process space-separated events here for performance;
        // it's a hot path since Layer uses the on(obj) syntax
        this._on(type, types[type], fn);
      }

    } else {
      // types can be a string of space-separated words
      types = types.trim().split(/\s+/);

      for (var i = 0, len = types.length; i < len; i++) {
        this._on(types[i], fn, context);
      }
    }

    return this;
  }

  /* @method off(type: String, fn?: Function, context?: Object): this
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
      // clear all listeners if called without arguments
      delete this._events;

    } else if (typeof types === 'object') {
      for (var type in types) {
        this._off(type, types[type], fn);
      }

    } else {
      types = types.trim().split(/\s+/);

      for (var i = 0, len = types.length; i < len; i++) {
        this._off(types[i], fn, context);
      }
    }

    return this;
  }

  // attach listener (without syntactic sugar now)
  _on (type, fn, context) {
    this._events = this._events || {};

    /* get/init listeners for type */
    var typeListeners = this._events[type];
    if (!typeListeners) {
      typeListeners = [];
      this._events[type] = typeListeners;
    }

    if (context === this) {
      // Less memory footprint.
      context = undefined;
    }
    var newListener = {fn: fn, ctx: context},
      listeners = typeListeners;

    // check if fn already there
    for (var i = 0, len = listeners.length; i < len; i++) {
      if (listeners[i].fn === fn && listeners[i].ctx === context) {
        return;
      }
    }

    listeners.push(newListener);
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
      // Set all removed listeners to noop so they are not called if remove happens in fire
      for (i = 0, len = listeners.length; i < len; i++) {
        listeners[i].fn = function () { return false; };
      }
      // clear all listeners for a type if function isn't specified
      delete this._events[type];
      return;
    }

    if (context === this) {
      context = undefined;
    }

    if (listeners) {

      // find fn and remove it
      for (i = 0, len = listeners.length; i < len; i++) {
        var l = listeners[i];
        if (l.ctx !== context) { continue; }
        if (l.fn === fn) {

          // set the removed listener to noop so that's not called if remove happens in fire
          l.fn = function () { return false; };

          if (this._firingCount) {
            /* copy array in case events are being fired */
            this._events[type] = listeners = listeners.slice();
          }
          listeners.splice(i, 1);

          return;
        }
      }
    }
  }

  // @function extend(dest: Object, src?: Object): Object
  // Merges the properties of the `src` object (or multiple objects) into `dest` object and returns the latter. Has an `L.extend` shortcut.
  extend (dest) {
    var i, j, len, src;

    for (j = 1, len = arguments.length; j < len; j++) {
      src = arguments[j];
      for (i in src) {
        dest[i] = src[i];
      }
    }
    return dest;
  }

  // @method fire(type: String, data?: Object, propagate?: Boolean): this
  // Fires an event of the specified type. You can optionally provide an data
  // object — the first argument of the listener function will contain its
  // properties. The event might can optionally be propagated to event parents.
  fire (type, data, propagate) {
    if (this._events) {
      var listeners = this._events[type];

      if (listeners) {
        this._firingCount = (this._firingCount + 1) || 1;
        for (var i = 0, len = listeners.length; i < len; i++) {
          var l = listeners[i];
          var params = Object.keys(arguments).map((k) => arguments[k]);
          params.shift();
          l.fn.call(this, ...params);
        }

        this._firingCount--;
      }
    }
    return this;
  }

  _propagateEvent () {

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
