import PropTypes                  from './prop-types';
import ComponentBase              from './component-base';
import ReactComponentBase         from './react-component-base';
import {
  copyStaticMethods
}                                 from './utils';

export {
  copyStaticMethods,
  bindPrototypeFuncs,
  areObjectsEqualShallow,
}                                 from './utils';

export {
  StyleSheetBuilder,
  createStyleSheet,
  buildCSSFromStyle,
  buildCSSFromStyles
}                                 from './styles/style-sheet';
export {
  Color,
  rebuildPallette,
  Constants
}                                 from './styles/colors';
export { Theme, ThemeProperties } from './styles/theme';

export function componentFactory(name, definer, _options) {
  function getComponentClass(component) {
    if (!component)
      return ComponentBase;

    if (component && component._componentClass)
      return component._componentClass;

    return component;
  }

  function getReactComponentClass(component) {
    if (!component)
      return ReactComponentBase;

    if (component && component._reactComponentClass)
      return component._reactComponentClass;

    return component;
  }

  function mergePropTypes(..._types) {
    var types = _types.filter((type) => !!type);
    return PropTypes.mergeTypes(...types);
  }

  function calculateResolveProps(componentName, _propTypes) {
    var propTypes = _propTypes || {},
        keys = Object.keys(propTypes),
        resolveProps = {};

    for (var i = 0, il = keys.length; i < il; i++) {
      var propName = keys[i],
          typeSpec = propTypes[propName],
          testProps = {};

      // Test if a function is a valid prop type
      testProps[propName] = () => {};
      var error = PropTypes.checkPropType(typeSpec, testProps, propName, componentName, null, null, { forceRun: true });

      // There was an error, meaning function is invalid
      // so we can automatically resolve the prop using
      // a function callback
      if (error)
        resolveProps[propName] = true;
    }

    return resolveProps;
  }

  if (!name)
    throw new TypeError('"name" is required to create a component');

  if (typeof definer !== 'function')
    throw new TypeError('"definer" callback is required to create a component');

  var options = (typeof _options === 'function') ? { componentBase: _options } : (_options || {}),
      ReactBaseComponent = getReactComponentClass(options.reactComponentBaseClass),
      Parent = getComponentClass(options.componentBase || ComponentBase);

  var ComponentClass = definer(Object.assign({}, options, { Parent, componentName: name }));
  if (typeof ComponentClass !== 'function')
    throw new TypeError('"definer" callback must return a class or a function');

  class ReactComponentClass extends ReactBaseComponent {
    constructor(...args) {
      super(ComponentClass, ...args);
    }
  }

  const parentComponent = Parent,
        parentReactComponent = getReactComponentClass(Parent);

  var propTypes = ComponentClass.propTypes = mergePropTypes(parentComponent.propTypes, ComponentClass.propTypes),
      defaultProps = Object.assign({}, (parentComponent.defaultProps || {}), (ComponentClass.defaultProps || {})),
      resolvableProps = calculateResolveProps(name, propTypes);

  copyStaticMethods(parentComponent, ComponentClass);
  copyStaticMethods(ComponentClass, ReactComponentClass, (name) => {
    return (name !== 'propTypes');
  });
  copyStaticMethods(parentReactComponent, ReactComponentClass);

  const commonStaticProps = {
    '_resolvableProps': {
      writable: true,
      enumerable: false,
      configurable: true,
      value: resolvableProps
    },
    'defaultProps': {
      writable: true,
      enumerable: false,
      configurable: true,
      value: defaultProps
    },
    'getComponentName': {
      writable: true,
      enumerable: false,
      configurable: true,
      value: () => name
    },
    '_parentComponent': {
      writable: false,
      enumerable: false,
      configurable: false,
      value: parentComponent
    },
    '_parentReactComponent': {
      writable: false,
      enumerable: false,
      configurable: false,
      value: parentReactComponent
    },
    '_componentClass': {
      writable: false,
      enumerable: false,
      configurable: false,
      value: ComponentClass
    },
    '_reactComponentClass': {
      writable: false,
      enumerable: false,
      configurable: false,
      value: ReactComponentClass
    },
  };

  Object.defineProperties(ComponentClass, commonStaticProps);
  Object.defineProperties(ReactComponentClass, commonStaticProps);

  if (typeof ComponentClass._componentClassInitHook === 'function') {
    var classes = ComponentClass._componentClassInitHook(ComponentClass, ReactComponentClass);
    ComponentClass = classes.ComponentClass;
    ReactComponentClass = classes.ReactComponentClass;
  }

  if (!global._components)
    global._components = {};

  global._components[name] = ReactComponentClass;

  return ReactComponentClass;
}

export {
  PropTypes,
  ComponentBase,
  ReactComponentBase
};
