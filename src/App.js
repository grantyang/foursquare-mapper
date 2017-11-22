import React, { Component } from 'react';
import Input from './presentational/input.js';
import GoogleMap from './presentational/google_map.js';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      query: '',
      section: '',
      limit: 50,
      items: [],
      keywords: [],
      savedVenues: {},
      latitude: 40.7128,
      longitude: -74.0060
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
    console.log(this.state.latitude)
    console.log(this.state.longitude)
    
    fetch(
      `http://localhost:5000/fsquare/explore?query=${this.state
        .query}&ll=${this.state.latitude},${this.state.longitude}&radius=20000&limit=${this.state.limit}`,
      {
        method: 'GET'
      }
    )
      .then(res => res.json())
      .then(data => {
        const fetchedVenues = data.response.groups[0].items;
        let venueDataToAdd = {};
        fetchedVenues.forEach(v => {
          venueDataToAdd[v.venue.id] = {
            name: v.venue.name,
            rating: v.venue.rating,
            cat: v.venue.categories[0] && v.venue.categories[0].shortName,
            lat: v.venue.location.lat,
            lng: v.venue.location.lng,
            keyword: this.state.query
          };
        });
        this.setState({
          items: fetchedVenues,
          loading: false,
          savedVenues: Object.assign({}, this.state.savedVenues, venueDataToAdd)
        });
        console.log(this.state);
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
    //when a keyword is clicked, remove it from previous searches an d
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
    })
  };

  clearData = () => {
    this.setState({
      query: '',
      keywords: [],
      savedVenues: []
    })
  };


  render() {
    console.log('render, latitude is')
    console.log(this.state.latitude)
    return (
      <div className="container mt-2">
        <Input fxToRun={this.addNewKeyword} />
        <div className="row mt-2 justify-content-sm-center">
          <div className="col-2">
            <div className="">Keywords:</div>
            {this.state.keywords.map(keyword => {
              return (
                <div
                  className=""
                  key={keyword}
                  onClick={() => this.removeKeyword(keyword)}>
                  {keyword}
                </div>
              );
            })}
          </div>
          <GoogleMap
            location={{ lat: this.state.latitude, lng: this.state.longitude }}
            saveLocation={this.saveLocation}
            savedVenues={this.state.savedVenues}
          />
        </div>

        {this.state.loading && <span className="col-9">Fetching Data...</span>}
        {!this.state.loading && (
          <div className="col-9">
            <div className="">Items:</div>

            {this.state.items.map(item => {
              return (
                <div className="" key={item.venue.id}>
                  {item.venue.name} | {' '}
                  {item.venue.categories[0] &&
                    item.venue.categories[0].shortName}{' '}
                  | {item.venue.rating} | {item.venue.stats.checkinsCount} |{' '}
                  {item.venue.location.lat} | {item.venue.location.lng}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }
}

export default App;
