import React, { Component } from 'react';
/*global google*/

class GoogleMap extends Component {
  componentDidMount() {
    this.renderMap();
  }

  componentDidUpdate() {
    this.renderMap();
  }

  renderMap = () => {
    var map, heatmap;

    map = new google.maps.Map(this.refs.map, {
      zoom: 13,
      center: this.props.location,
      mapTypeId: 'roadmap'
    });

    heatmap = new google.maps.visualization.HeatmapLayer({
      data: this.getPoints(),
      map: map
    });
    heatmap.set('radius', 30);
  };

  // Heatmap data
  getPoints = () => {
    const savedVenues = this.props.savedVenues;
    if (savedVenues) {
      console.log(savedVenues);
      return Object.keys(savedVenues).map(keyName => {
        return new google.maps.LatLng(
          savedVenues[keyName].lat,
          savedVenues[keyName].lng
        );
      });
    }
  };

  render() {
    // this.refs.map is a direct reference to this element
    return (
      <div className="">
        <div className="map" ref="map" />
      </div>
    );
  }
}

export default GoogleMap;
