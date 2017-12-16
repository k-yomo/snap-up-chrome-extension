import React, { Component } from 'react';
import firebase from 'firebase';
import uuidv1 from 'uuid/v1';
import axios from 'axios';
import Button from 'material-ui/Button';
import GifGenerator from './GifGenerator';
import TextField from './TextField';
import SearchButton from './SearchButton';
import PartsOfSpeech from './PartsOfSpeech';
import SelectDeck from './SelectDeck';
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
      noSuggestedMeaning: false,
      isEnglishEntered: false,
      loadingGif: false,
      deckId: 0
    };
    this.onPartOfSpeechClick = this.onPartOfSpeechClick.bind(this);
  }

  onSubmitEnglish() {
    if (this.state.english) {
      this.setState({ isEnglishEntered: true });

      let english = this.state.english.toLowerCase();
      english = english.endsWith(' ') ? english.slice(0, -1) : english;

      this.fetchGif(english);
      // this.fetchMeanings(english);
      this.fetchWordInfo(english);

      if (this.props.decks.length > 0) {
        this.setState({ deckId: this.props.decks[0].id });
      }
    }
  }

  onSubmitCard() {
    const wordInfo = this.state.wordInfo;
    wordInfo.examples = wordInfo.examples ? this.convertArrayToObj(wordInfo.examples) : null;

    if (wordInfo.parts.length > 0) {
      wordInfo.parts = this.convertArrayBoolObj(wordInfo.parts);
    } else {
      wordInfo.parts = { 'N/A': true };
    }

    const newCard = {
      english: this.state.english,
      meaning: this.state.meaning,
      gifUrl: this.state.gifUrl,
      ...wordInfo
    };

    let deckId;
    if (this.state.deckId === 0) {
      deckId = uuidv1();
      const ref = firebase.firestore().doc(`users/${this.props.uid}/decks/${deckId}`);
      ref.set({ title: 'Chrome Extension' });
    } else {
      deckId = this.state.deckId;
    }

    this.clearState();
    this.createCard(this.props.uid, deckId, newCard);
  }

  createCard(uid, deckId, card) {
    const cardId = uuidv1();
    const ref = firebase.firestore().doc(`users/${uid}/decks/${deckId}/cards/${cardId}`);
    ref.set(card);
  };

  fetchWordInfo(english) {
    axios.get(`https://wordsapiv1.p.mashape.com/words/${english}`,
    { headers: { 'X-Mashape-Key': X_MASHAPE_KEY } })
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

  fetchGif(english) {
    this.setState({ loadingGif: true });
    axios.get(`https://api.giphy.com/v1/gifs/translate?api_key=${GIPHY_KEY}&s=${english}`)
    .then(response => {
      if (response.data.data.images) {
        this.setState({
          gifUrl: response.data.data.images.fixed_height_downsampled.url,
          loadingGif: false
         });
      }
    });
  }

  onPartOfSpeechClick(pressedPart) {
    let wordInfo = Object.assign(this.state.wordInfo);
    if (wordInfo.parts.includes(pressedPart)) {
      wordInfo = {
        ...wordInfo,
        parts: wordInfo.parts.filter(part => part !== pressedPart)
      };
    } else {
      wordInfo.parts.push(pressedPart);
    }
    this.setState({ wordInfo });
  }

  noDefFound() {
    this.setState({ noDefinition: true });
  }

  onEnglishChange(english) {
    this.setState({ english });
  }

  onMeaningChange(meaning) {
    this.setState({ meaning });
  }

  onSelectedDeckChange(e) {
    this.setState({ deckId: e.target.value });
  }

  convertArrayToObj(arr) {
    return arr.reduce((obj, el, index) => {
      obj[index] = el;
      return obj;
    }, {});
  }

  convertArrayBoolObj(arr) {
    return arr.reduce((obj, el) => {
      obj[el] = true;
      return obj;
    }, {});
  }

  clearState() {
    this.setState({
      english: '',
      meaning: '',
      gifUrl: '',
      wordInfo: {
        parts: []
      },
      suggestedMeanings: [],
      isEnglishEntered: false,
      noSuggestedMeaning: false,
      noDefinition: false
    });
  }

  render() {
    const {
      english,
      meaning,
      wordInfo,
      isEnglishEntered
    } = this.state;
    console.log(wordInfo);
    return (
      <div className='container'>
        <div className='logout'><a href='#' onClick={() => this.props.logout()}>Logout</a></div>
        { isEnglishEntered &&
          <GifGenerator
            english={english}
            gifUrl={this.state.gifUrl}
            loadingGif={this.state.loadingGif}
            fetchGif={this.fetchGif.bind(this)}
          />
        }
        <TextField
          label='New English Word'
          text={this.state.english}
          onChange={this.onEnglishChange.bind(this)}
         />
        <SearchButton
          onClick={this.onSubmitEnglish.bind(this)}
        />
        { isEnglishEntered &&
          <div>
            {this.state.noSuggestedMeaning &&
              <p>There is no suggested meaning</p>
            }
            {this.state.suggestedMeanings.length > 0 &&
              <div style={{ margin: 'auto', textAlign: 'center' }}>
                {this.state.suggestedMeanings.map((suggestedM, i) =>
                  <Button
                    key={i}
                    onClick={() => this.onMeaningChange(suggestedM)}
                    style={{
                      minWidth: 36,
                      maxHeight: 36,
                      minHeight: 36,
                      margin: 5,
                      padding: 10,
                      color: 'white',
                      backgroundColor: suggestedM === meaning ? '#EF5350' : '#BDBDBD',
                    }}
                  >
                    {suggestedM}
                  </Button>
                )}
              </div>
            }
            <TextField
              label='The Meaning'
              text={this.state.meaning}
              onChange={this.onMeaningChange.bind(this)}
            />
            <PartsOfSpeech
              onClick={this.onPartOfSpeechClick.bind(this)}
              wordInfo={wordInfo}
            />
            <SelectDeck
              deckId={this.state.deckId}
              decks={this.props.decks}
              onChange={this.onSelectedDeckChange.bind(this)} />
            <div>
              <Button
                onClick={() => this.clearState()}
                style={{
                  marginTop: 5,
                  marginLeft: 5
                }}
              >
                Cancel
              </Button>
              <Button
                disabled={!(english && meaning)}
                onClick={() => this.onSubmitCard()}
                className='submit-button'
                style={{
                  width: 125,
                  marginTop: 5,
                  marginLeft: 10,
                  color: 'white',
                  background: english && meaning ? 'linear-gradient(45deg, #EF5350 30%, #FF8E53 90%)' : '#BDBDBD',
                }}
              >
                Save
              </Button>
            </div>
          </div>
        }
      </div>
    );
  }
}
