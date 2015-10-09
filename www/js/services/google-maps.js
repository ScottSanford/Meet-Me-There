angular.module('mmtApp', [])

.factory('GoogleMaps', function() {
  
  return {


      calculateAndDisplayRoute: function(myLatLng, pointB, directionsService, directionsDisplay, map) {
        directionsService.route({
              origin: myLatLng,
              destination: pointB.formatted_address,
              travelMode: google.maps.TravelMode.DRIVING
            }, function(response, status) {
              if (status === google.maps.DirectionsStatus.OK) {
                console.log(response);

                directionsDisplay.setMap(map);
                directionsDisplay.setDirections(response);

                startLocation = {};
                endLocation = {};
                
              } else {
                console.log('Directions request failed due to ' + status);
              }
            });
      }

  }


});