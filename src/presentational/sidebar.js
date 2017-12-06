import React from 'react';
import xicon from '../resources/x.svg'; // relative path to image

const Sidebar = props => {
  return (
    <div className="col-3">
      <div className="">Keywords:</div>
      {Object.keys(props.keywords).map(keyword => {
        if (props.keywords[keyword].resultsLength !== undefined) {
          return (
            <div key={keyword} onClick={() => props.removeKeyword(keyword)}>
              <img src={xicon} alt="remove keyword" />{' '}
              {props.keywords[keyword].resultsLength} results for {keyword}{' '}
              above {props.keywords[keyword].minimumRating}
            </div>
          );
        }
        return <div key={keyword}>Loading...</div>;
      })}
    </div>
  );
};

export default Sidebar;
