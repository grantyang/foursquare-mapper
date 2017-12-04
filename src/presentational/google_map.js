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
        'https://emojipedia-us.s3.amazonaws.com/thumbs/240/apple/';
      const icons = {
        Japanese: {
          icon: iconBase + '118/flag-for-japan_1f1ef-1f1f5.png'
        },
        Italian: {
          icon: iconBase + '118/flag-for-italy_1f1ee-1f1f9.png'
        },
        French: {
          icon: iconBase + '118/flag-for-france_1f1eb-1f1f7.png'
        },
        Indian: {
          icon: iconBase + '118/flag-for-india_1f1ee-1f1f3.png'
        },
        Thai: {
          icon: iconBase + '118/flag-for-thailand_1f1f9-1f1ed.png'
        },
        Mexican: {
          icon: iconBase + '118/flag-for-mexico_1f1f2-1f1fd.png'
        },
        American: {
          icon: iconBase + '118/flag-for-united-states_1f1fa-1f1f8.png'
        },
        German: {
          icon: iconBase + '118/flag-for-germany_1f1e9-1f1ea.png'
        },
        Russian: {
          icon: iconBase + '118/flag-for-russia_1f1f7-1f1fa.png'
        },
        Chinese: {
          icon: iconBase + '118/flag-for-china_1f1e8-1f1f3.png'
        },
        Taiwanese: {
          icon: iconBase + '118/flag-for-taiwan_1f1f9-1f1fc.png'
        },
        Vietnamese: {
          icon: iconBase + '118/flag-for-vietnam_1f1fb-1f1f3.png'
        },
        Spanish: {
          icon: iconBase + '118/flag-for-spain_1f1ea-1f1f8.png'
        },
        Greek: {
          icon: iconBase + '118/flag-for-greece_1f1ec-1f1f7.png'
        },
        Korean: {
          icon: iconBase + '118/flag-for-south-korea_1f1f0-1f1f7.png'
        },
        Tapas: {
          icon: iconBase + '118/flag-for-spain_1f1ea-1f1f8.png'
        },
        Burritos: {
          icon: iconBase + '118/burrito_1f32f.png'
        },
        Tacos: {
          icon: iconBase + '118/taco_1f32e.png'
        },
        Steakhouse: {
          icon: iconBase + '118/cut-of-meat_1f969.png'
        },
        Pizza: {
          icon: iconBase + '118/slice-of-pizza_1f355.png'
        },
        Restaurant: {
          icon: iconBase + '118/poultry-leg_1f357.png'
        },
        Bookstore: {
          icon: iconBase + '118/books_1f4da.png'
        },
        Sushi: {
          icon: iconBase + '114/sushi_1f363.png'
        },
        Burgers: {
          icon: iconBase + '118/hamburger_1f354.png'
        },
        Sandwiches: {
          icon: iconBase + '118/sandwich_1f96a.png'
        },
        'Vegetarian / Vegan': {
          icon: iconBase + '118/carrot_1f955.png'
        },
        Ramen: {
          icon: iconBase + '114/steaming-bowl_1f35c.png'
        },
        Breakfast: {
          icon: iconBase + '118/cooking_1f373.png'
        },
        Donuts: {
          icon: iconBase + '118/doughnut_1f369.png'
        },
        Bakery: {
          icon: iconBase + '118/doughnut_1f369.png'
        },
        Seafood: {
          icon: iconBase + '118/fish_1f41f.png'
        },
        Dumplings: {
          icon: iconBase + '118/dumpling_1f95f.png'
        },
        Noodles: {
          icon: iconBase + '114/steaming-bowl_1f35c.png'
        },
        Cocktail: {
          icon: iconBase + '118/cocktail-glass_1f378.png'
        },
        Lounge: {
          icon: iconBase + '118/cocktail-glass_1f378.png'
        },
        'Wine Bar': {
          icon: iconBase + '118/wine-glass_1f377.png'
        },
        'Wine Shop': {
          icon: iconBase + '118/wine-glass_1f377.png'
        },
        Bar: {
          icon: iconBase + '114/beer-mug_1f37a.png'
        },
        Gastropub: {
          icon: iconBase + '114/beer-mug_1f37a.png'
        },
        'Beer Bar': {
          icon: iconBase + '114/beer-mug_1f37a.png'
        },
        'Bubble Tea': {
          icon: iconBase + '118/cup-with-straw_1f964.png'
        },
        'Night Market': {
          icon: iconBase + '118/oden_1f362.png'
        },
        'Whisky Bar': {
          icon: iconBase + '118/tumbler-glass_1f943.png'
        },
        'Dive Bar': {
          icon: iconBase + '114/beer-mug_1f37a.png'
        },
        'Sports Bar': {
          icon: iconBase + '114/beer-mug_1f37a.png'
        },
        'Hotel Bar': {
          icon: iconBase + '114/beer-mug_1f37a.png'
        },
        'Beer Garden': {
          icon: iconBase + '114/beer-mug_1f37a.png'
        },
        Pub: {
          icon: iconBase + '114/beer-mug_1f37a.png'
        },
        Brewery: {
          icon: iconBase + '114/beer-mug_1f37a.png'
        },
        Café: {
          icon: iconBase + '118/hot-beverage_2615.png'
        },
        'Coffee Shop': {
          icon: iconBase + '118/hot-beverage_2615.png'
        },
        'Tea Room': {
          icon: iconBase + '118/hot-beverage_2615.png'
        },
        Nightlife: {
          icon: iconBase + '118/musical-note_1f3b5.png'
        },
        Nightclub: {
          icon: iconBase + '118/musical-note_1f3b5.png'
        },
        Entertainment: {
          icon: iconBase + '118/musical-note_1f3b5.png'
        },
        'Music Venue': {
          icon: iconBase + '118/musical-note_1f3b5.png'
        },
        'Rock Club': {
          icon: iconBase + '118/musical-note_1f3b5.png'
        },
        Park: {
          icon: iconBase + '118/evergreen-tree_1f332.png'
        },
        Garden: {
          icon: iconBase + '118/evergreen-tree_1f332.png'
        },
        'Dog Run': {
          icon: iconBase + '118/dog-face_1f436.png'
        },
        Playground: {
          icon: iconBase + '118/evergreen-tree_1f332.png'
        },
        'Art Museum': {
          icon: iconBase + '118/classical-building_1f3db.png'
        },
        'Art Gallery': {
          icon: iconBase + '118/classical-building_1f3db.png'
        },
        'Public Art': {
          icon: iconBase + '118/classical-building_1f3db.png'
        },
        'History Museum': {
          icon: iconBase + '118/classical-building_1f3db.png'
        },
        'Science Museum': {
          icon: iconBase + '118/classical-building_1f3db.png'
        },
        Museum: {
          icon: iconBase + '118/classical-building_1f3db.png'
        },
        'Historic Site': {
          icon: iconBase + '118/statue-of-liberty_1f5fd.png'
        },
        Landmark: {
          icon: iconBase + '118/statue-of-liberty_1f5fd.png'
        },
        Hotel: {
          icon: iconBase + '118/hotel_1f3e8.png'
        },
        Lake: {
          icon: iconBase + '118/splashing-sweat-symbol_1f4a6.png'
        },
        'Hot Spring': {
          icon: iconBase + '118/splashing-sweat-symbol_1f4a6.png'
        },
        'Music Store': {
          icon: iconBase + '118/musical-note_1f3b5.png'
        },
        'Record Shop': {
          icon: iconBase + '118/musical-note_1f3b5.png'
        },
        'Gym / Fitness': {
          icon: iconBase + '118/weight-lifter_1f3cb.png'
        },
        'Climbing Gym': {
          icon: iconBase + '118/weight-lifter_1f3cb.png'
        },
        Gym: {
          icon: iconBase + '118/weight-lifter_1f3cb.png'
        },
        'Dance Studio': {
          icon: iconBase + '118/weight-lifter_1f3cb.png'
        },
        'Yoga Studio': {
          icon: iconBase + '118/weight-lifter_1f3cb.png'
        },
        'Grocery Store': {
          icon: iconBase + '118/shopping-trolley_1f6d2.png'
        },
        Supermarket: {
          icon: iconBase + '118/shopping-trolley_1f6d2.png'
        },
        Market: {
          icon: iconBase + '118/shopping-trolley_1f6d2.png'
        },
        School: {
          icon: iconBase + '118/classical-building_1f3db.png'
        },
        University: {
          icon: iconBase + '118/classical-building_1f3db.png'
        },
        'Elementary School': {
          icon: iconBase + '118/classical-building_1f3db.png'
        },
        'High School': {
          icon: iconBase + '118/classical-building_1f3db.png'
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
