import React, { Component } from 'react';
/*global google*/

class GoogleMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      map: null,
      heatmap: new google.maps.visualization.HeatmapLayer(),
      heatmapHidden: false
    };
  }

  componentDidMount() {
    let map = new google.maps.Map(this.refs.map, {
      zoom: 13,
      center: this.props.location,
      mapTypeId: 'roadmap'
    });

    // Create the search box and link it to the UI element.
    var input = document.getElementById('pac-input');

    var searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    var saveLocation = this.props.saveLocation;
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', function() {
      var places = searchBox.getPlaces();
      if (places.length === 0) {
        return;
      }

      //send location to parent component to save
      saveLocation(places[0].geometry.location);
      if (!places[0].geometry) {
        console.log('Returned place contains no geometry');
        return;
      }

      var bounds = new google.maps.LatLngBounds();
      if (places[0].geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(places[0].geometry.viewport);
      } else {
        bounds.extend(places[0].geometry.location);
      }
      map.fitBounds(bounds);
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
      if (!this.state.heatmapHidden) {
        heatmap.setMap(this.state.map);
      }
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

  toggleHeatmap = () => {
    this.state.heatmap.setMap(
      this.state.heatmap.getMap() ? null : this.state.map
    );
    this.setState({
      heatmapHidden: !this.state.heatmapHidden
    });
  };

  render() {
    // this.refs.map is a direct reference to this element
    return (
      <div className="">
        <div className="row justify-content-sm-center">
          <input
            id="pac-input"
            className="controls"
            type="text"
            placeholder="Search to set a location"
          />
        </div>
        <div className="map rounded" ref="map" />
        <button className="btn btn-warning mr-1" onClick={this.toggleIcons}>
          Toggle Icons
        </button>
        <button className="btn btn-info" onClick={this.toggleHeatmap}>
          Toggle Heatmap
        </button>
      </div>
    );
  }
}

export default GoogleMap;
