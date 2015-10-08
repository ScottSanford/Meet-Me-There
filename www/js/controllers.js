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

.controller('GoogleMapCtrl', function($scope, uiGmapGoogleMapApi, $cordovaGeolocation, $ionicLoading) {

      $scope.loading = $ionicLoading.show();

      // get position of user and then set the center of the map to that position
      $cordovaGeolocation
        .getCurrentPosition()
        .then(function (position) {

          var map;
          var service;
          var infowindow;

          // get coordinates of user
          var latitude  = position.coords.latitude
          var longitude = position.coords.longitude

          $scope.ratingStates = [
            {stateOn: 'glyphicon-usd', stateOff: 'glyphicon-usd'},
            {stateOn: 'glyphicon-usd', stateOff: 'glyphicon-usd'},
            {stateOn: 'glyphicon-usd', stateOff: 'glyphicon-usd'},
            {stateOn: 'glyphicon-usd', stateOff: 'glyphicon-usd'},
            {stateOn: 'glyphicon-usd', stateOff: 'glyphicon-usd'}
          ]

          function initGoogleMap() {
            var directionsService = new google.maps.DirectionsService;
            var directionsDisplay = new google.maps.DirectionsRenderer;
            var myLatLng = {
                  lat: latitude, 
                  lng: longitude
                };
            var googleMapOptions = {
                center: myLatLng, 
                zoom:15
            }

            map = new google.maps.Map(document.getElementById('map'), googleMapOptions);

            // create Marker on the map to show location
            var marker = new google.maps.Marker({
              position: googleMapOptions.center,
              map: map,
            });

            service = new google.maps.places.PlacesService(map);
            service.nearbySearch({
              location: myLatLng,
              radius: 500,
              types: ['cafe', 'restaurant', 'bar']
            }, callback);
            
            infowindow = new google.maps.InfoWindow();

            function callback(results, status) {
              if (status === google.maps.places.PlacesServiceStatus.OK) {
                for (var i = 0; i < results.length; i++) {
                    console.log(results[i]);
                    console.log("Types = ", results[i].types);
                    createMarker(results[i]);
                    $scope.results = results;
                }
              }
            }

            function createMarker(place) {
              var placeLoc = place.geometry.location;
              // var image = 'http://maps.google.com/mapfiles/ms/icons/coffeehouse.png';
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

            $scope.getDirections = function(pointB) {
              calculateAndDisplayRoute(myLatLng, pointB, directionsService, directionsDisplay, map);
            }
          }

          initGoogleMap();
          // hide Ionic Loading Icon
          $ionicLoading.hide();

          // // get directions using google maps api
         function calculateAndDisplayRoute(myLatLng, pointB, directionsService, directionsDisplay, map) {
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

          function createMarker(latlng) {
            var marker = new google.maps.Marker({
              position: latlng,
              map: map
            });
            return marker;
          }

          function computeTotalDistance(result) {
            totalDist = 0;
            var myroute = result.routes[0];
            for (i = 0; i < myroute.legs.length; i++) {
              totalDist += myroute.legs[i].distance.value;
              totalTime += myroute.legs[i].duration.value;      
            }
            putMarkerOnRoute(50);

            totalDist = totalDist / 1000;
          }

          function putMarkerOnRoute(percentage) {
            var distance = (percentage/100) * totalDist;
            if (!marker) {
              marker = createMarker(polyline.GetPointAtDistance(distance));
            } else {
              console.log('there was an error putting the marker on the map.');
            }
          }

        }, function(err) {
          console.log('there was an error', err);
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
