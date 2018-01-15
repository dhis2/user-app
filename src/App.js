import React, { Component } from 'react';
import logo from './logo.svg';
import D2UIApp from 'd2-ui/lib/app/D2UIApp';
import Test from './Test';
import './App.css';

class App extends Component {
  render() {
    const config = {
      baseUrl: 'http://localhost:8080/dhis/api',
      schemas: ['userRole', 'user']
    };
    console.log(this.context);
    return (
      <D2UIApp initConfig={config} >
        <div>
          <Test/>
        </div>
      </D2UIApp>
    )
  }
}

export default App;
