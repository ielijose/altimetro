var elevator;
var map;

window.mapOptions = {};

function getLocation() {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(function(position) {
      window.mapOptions = {
        zoom: 8,
        center: new google.maps.LatLng(position.coords.latitude,position.coords.longitude),
        mapTypeId: 'terrain'
      }
    });

  } else {
    window.mapOptions = {
      zoom: 8,
      center: new google.maps.LatLng(10.546991509229592,-71.52147931046784),
      mapTypeId: 'terrain'
    }
  }
}


function initialize() {  
  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

  var myTitle = document.createElement('h3');
  myTitle.style.color = 'black';
  myTitle.innerHTML = 'Eli José Carrasquero';
  var myTextDiv = document.createElement('div');
  myTextDiv.appendChild(myTitle);
 // myTextDiv.addClass('menu');

  map.controls[google.maps.ControlPosition.BOTTOM_LEFT].push(myTextDiv);

  // Create an ElevationService
  elevator = new google.maps.ElevationService();

  // Add a listener for the click event and call getElevation on that location
  google.maps.event.addListener(map, 'click', getElevation);
}

function getElevation(event) {

  var locations = [];

  // Retrieve the clicked location and push it on the array
  var clickedLocation = event.latLng;
  locations.push(clickedLocation);

  // Create a LocationElevationRequest object using the array's one value
  var positionalRequest = {
    'locations': locations
  }

  // Initiate the location request
  elevator.getElevationForLocations(positionalRequest, function(results, status) {
    if (status == google.maps.ElevationStatus.OK) {

      // Retrieve the first result
      if (results[0]) {

        var m = results[0].elevation.toFixed(2);

        // Open an info window indicating the elevation at the clicked position
        infowindow.setContent(results[0].elevation + ' metros.');
        infowindow.setPosition(clickedLocation);
        //infowindow.open(map);

        var marker = new google.maps.Marker({
          position: clickedLocation,
          map: map,
          title: m + " m"
        });

        marker.setMap(map);
        $(".number").text(m);
      } else {
        alert('No results found');
      }
    } else {
     // alert('Elevation service failed due to: ' + status);
    }
  });
}

google.maps.event.addDomListener(window, 'load', initialize);
