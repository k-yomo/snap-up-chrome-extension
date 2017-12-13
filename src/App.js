import React, { Component } from 'react';
import './App.css';
import GifGenerator from './components/GifGenerator';
import Form from './components/Form';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      english: '',
      meaning: '',
      gifUrl: '',
      wordInfo: {
        parts: []
      },
      suggestedMeanings: [],
      partConverter: {
        noun: 'N',
        verb: 'V',
        adjective: 'Adj',
        adverb: 'Adv',
        unapprecable: 'N/A'
      },
      parts: ['N', 'V', 'Adj', 'Adv', 'N/A'],
      partsColorsPair: {
          N: '#EF5350',
          V: '#F37C4A',
          Adj: '#F7A644',
          Adv: '#FCD63D',
          'N/A': '#888'
        },
      noSuggestedMeaning: false,
      noDefinition: false,
      isEnglishEntered: false,
      loadingGif: false
    };
  }

  render() {
    return (
      <div className="App">
        <GifGenerator />
        <Form />
      </div>
    );
  }
}

export default App;
