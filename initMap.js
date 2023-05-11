var map;
var destinations = [];
var markers = [];
var directionsService = new google.maps.DirectionsService();

function initialize() {
  var mapOptions = {
    zoom: 14,
    center: new google.maps.LatLng(37.5665, 126.9780),
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };

  map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);

  // Autocomplete for start and end points
  var autocompleteStart = new google.maps.places.Autocomplete(
    document.getElementById('start'), { types: ['geocode'] });
  autocompleteStart.addListener('place_changed', function () {
    var place = autocompleteStart.getPlace();
    if (!place.geometry) {
      alert("Please select a valid starting point.");
      return;
    }
    map.setCenter(place.geometry.location);
  });

  var autocompleteEnd = new google.maps.places.Autocomplete(
    document.getElementById('end'), { types: ['geocode'] });
  autocompleteEnd.addListener('place_changed', function () {
    var place = autocompleteEnd.getPlace();
    if (!place.geometry) {
      alert("Please select a valid destination.");
      return;
    }
  });

  // Add destination button
  var addDestinationButton = document.getElementById('addDestinationButton');
  addDestinationButton.addEventListener('click', function () {
    var start = "";
    if (destinations.length > 0) {
      start = destinations[destinations.length - 1];
    } else {
      start = document.getElementById('start').value;
    }
    var end = document.getElementById('end').value;
    if (start && end) {
      destinations.push(end);
      calcRoute(start, end);
      clearInputFields();
      updateDestinationList();
    }
  });

  function calcRoute(start, end) {
    var request = {
      origin: start,
      destination: end,
      travelMode: google.maps.TravelMode.DRIVING
    };
    directionsService.route(request, function (result, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        var directionsDisplay = new google.maps.DirectionsRenderer();
        directionsDisplay.setMap(map);
        directionsDisplay.setDirections(result);
      } else {
        alert("Directions request returned no results.");
      }
    });
  }

  function updateDestinationList() {
    var destinationList = document.getElementById('destinationList');
    destinationList.innerHTML = ""; // Clear existing list
    destinations.forEach(function (destination, index) {
      var destinationItem = document.createElement('div');
      destinationItem.classList.add('destination-item');
      destinationItem.textContent = destination;
      destinationList.appendChild(destinationItem);
      // Add click event to display route
      destinationItem.addEventListener('click', function () {
        var start = destinations[index - 1] || document.getElementById('start').value;
        var end = destination;
        calcRoute(start, end);
      });
    });
  }

  function clearInputFields() {
    document.getElementById('start').value = "";
    document.getElementById('end').value = "";
  }
}

window.addEventListener('load', initialize);
