import React, { Component } from 'react';
/*global google*/

class GoogleMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      map: null,
      heatmap: new google.maps.visualization.HeatmapLayer()
    };
  }

  componentDidMount() {
    let map = new google.maps.Map(this.refs.map, {
      zoom: 13,
      center: this.props.location,
      mapTypeId: 'roadmap'
    });

    this.setState({
      map
    });
  }

  componentDidUpdate(previousProps, previousState) {
    if (previousState.heatmap === this.state.heatmap) {
      this.state.heatmap.setMap(null);
      let heatmap = new google.maps.visualization.HeatmapLayer({
        data: this.getPoints()
      });
      heatmap.set('radius', 30);
      heatmap.setMap(this.state.map);
      this.setState({
        heatmap
      });
    }
  }

  // Heatmap data
  getPoints = () => {
    const savedVenues = this.props.savedVenues;
    if (savedVenues) {
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
        <div className="map rounded" ref="map" />
      </div>
    );
  }
}

export default GoogleMap;
