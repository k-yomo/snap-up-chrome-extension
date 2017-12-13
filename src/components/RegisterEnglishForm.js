import React, { Component } from 'react';
import axios from 'axios';
import GifGenerator from './GifGenerator';
import TextField from './TextField';
import SearchButton from './SearchButton';
import { X_MASHAPE_KEY, GIPHY_KEY } from '../env';


export default class RegisterEnglishForm extends Component {
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
      isEnglishEntered: false,
      loadingGif: false
    };
  }

  onSubmitEnglish() {
  this.setState({ isEnglishEntered: true });

  let english = this.state.english.toLowerCase();
  english = english.endsWith(' ') ? english.slice(0, -1) : english;

  this.fetchMeanings(english);
  this.fetchWordInfo(english);
  this.fetchGif(english);
}

fetchMeanings(english) {
    const suggestedMeanings = [];
    axios.get(`https://glosbe.com/gapi/translate?from=en&dest=ja&format=json&phrase=${english}`)
    .then((response) => {
      const tuc = response.data.tuc;
      if (tuc.length) {
        for (let i = 0; i < 4; i++) {
          if (!(tuc[i] && tuc[i].phrase)) { break; }
          this.setState({ noSuggestedMeaning: false });
          suggestedMeanings.push(tuc[i].phrase.text);
        }
      } else {
        this.setState({ noSuggestedMeaning: true });
      }
      this.setState({ suggestedMeanings });
    });
  }

  fetchWordInfo(english) {
    axios.get(`https://wordsapiv1.p.mashape.com/words/${english}`,
    { headers: {
      'X-Mashape-Key': X_MASHAPE_KEY,
      'Access-Control-Allow-Origin' : '*'
      }
    })
    .then(response => {
      const wordInfo = { parts: [] };
      const examples = [];
      const slicedResults = response.data.results.slice(0, 2);

      slicedResults.forEach(result =>
      !wordInfo.parts.includes(this.state.partConverter[result.partOfSpeech]) &&
      wordInfo.parts.push(this.state.partConverter[result.partOfSpeech]));

      slicedResults.forEach(result => result.examples && examples.push(result.examples));
      wordInfo.examples = [].concat.apply([], examples);

      this.setState({ wordInfo });
    });
  }

  fetchGif(english) {
    this.setState({ loadingGif: true });
    axios.get(`https://api.giphy.com/v1/gifs/translate?api_key=${GIPHY_KEY}&s=${english}`)
    .then(response => {
      if (response.data.data.images.fixed_height_downsampled.url) {
        this.setState({
          gifUrl: response.data.data.images.fixed_height_downsampled.url,
          loadingGif: false
         });
      }
    });
  }

  onEnglishChange(english) {
    this.setState({ english });
  }

  onMeaningChange(meaning) {
    this.setState({ meaning });
  }

  render() {
    const {
      english,
      meaning,
      suggestedMeanings,
      wordInfo,
      isEnglishEntered,
      partsColors
    } = this.state;

    return (
      <div>
        { isEnglishEntered &&
          <GifGenerator
            english={english}
            gifUrl={this.state.gifUrl}
            loadingGif={this.state.loadingGif}
            fetchGif={this.fetchGif.bind(this)}
          />
        }
        <TextField
          text={this.state.english}
          onChange={this.onEnglishChange.bind(this)}
         />
        <SearchButton
          onClick={this.onSubmitEnglish.bind(this)}
        />
      </div>
    );
  }
}
