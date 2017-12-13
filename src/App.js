import React, { Component } from 'react';
import firebase from 'firebase';
import './App.css';
import RegisterEnglishForm from './components/RegisterEnglishForm';

const config = {
    apiKey: "AIzaSyBrmEDw2473a4aG53WSura1XJQpOh-eKoE",
    authDomain: "snap-up.firebaseapp.com",
    databaseURL: "https://snap-up.firebaseio.com",
    projectId: "snap-up",
    storageBucket: "snap-up.appspot.com",
    messagingSenderId: "754203017870"
  };

class App extends Component {

  componentWillMount() {
    firebase.initializeApp(config);
  }

  render() {
    return (
        <div className="App">
          <RegisterEnglishForm/>
        </div>
    );
  }
}

export default App;
