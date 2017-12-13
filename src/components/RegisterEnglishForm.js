import React, { Component } from 'react';
import axios from 'axios';
import Button from 'material-ui/Button';
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
    this.onPartOfSpeechClick = this.onPartOfSpeechClick.bind(this);
  }

  onSubmitEnglish() {
    if (this.state.english) {
      this.setState({ isEnglishEntered: true });

      let english = this.state.english.toLowerCase();
      english = english.endsWith(' ') ? english.slice(0, -1) : english;

      this.fetchWordInfo(english);
      this.fetchGif(english);
    }
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
      console.log(wordInfo);
      this.setState({ wordInfo });
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
      suggestedMeanings,
      wordInfo,
      isEnglishEntered
    } = this.state;

    return (
      <div className='container'>
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
            <TextField
              label='The Meaning'
              text={this.state.meaning}
              onChange={this.onMeaningChange.bind(this)}
            />
            <div style={{ margin: 'auto', textAlign: 'center' }}>
            {this.state.parts.map((part, i) =>
                <Button
                  key={i}
                  onClick={() => this.onPartOfSpeechClick(part)}
                  style={{
                    maxWidth: 36,
                    minWidth: 36,
                    maxHeight: 36,
                    minHeight: 36,
                    margin: 5,
                    padding: 10,
                    color: 'white',
                    backgroundColor: wordInfo.parts && wordInfo.parts.includes(part) ? this.state.partsColorsPair[part] : '#BDBDBD'
                  }}
                >
                  {part}
                </Button>
              )}
            </div>
            <div>
              <Button
                onClick={() => this.clearState()}
                style={{ marginLeft: 5 }}
              >
                Cancel
              </Button>
              <Button
                disabled={!(english && meaning)}
                onClick={() => this.onSubmitCard()}
                style={{
                  marginLeft: 10,
                  background: english && meaning ? 'linear-gradient(45deg, #EF5350 30%, #FF8E53 90%)' : '#BDBDBD',
                  color: 'white',
                  width: 125
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
