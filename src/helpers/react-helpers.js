import { action } from 'mobx';

export function injectPropagate (target) {
  const { prototype } = target;
  if (process.env.NODE_ENV !== 'production') {
    const descriptor = Object.getOwnPropertyDescriptor(prototype, 'propagate');
    if (descriptor) throw new Error('propagete is defined');
  }
  Object.defineProperty(prototype, 'propagate', { value: propagate });
}

export function propagate (name, ...args) {
  const { props } = this;
  if (typeof props[name] === 'function') {
    props[name](...args);
  }
}

export function mobxize (input) {
  if (typeof input === 'function') {
    mobxizeWithConfig(null, input);
  } else {
    return target => mobxizeWithConfig(input, target);
  }
}

function mobxizeWithConfig (config, target) {
  if (!config) {
    config = { applyProps: 'applyProps' };
  }
  if (typeof config === 'string') {
    config = { applyProps: config };
  }

  let { applyProps } = config;
  if (!applyProps) {
    applyProps = 'applyProps';
  }
  if (typeof applyProps === 'string') {
    const name = applyProps;
    applyProps = (ctx, props) => ctx[name] && ctx[name](props);
  }

  const { prototype } = target;

  Object.defineProperty(prototype, 'shouldComponentUpdate', { value: returnFalse });

  {
    const descriptor = Object.getOwnPropertyDescriptor(prototype, 'componentWillMount');
    const fn = descriptor && descriptor.value;
    Object.defineProperty(prototype, 'componentWillMount', descriptor ? {
      value: action(
        function componentWillMount () {
          this::fn();
          applyProps(this, this.props);
        }
      )
    } : {
      configurable: true,
      enumerable: false,
      writable: true,
      value: action(
        function componentWillMount () {
          applyProps(this, this.props);
        }
      )
    });
  }

  {
    const descriptor = Object.getOwnPropertyDescriptor(prototype, 'componentWillReceiveProps');
    const fn = descriptor && descriptor.value;
    Object.defineProperty(prototype, 'componentWillReceiveProps', descriptor ? {
      value: action(
        function componentWillReceiveProps (props) {
          this::fn(props);
          applyProps(this, props);
        }
      )
    } : {
      configurable: true,
      enumerable: false,
      writable: true,
      value: action(
        function componentWillReceiveProps (props) {
          applyProps(this, props);
        }
      )
    });
  }
}

function returnFalse () {
  return false;
}
