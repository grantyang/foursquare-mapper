import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Input from './presentational/input.js';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: []
    };
  }

  componentDidMount() {

  }

  // addSearchInputToList = searchInput => {
  //   //adds new todo item to this list
  //   if (!searchInput) {
  //     return alert('Please input a value');
  //   } else {
  //     console.log(searchInput);
  //   }
  // };

  search = searchInput => {
    const query = searchInput;
    const section = '';
    const city = 'san francisco';
    const limit = 50;
    fetch(
      `http://localhost:5000/fsquare/explore?query=${query}&section=${section}&near=${city}&limit=${limit}`,
      {
        method: 'GET'
      }
    )
      .then(res => res.json())
      .then(data => {
        console.log(data.response.groups[0]);
        this.setState({ items: data.response.groups[0].items });
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
        <div className="container">
          <Input fxToRun={this.search} />
          <div className="row justify-content-sm-center">
            <div>Items:</div>
          </div>
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
        </div>
      </div>
    );
  }
}

export default App;
