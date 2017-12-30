import { observable } from 'mobx';
import { asyncAction } from 'mobx-utils';
import EventEmitter from 'eventemitter3';
import _ from 'lodash';

export class ContextualState {
  static new (props, context) {
    if (context instanceof ContextualState) {
      context = mergeContext({}, context.context, context.getChildContext());
    }
    if (!props || typeof props !== 'object') {
      props = {};
    }
    if (!context || typeof context !== 'object') {
      context = {};
    }
    const instance = new this(props, context);
    instance.initialize();
    return instance;
  }

  get isDestroyed () {
    return this._ContextualState_destroyed;
  }

  constructor (props = {}, context = {}) {
    Object.defineProperties(this, {
      props: {
        enumerable: false,
        writable: false,
        configurable: true,
        value: props,
      },
      context: {
        enumerable: false,
        writable: false,
        configurable: true,
        value: context,
      },
      _ContextualState_event: {
        enumerable: false,
        writable: false,
        configurable: true,
        value: new EventEmitter(),
      },
    });
  }

  getChildContext () {}

  initialize () {}

  on (...args) {
    return this._ContextualState_event.on(...args);
  }

  off (...args) {
    return this._ContextualState_event.off(...args);
  }

  once (...args) {
    return this._ContextualState_event.once(...args);
  }

  removeListener (...args) {
    return this._ContextualState_event.removeListener(...args);
  }

  emit (...args) {
    return this._ContextualState_event.emit(...args);
  }

  destroy () {
    if (this._ContextualState_destroyed) return;
    this._ContextualState_destroyed = true;
    const event = this._ContextualState_event;
    event.emit('destroy');
    event.removeAllListeners();
    Object.defineProperties(this, {
      props: { value: null },
      context: { value: null },
      _ContextualState_event: { value: null },
    });
  }

  @observable.ref _ContextualState_destroyed = false;
}

export function defineProperty (target, name, descriptor) {
  const creator = descriptor.value;
  delete descriptor.value;
  delete descriptor.writable;

  descriptor.get = function getOrInitialize () {
    // get or create lazy map
    let map = this.$$__properties;
    if (!map) {
      map = {};
      Object.defineProperty(this, '$$__properties', {
        enumerable: false,
        writable: false,
        configurable: true,
        value: map
      });
    }

    // get or create box
    let box = map[name];
    if (!box) {
      box = map[name] = observable.shallowBox(undefined);
      const result = creator.call(this, box);
      if (result !== undefined) {
        box.set(result);
      }
    }
    return box.get();
  };
}

export function mergeContext (...args) {
  if (args.length < 2) {
    return args[0];
  }

  const descriptors = {};

  for (const src of args) {
    if (!src || typeof src !== 'object') {
      continue;
    }

    Object.getOwnPropertyNames(src).forEach(name => {
      const descriptor = Object.getOwnPropertyDescriptor(src, name);

      if ('value' in descriptor) {
        const prev = descriptors[name];
        if (prev && 'value' in prev) {
          const v1 = prev.value;
          const v2 = descriptor.value;
          if (_.isPlainObject(v1) && _.isPlainObject(v2)) {
            descriptor.value = mergeContext({}, v1, v2);
          }
        }
      }

      descriptors[name] = descriptor;
    });
  }

  return Object.defineProperties(args[0], descriptors);
}

export function injectAsyncAction (prototype, names) {
  for (const name of names) {
    prototype[name] = asyncAction(prototype[name]);
  }
}
