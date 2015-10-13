angular.module('starter.controllers', [])

.controller('SearchCtrl', function($scope, $location) {

    $scope.places = [
                {"type": "Coffee","checked": false},
                {"type": "Food","checked": false},
                {"type": "Drinks", "checked": false}
            ]

    $scope.gotoMap = function() {
        $location.url('/tab/map');
    }

})

.controller('GoogleMapCtrl', function(
  $scope, 
  $cordovaGeolocation, 
  $ionicLoading, 
  GoogleMaps) {

          $scope.loading = $ionicLoading.show();

          $scope.ratingStates = [
            {stateOn: 'glyphicon-usd', stateOff: 'glyphicon-usd'},
            {stateOn: 'glyphicon-usd', stateOff: 'glyphicon-usd'},
            {stateOn: 'glyphicon-usd', stateOff: 'glyphicon-usd'},
            {stateOn: 'glyphicon-usd', stateOff: 'glyphicon-usd'},
            {stateOn: 'glyphicon-usd', stateOff: 'glyphicon-usd'}
          ]

        // get position of user and then set the center of the map to that position
        $cordovaGeolocation
          .getCurrentPosition()
          .then(function (position) {


          // get coordinates of user
          var geoLatitude  = position.coords.latitude
          var geoLongitude = position.coords.longitude
          var userLocation = {
              lat: geoLatitude, 
              lng: geoLongitude
            };

          initialize(userLocation);
          var directionDisplay;
          var map;
          var polyline = null;
          var infowindow = new google.maps.InfoWindow();

          function createMarker(latlng, label, html) {
              // console.log(latlng+", " + label + ", " + html + ")");
              var contentString = '<b>'+label+'</b><br>'+ html;
              var marker = new google.maps.Marker({
                  position: latlng,
                  map: map,
                  title: label,
                  zIndex: Math.round(latlng.lat()*-100000)<<5
                  });
                  marker.myname = label;
                  // gmarkers.push(marker);

              google.maps.event.addListener(marker, 'click', function() {
                  infowindow.setContent(contentString+"<br>"+marker.getPosition().toUrlValue(6)); 
                  infowindow.open(map,marker);
                  console.log(marker.position);
                  });
              return marker;
          }

          function initialize(userLocation) {
            directionsDisplay = new google.maps.DirectionsRenderer();
            var myOptions = {
              zoom: 6,
              mapTypeId: google.maps.MapTypeId.ROADMAP,
              center: userLocation
            }
            map = new google.maps.Map(document.getElementById("map"), myOptions);
            polyline = new google.maps.Polyline({
              path: [],
              strokeColor: '#FF0000',
              strokeWeight: 0
            });

            directionsDisplay.setMap(map);
            calcRoute(polyline, userLocation);

            $ionicLoading.hide();
          }
  
          function calcRoute(polyline, userLocation) {
            var directionsService = new google.maps.DirectionsService();
            var start = userLocation;
            var end = '5820 N Sheridan Rd, Chicago, IL 60660';
            var travelMode = google.maps.DirectionsTravelMode.DRIVING

            var request = {
                origin: start,
                destination: end,
                travelMode: travelMode
            };
            directionsService.route(request, function(response, status) {
              if (status == google.maps.DirectionsStatus.OK) {
                polyline.setPath([]);
                var bounds = new google.maps.LatLngBounds();
                startLocation = {};
                endLocation = {};
              
                directionsDisplay.setDirections(response);
                var route = response.routes[0];

                // For each route, display summary information.
                var path = response.routes[0].overview_path;
                var legs = response.routes[0].legs;
                for (i=0;i<legs.length;i++) {
                  if (i == 0) { 
                    startLocation.latlng = legs[i].start_location;
                    startLocation.address = legs[i].start_address;
                    // marker = google.maps.Marker({map:map,position: startLocation.latlng});
                    marker = createMarker(legs[i].start_location,"midpoint","","Point A");
                  }
                  endLocation.latlng = legs[i].end_location;
                  endLocation.address = legs[i].end_address;
                  var steps = legs[i].steps;
                  for (j=0;j<steps.length;j++) {
                    var nextSegment = steps[j].path;
                    for (k=0;k<nextSegment.length;k++) {
                      polyline.getPath().push(nextSegment[k]);
                      bounds.extend(nextSegment[k]);
                    }
                  }
                }

                polyline.setMap(map);

                computeTotalDistance(polyline, response);
              } else {
                console.log("directions response "+status);
              }
            });
          }

          var totalDist = 0;
          var totalTime = 0;
      function computeTotalDistance(polyline, result) {
          totalDist = 0;
          totalTime = 0;
          var myroute = result.routes[0];
          for (i = 0; i < myroute.legs.length; i++) {
            totalDist += myroute.legs[i].distance.value;
            totalTime += myroute.legs[i].duration.value;      
          }
          putMarkerOnRoute(polyline, 50);

          totalDist = totalDist / 1000;
      }

      function googlePlaceSearch(midpoint, map) {
        var service;

        var request = {
          location: midpoint, 
          radius: 700, 
          types: ['cafe', 'restaurant', 'bar']
        }

        service = new google.maps.places.PlacesService(map);
        service.nearbySearch(request, callback);
      }

      function callback(results, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
          for (var i = 0; i < results.length; i++) {
            var place = results[i];
            addMarker(results[i], map);
          }
        }
      }

      function addMarker(place, map) {
         var placeLoc = place.geometry.location;
         var marker = new google.maps.Marker({
          map: map,
          position: place.geometry.location,
          icon: {
            url: place.icon,
            scaledSize: new google.maps.Size(25, 25)
          }
         });

          google.maps.event.addListener(marker, 'click', function() {
              infowindow.setContent(place.name);
              infowindow.open(map, this);
          });
      }

      function putMarkerOnRoute(polyline, percentage) {

        var distance = (percentage/100) * totalDist;
        var time = ((percentage/100) * totalTime/60).toFixed(2);
        // console.log("Time:"+time+" totalTime:"+totalTime+" totalDist:"+totalDist+" dist:"+distance);

        if (!marker) {
                marker = createMarker(polyline.GetPointAtDistance(distance),"time: "+time,"marker");
        } else {

                var midpoint = polyline.GetPointAtDistance(distance);

                marker.setPosition(midpoint);
                googlePlaceSearch(midpoint, map);
                
        }
      }

    });



})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('SettingsCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };

});
