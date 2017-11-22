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
      section: '',
      limit: 50,
      minimumRating: 0,
      items: [],
      keywords: [],
      savedVenues: {},
      latitude: 25.033,
      longitude: 121.5654
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
          if (v.venue.rating > this.state.minimumRating) {
            venueDataToAdd[v.venue.id] = {
              name: v.venue.name,
              rating: v.venue.rating,
              cat: v.venue.categories[0] && v.venue.categories[0].shortName,
              lat: v.venue.location.lat,
              lng: v.venue.location.lng,
              keyword: this.state.query
            };
          }
        });
        console.log(venueDataToAdd);
        this.setState({
          items: fetchedVenues,
          loading: false,
          savedVenues: Object.assign({}, this.state.savedVenues, venueDataToAdd)
        });
      });
  };

  addNewKeyword = keywordInput => {
    //saves a keyword to sidebar list of previous searches
    if (keywordInput === '') return alert('Please input value');
    this.setState({
      query: keywordInput,
      keywords: [keywordInput, ...this.state.keywords]
    });
  };

  removeKeyword = keywordToRemove => {
    //when a keyword is clicked, remove it from keywords list and its results from the heatmap
    const savedVenues = this.state.savedVenues;
    const newKeywords = this.state.keywords.filter(k => k !== keywordToRemove);
    let res = Object.assign({}, savedVenues);
    Object.keys(res).forEach(id => {
      if (res[id].keyword === keywordToRemove) delete res[id];
    });

    this.setState({
      keywords: newKeywords,
      savedVenues: res,
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
      keywords: [],
      savedVenues: {}
    });
  };

  onMinimumRatingChange = event => {
    this.setState({ minimumRating: event.target.value });
  };

  render() {
    return (
      <div className="container mt-2">
        <Input fxToRun={this.addNewKeyword} />
        <Options onMinimumRatingChange={this.onMinimumRatingChange} />
        <div className="row mt-2 justify-content-sm-center">
          <Sidebar
            keywords={this.state.keywords}
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
