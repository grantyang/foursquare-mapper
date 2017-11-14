import React, { Component } from 'react';

export default class Input extends Component {
  constructor(props) {
    super(props);
    this.state = { text: '' }; // init state to blank
  }

  onInputChange = event => {
    // when input is changed, update state
    this.setState({ text: event.target.value });
  };

  onInputSubmit = event => {
    // when input is submitted, run fx

    event.preventDefault();
    this.props.fxToRun(this.state.text);
    this.setState({ text: '' }); //clears out input after submit
  };

  render() {
    return (
      <div className="row">
        <form
          className="input input-group justify-content-center"
          onSubmit={this.onInputSubmit}>
          <input
            type="text"
            className="form-control col-sm-4"
            placeholder="Enter keywords here"
            value={this.state.text} // grab value from state
            onChange={this.onInputChange} // update state on change
          />
          <span className="input-group-btn">
            <button className="btn btn-success" type="submit">
              Add
            </button>
          </span>
        </form>
      </div>
    );
  }
}
