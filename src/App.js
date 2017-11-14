import React, { Component } from 'react';
import './App.css';
import Input from './presentational/input.js';
import GoogleMap from './presentational/google_map.js';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      query: '',
      city: 'san francisco',
      section: '',
      limit: 50,
      items: [],
      keywords: [],
      savedVenues: {}
    };
  }

  componentDidUpdate(previousProps, previousState) {
    if (previousState.query !== this.state.query) {
      //if the query has been changed since last update
      //(prevents infinite setState loop)
      this.getVenuesFromAPI();
    }
  }

  // addSearchInputToList = searchInput => {
  //   //adds new todo item to this list
  //   if (!searchInput) {
  //     return alert('Please input a value');
  //   } else {
  //     console.log(searchInput);
  //   }
  // };

  getVenuesFromAPI = () => {
    this.setState({
      loading: true
    });
    fetch(
      `http://localhost:5000/fsquare/explore?query=${this.state
        .query}&near=${this.state.city}&limit=${this.state.limit}`,
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
            cat: (v.venue.categories[0] && v.venue.categories[0].shortName),
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
        console.log(this.state)
      });
  };

  setSearchInput = searchInput => {
    if (searchInput === '') return alert('Please input value');
    this.setState({
      query: searchInput,
      keywords: [searchInput, ...this.state.keywords]
    });
  };

  render() {
    return (
      <div className="container mt-2">
        <Input fxToRun={this.setSearchInput} />

        <div className="row">
          <div className="col-3">
            <div className="">Keywords:</div>
            {this.state.keywords.map(keyword => {
              return (
                <div className="" key={keyword}>
                  {keyword}
                </div>
              );
            })}
          </div>

          {this.state.loading && (
            <span className="col-9">Fetching Data...</span>
          )}
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
        <div className="row justify-content-sm-center">
          <GoogleMap location={{ lat: 37.77, lng: -122.4 }} />
        </div>
      </div>
    );
  }
}

export default App;
