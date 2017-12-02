import React, { Component } from 'react';
/*global google*/

class GoogleMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      map: null,
      markerArray: [],
      heatmap: new google.maps.visualization.HeatmapLayer(),
      heatmapHidden: false,
      iconsHidden: false
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
      const savedPointLatLngs = this.getPoints();
      const markerArray = [];

      //clear previous markers
      this.state.markerArray.forEach(marker => {
        marker.setMap(null);
      });

      const iconBase =
        'https://emojipedia-us.s3.amazonaws.com/thumbs/240/apple/114/';
      const icons = {
        Sushi: {
          icon: iconBase + 'sushi_1f363.png'
        },
        Japanese: {
          icon: iconBase + 'sushi_1f363.png'
        },
        Ramen: {
          icon: iconBase + 'steaming-bowl_1f35c.png'
        },
        Noodles: {
          icon: iconBase + 'steaming-bowl_1f35c.png'
        },
        Bar: {
          icon: iconBase + 'beer-mug_1f37a.png'
        },
        'Beer Garden': {
          icon: iconBase + 'beer-mug_1f37a.png'
        },
        Pub: {
          icon: iconBase + 'beer-mug_1f37a.png'
        },
        Brewery: {
          icon: iconBase + 'beer-mug_1f37a.png'
        }
      };

      //create markers for each saved point
      const savedVenues = this.props.savedVenues;
      Object.keys(savedVenues).map(keyName => {
        const image = {
          url:
            !icons[savedVenues[keyName].cat] ||
            icons[savedVenues[keyName].cat].icon, //temp
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(10, 10),
          scaledSize: new google.maps.Size(20, 20)
        };

        const marker = new google.maps.Marker({
          position: new google.maps.LatLng(
            savedVenues[keyName].lat,
            savedVenues[keyName].lng
          ),
          icon: image,
          title: savedVenues[keyName].name
        });
        markerArray.push(marker);
      });

      //clear previous heatmap
      this.state.heatmap.setMap(null);
      //create new heatmap with upated points
      const heatmap = new google.maps.visualization.HeatmapLayer({
        data: savedPointLatLngs
      });
      heatmap.set('radius', 30);
      var gradient = [
        'rgba(0, 255, 255, 0)',
        'rgba(0, 255, 255, 1)',
        'rgba(0, 191, 255, 1)',
        'rgba(0, 127, 255, 1)',
        'rgba(0, 63, 255, 1)',
        'rgba(0, 0, 255, 1)',
        'rgba(0, 0, 223, 1)',
        'rgba(0, 0, 191, 1)',
        'rgba(0, 0, 159, 1)',
        'rgba(0, 0, 127, 1)',
        'rgba(63, 0, 91, 1)',
        'rgba(127, 0, 63, 1)',
        'rgba(191, 0, 31, 1)',
        'rgba(255, 0, 0, 1)'
      ];
      heatmap.set('gradient', gradient);

      //if heatmap is not toggled off, overlay the heatmap onto map
      if (!this.state.heatmapHidden) {
        heatmap.setMap(this.state.map);
      }
      if (!this.state.iconsHidden) {
        markerArray.forEach(marker => {
          marker.setMap(this.state.map);
        });
      }
      this.setState({
        markerArray,
        heatmap
      });
    }
  }

  // Heatmap data
  getPoints = () => {
    const savedVenues = this.props.savedVenues;
    console.log(savedVenues);

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

  toggleIcons = () => {
    this.state.markerArray.forEach(marker => {
      marker.setMap(marker.getMap() ? null : this.state.map);
    });

    this.setState({
      iconsHidden: !this.state.iconsHidden
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
        <button
          className="btn btn-warning mt-1 mr-1"
          onClick={this.toggleIcons}>
          Toggle Icons
        </button>
        <button className="btn btn-info mt-1" onClick={this.toggleHeatmap}>
          Toggle Heatmap
        </button>
      </div>
    );
  }
}

export default GoogleMap;
