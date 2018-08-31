import React      from 'react';
import {
  componentFactory,
  Theme
}                 from './base';
import styleSheet from './app-styles.js';

const App = componentFactory('App', ({ Parent }) => {
  var thisClass = class App extends Parent {
    static styleSheet = styleSheet;

    constructor(...args) {
      super(...args);

      this.theme = new Theme({}, 'browser');
    }

    render() {
      return (
        <div className={this.getRootClassName()}>
        </div>
      );
    }
  };

  var instance = new thisClass();
  debugger;

  return thisClass;
});

export default App;
