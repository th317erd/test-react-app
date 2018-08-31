import React        from 'react';
import {
  PropTypes,
  componentFactory
}                   from '../base';
import { Field }    from '../field';
import styleSheet   from './text-field-styles.js';

const TextField = componentFactory('TextField', ({ Parent, componentName }) => {
  return class TextField extends Parent {
    static styleSheet = styleSheet;

    static propTypes = {
      second: PropTypes.number,
      something: PropTypes.func
    };

    render() {
      var state = this.getState(),
          { children, second } = state;

      console.log('State!', state);

      return super.render(
        <div className={this.getRootClassName(componentName)} style={this.style('padding')}>
          <span>{second}</span>
          {children || null}
        </div>
      );
    }
  };
}, Field);

export { TextField };
