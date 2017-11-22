import React, { Component } from 'react';

const Sidebar = props => {
  return (
    <div className="col-2">
      <div className="">Keywords:</div>
      {props.keywords.map(keyword => {
        return (
          <div key={keyword} onClick={() => props.removeKeyword(keyword)}>
            {keyword}
          </div>
        );
      })}
    </div>
  );
};

export default Sidebar;
