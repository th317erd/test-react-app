import React          from 'react';
import {
  componentFactory,
  Theme
}                     from './base';
import styleSheet     from './app-styles.js';
import { TextField }  from './text-field';
import { Test }       from './test';

const App = componentFactory('App', ({ Parent, componentName }) => {
  return class App extends Parent {
    static styleSheet = styleSheet;

    constructor(...args) {
      super(...args);

      this.theme = new Theme({}, 'browser');
    }

    publishContext() {
      return {
        theme: this.theme
      };
    }

    resolveState() {
      return {
        ...super.resolveState.apply(this, arguments),
        ...this.getState({
          second: 0
        })
      };
    }

    componentDidMount() {
      this.intervalID = setInterval(() => {
        this.setState({ second: this.getState('second', 0) + 1 });
      }, 50);
    }

    componentWillUnmount() {
      clearInterval(this.intervalID);
    }

    render() {
      var second = this.getState('second');

      return (
        <div className={this.getRootClassName(componentName)}>
          <TextField ref={(elem) => {
            global.textField = elem;
          }} second={() => second}>
            <Test/>
          </TextField>
        </div>
      );
    }
  };
});

export default App;
