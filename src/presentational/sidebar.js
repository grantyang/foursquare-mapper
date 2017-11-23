import React from 'react';

const Sidebar = props => {
  return (
    <div className="col-2">
      <div className="">Keywords:</div>
      {Object.keys(props.keywords).map(keyword => {
        return (
          <div key={keyword} onClick={() => props.removeKeyword(keyword)}>
            {keyword} above {props.keywords[keyword].minimumRating}
          </div>
        );
      })}
    </div>
  );
};

export default Sidebar;
