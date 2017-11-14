import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Input from './presentational/input.js';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      query: '',
      city: 'san francisco',
      section: '',
      limit: 5,
      items: []
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
    console.log(this.state);
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
        this.setState({ items: data.response.groups[0].items, loading: false });
      });
  };

  setSearchInput = searchInput => {
    this.setState({
      query: searchInput
    });
  };

  render() {
    return (
      <div>
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h1 className="App-title">Proximap</h1>
          </header>
        </div>
        <div className="container mt-2">
          <Input fxToRun={this.setSearchInput} />
          {(this.state.loading && <span className="row justify-content-sm-center">Fetching Data...</span>)}
          {(!this.state.loading && <div className="">
            <div className="row justify-content-sm-center">Items:</div>
            {this.state.items.map(item => {
              return (
                <div
                  className="row justify-content-sm-center"
                  key={item.venue.id}>
                  {item.venue.name} //{' '}
                  {item.venue.categories[0] &&
                    item.venue.categories[0].shortName}{' '}
                  // {item.venue.rating} // {item.venue.stats.checkinsCount}
                </div>
              );
            })}
          </div>)}
        </div>
      </div>
    );
  }
}

export default App;
