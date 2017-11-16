import React, { Component } from 'react';
import Input from './presentational/input.js';
import GoogleMap from './presentational/google_map.js';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      query: '',
      city: 'taipei',
      section: '',
      limit: 20,
      items: [],
      keywords: [],
      savedVenues: {}
    };
  }

  componentDidUpdate(previousProps, previousState) {
    if (previousState.query !== this.state.query && this.state.query !== '') {
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
    if (keywordInput === '') return alert('Please input value');
    this.setState({
      query: keywordInput,
      keywords: [keywordInput, ...this.state.keywords]
    });
  };

  removeKeyword = keywordToRemove => {
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

  render() {
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
            location={{ lat: 25.033, lng: 121.5654 }}
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
