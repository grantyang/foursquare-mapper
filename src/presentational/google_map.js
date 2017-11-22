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
    console.log(this.props.location);
    let map = new google.maps.Map(this.refs.map, {
      zoom: 13,
      center: this.props.location,
      mapTypeId: 'roadmap'
    });

    // Create the search box and link it to the UI element.
    var input = document.getElementById('pac-input');
    console.log(input);

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

      var bounds = new google.maps.LatLngBounds();

      //send location to parent component to save
      saveLocation(places[0].geometry.location);
      if (!places[0].geometry) {
        console.log('Returned place contains no geometry');
        return;
      }
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
        <div className="row justify-content-sm-center">
          <input
            id="pac-input"
            className="controls"
            type="text"
            placeholder="Search to set a location"
          />
        </div>
        <div className="map rounded" ref="map" />
      </div>
    );
  }
}

export default GoogleMap;

// import React, { Component } from 'react';
// /*global google*/

// class GoogleMap extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       points: []
//     };
//   }

//   componentDidMount() {
//     this.initializeGoogleMap();
//   }

//   componentDidUpdate(previousProps, previousState) {
//     //this.initializeGoogleMap();

//     if (previousState.points === this.state.points) {
//       console.log('updaing points... points is now:');
//       console.log(this.getPoints());
//       // this.state.heatmap.setMap(null);
//       this.setState({
//         points: this.getPoints() // difference instead of all?
//       });
//     }
//   }

//   // Heatmap data
//   getPoints = () => {
//     const savedVenues = this.props.savedVenues;
//     if (savedVenues) {
//       return Object.keys(savedVenues).map(keyName => {
//         return new google.maps.LatLng(
//           savedVenues[keyName].lat,
//           savedVenues[keyName].lng
//         );
//       });
//     }
//   };

//   initializeGoogleMap = () => {
//     var map = new google.maps.Map(this.refs.map, {
//       zoom: 13,
//       center: this.props.location,
//       mapTypeId: 'roadmap'
//     });

//     var heatmap = new google.maps.visualization.HeatmapLayer({
//       data: this.state.points
//     });
//     heatmap.set('radius', 30);
//     heatmap.setMap(map);

//   // Create the search box and link it to the UI element.
//   var input = document.getElementById('pac-input'); //GY THIS IS NULL IN WILLUPDATE
//   console.log(input)

//   var searchBox = new google.maps.places.SearchBox(input);
//   map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

//   var saveLocation = this.props.saveLocation;
//   // Listen for the event fired when the user selects a prediction and retrieve
//   // more details for that place.
//   searchBox.addListener('places_changed', function() {
//     var places = searchBox.getPlaces();
//     if (places.length === 0) {
//       return;
//     }
//     // For each place, get the icon, name and location.
//     var bounds = new google.maps.LatLngBounds();
//     places.forEach(function(place) {
//       if (!place.geometry) {
//         console.log('Returned place contains no geometry');
//         return;
//       }
//       //send location to parent component to save
//       saveLocation(place.geometry.location);
//       if (place.geometry.viewport) {
//         // Only geocodes have viewport.
//         bounds.union(place.geometry.viewport);
//       } else {
//         bounds.extend(place.geometry.location);
//       }
//     });
//     map.fitBounds(bounds);
//   });
// };

//   // renderHeatMap = () => {
//   //   // Create heatmap
//   //   var heatmap;
//   //   heatmap = new google.maps.visualization.HeatmapLayer({
//   //     data: this.getPoints(),
//   //     map: this.state.map
//   //   });
//   //   heatmap.set('radius', 30);
//   // };

//   render() {
//     // this.refs.map is a direct reference to this element
//     return (

//     );
//   }
// }

// export default GoogleMap;
