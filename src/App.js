import React, { Component } from 'react';
import BarGraphManipulator from './module/components/bar-graph-manipulator';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
class App extends Component {


  render() {
    return (
      <MuiThemeProvider>
        <BarGraphManipulator/>
      </MuiThemeProvider>
    );
  }
}

export default App;
