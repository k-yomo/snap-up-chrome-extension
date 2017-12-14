/*global chrome*/

import React, { Component } from 'react';
import firebase from 'firebase';
import './App.css';
import RegisterEnglishForm from './components/RegisterEnglishForm';
import LoginForm from './components/LoginForm';
import 'firebase/firestore';

const config = {
  apiKey: "AIzaSyBrmEDw2473a4aG53WSura1XJQpOh-eKoE",
  authDomain: "snap-up.firebaseapp.com",
  databaseURL: "https://snap-up.firebaseio.com",
  projectId: "snap-up",
  storageBucket: "snap-up.appspot.com",
  messagingSenderId: "754203017870"
};
firebase.initializeApp(config);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uid: null,
      decks: [],
      error: ''
    };
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
    if (user) {
      this.setState({ uid: user.uid });
      this.fetchDecks(user.uid);
    }
  });
  }

  loginToFirebase(email, password) {
    firebase.auth().signInWithEmailAndPassword(email, password)
      .catch((er) => {
        const error = 'Email and/or password are invalid. Please try again.';
        this.setState({ error });
      });
  }

  fetchDecks(uid) {
    const deckRef = firebase.firestore().collection(`users/${uid}/decks`);
    deckRef.get().then(decksSnapShot => {
      const decks = [];
      decksSnapShot.forEach(deckDoc => {
        const deck = deckDoc.data();
        deck.id = deckDoc.id;
        decks.push(deck);
      });
      this.setState({ decks });
    });
  }

  render() {
    return (
        <div className="App">
          {this.state.uid ?
          <RegisterEnglishForm decks={this.state.decks} uid={this.state.uid}/> :
          <LoginForm loginToFirebase={this.loginToFirebase.bind(this)} error={this.state.error} />
          }
        </div>
    );
  }
}

export default App;
