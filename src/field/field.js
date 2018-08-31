import React        from 'react';
import {
  componentFactory,
  PropTypes
}                   from '../base';
import styleSheet   from './field-styles.js';

const Field = componentFactory('Field', ({ Parent, componentName }) => {
  return class Field extends Parent {
    static styleSheet = styleSheet;

    static propTypes = {
      test: PropTypes.number
    };

    publishContext() {
      return {
        stuff: 'things'
      };
    }

    resolveState({ props }) {
      return {
        ...super.resolveState.apply(this, arguments),
        field: props.field,
        value: props.value
      }
    }

    render(children) {
      return (
        <div className={this.getRootClassName(componentName)}>
          {children || null}
        </div>
      );
    }
  };
});

export { Field };
