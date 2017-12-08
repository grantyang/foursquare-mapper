import React, { Component } from 'react';
import Input from './presentational/input.js';
import GoogleMap from './presentational/google_map.js';
import Sidebar from './presentational/sidebar.js';
import ItemsList from './presentational/items_list.js';
import Options from './presentational/options.js';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      query: '',
      limit: 50,
      minimumRating: 0,
      items: [],
      savedKeywords: {},
      savedVenues: {},
      latitude: 25.042921,
      longitude: 121.534717
    };
  }

  componentDidUpdate(previousProps, previousState) {
    if (previousState.query !== this.state.query && this.state.query !== '') {
      //if the query has been changed since last update
      //(prevents infinite setState loop)
      this.getVenuesFromAPI();
    }
  }

  getVenuesFromAPI = () => {
    this.setState({
      loading: true
    });
    fetch(
      `http://localhost:5000/fsquare/explore?query=${this.state.query}&ll=${
        this.state.latitude
      },${this.state.longitude}&radius=20000&limit=${this.state.limit}`,
      {
        method: 'GET'
      }
    )
      .then(res => res.json())
      .then(data => {
        const fetchedVenues = data.response.groups[0].items;
        let venueDataToAdd = {};
        fetchedVenues.forEach(v => {
          if (v.venue.rating >= this.state.minimumRating) {
            console.log(v.venue)
            venueDataToAdd[v.venue.id] = {
              name: v.venue.name,
              rating: v.venue.rating,
              cat: v.venue.categories[0] && v.venue.categories[0].shortName,
              lat: v.venue.location.lat,
              lng: v.venue.location.lng,
              phone: v.venue.contact.formattedPhone,
              url: v.venue.url,
              keyword: this.state.query
            };
          }
        });

        // update keyword object with number of results returned
        const keywordToUpdate = {};
        keywordToUpdate[this.state.query] = Object.assign(
          {},
          this.state.savedKeywords[this.state.query],
          {
            resultsLength: Object.keys(venueDataToAdd).length
          }
        );

        this.setState({
          items: fetchedVenues,
          loading: false,
          savedVenues: Object.assign(
            {},
            this.state.savedVenues,
            venueDataToAdd
          ),
          savedKeywords: Object.assign(
            {},
            this.state.savedKeywords,
            keywordToUpdate
          )
        });
      });
  };

  addNewKeyword = keywordInput => {
    //saves a keyword to sidebar list of previous searches
    if (keywordInput === '') return alert('Please input value');
    if (this.state.savedKeywords[keywordInput])
      return alert('Keyword already added');
    const keywordToAdd = {};
    keywordToAdd[keywordInput] = { minimumRating: this.state.minimumRating };

    this.setState({
      query: keywordInput,
      savedKeywords: Object.assign({}, this.state.savedKeywords, keywordToAdd)
    });
  };

  removeKeyword = keywordToRemove => {
    //when a keyword is clicked, remove it from keywords list and its results from the heatmap
    const savedVenues = this.state.savedVenues;
    const savedKeywords = this.state.savedKeywords;

    let newKeywords = Object.assign({}, savedKeywords);
    delete newKeywords[keywordToRemove];

    let newVenues = Object.assign({}, savedVenues);
    Object.keys(newVenues).forEach(id => {
      if (newVenues[id].keyword === keywordToRemove) delete newVenues[id];
    });

    this.setState({
      savedKeywords: newKeywords,
      savedVenues: newVenues,
      query: ''
    });
  };

  saveLocation = location => {
    this.clearData();
    this.setState({
      latitude: location.lat(),
      longitude: location.lng()
    });
  };

  clearData = () => {
    this.setState({
      query: '',
      savedKeywords: {},
      savedVenues: {}
    });
  };

  onMinimumRatingChange = event => {
    this.setState({ minimumRating: parseFloat(event.target.value) });
  };

  render() {
    return (
      <div className="container mt-2">
        <Input fxToRun={this.addNewKeyword} />
        <Options onMinimumRatingChange={this.onMinimumRatingChange}
        clearData={this.clearData} />
        <div className="row mt-2 justify-content-sm-center">
          <Sidebar
            keywords={this.state.savedKeywords}
            removeKeyword={this.removeKeyword}
          />
          <GoogleMap
            location={{ lat: this.state.latitude, lng: this.state.longitude }}
            saveLocation={this.saveLocation}
            savedVenues={this.state.savedVenues}
          />
        </div>
        <ItemsList loading={this.state.loading} items={this.state.items} />
      </div>
    );
  }
}

export default App;
