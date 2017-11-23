import React from 'react';

const ItemsList = props => {
  return (
    <div>
      {props.loading && <span className="col-9">Fetching Data...</span>}
      {!props.loading && (
        <div className="col-9">
          <div className="">Items:</div>

          {props.items.map(item => {
            return (
              <div className="" key={item.venue.id}>
                {item.venue.name} |{' '}
                {item.venue.categories[0] && item.venue.categories[0].shortName}{' '}
                | {item.venue.rating} | {item.venue.stats.checkinsCount} |{' '}
                {item.venue.location.lat} | {item.venue.location.lng}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ItemsList;
