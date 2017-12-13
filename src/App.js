import React, { Component } from 'react';
import './App.css';
import RegisterEnglishForm from './components/RegisterEnglishForm';

class App extends Component {

  render() {
    return (
        <div className="App">
          <RegisterEnglishForm/>
        </div>
    );
  }
}

export default App;
