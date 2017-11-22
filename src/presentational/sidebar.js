import React, { Component } from 'react';

export default class Sidebar extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="col-2">
        <div className="">Keywords:</div>
        {this.props.keywords.map(keyword => {
          return (
            <div
              key={keyword}
              onClick={() => this.props.removeKeyword(keyword)}>
              {keyword}
            </div>
          );
        })}
      </div>
    );
  }
}
