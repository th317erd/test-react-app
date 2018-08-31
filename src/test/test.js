import React                from 'react';
import { componentFactory } from '../base';
import styleSheet           from './test-styles.js';

const Test = componentFactory('Test', ({ Parent, componentName }) => {
  return class Test extends Parent {
    static styleSheet = styleSheet;

    render() {
      return super.render(
        <div className={this.getRootClassName(componentName)}>
          <span>HELLO!</span>
        </div>
      );
    }
  };
});

export { Test };
