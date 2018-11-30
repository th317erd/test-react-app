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

    componentDidMount() {
      console.log('THEME VIA CONTEXT: ', this.context.theme);
    }

    render(children) {
      console.log('Second: ', this.props.second);
      return super.render(
        <div className={this.getRootClassName(componentName)} style={this.style('padding')}>
          <span>{this.props.second}</span>
          {this.getChildren(children)}
        </div>
      );
    }
  };
}, Field);

export { TextField };
