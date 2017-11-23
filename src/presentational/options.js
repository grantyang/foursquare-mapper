import React from 'react';

const Options = props => {
  return (
    <div className="row mt-2 justify-content-center">
      <select
        className="custom-select mr-1"
        onChange={event => props.onMinimumRatingChange(event)}>
        <option value="0">Select Minimum Rating</option>
        <option value="9.5">9.5/10</option>
        <option value="9">9.0/10</option>
        <option value="8.5">8.5/10</option>
        <option value="8">8.0/10</option>
        <option value="7.5">7.5/10</option>
        <option value="7">7.0/10</option>
      </select>

    </div>
  );
};

export default Options;
