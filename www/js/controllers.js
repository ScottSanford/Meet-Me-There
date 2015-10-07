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

          // get coordinates of user
          var latitude  = position.coords.latitude
          var longitude = position.coords.longitude

          function initGoogleMap() {
            var directionsService = new google.maps.DirectionsService;
            var directionsDisplay = new google.maps.DirectionsRenderer;
            var googleMapOptions = {
                center: {
                  lat: latitude, 
                  lng: longitude
                }, 
                zoom:15
            }

            var map = new google.maps.Map(document.getElementById('map'), googleMapOptions);

            // create Marker on the map to show location
            var marker = new google.maps.Marker({
              position: googleMapOptions.center,
              map: map,
            });

            $scope.getDirections = function() {
              calculateAndDisplayRoute(directionsService, directionsDisplay, map);
            }
          }

          initGoogleMap();
          // hide Ionic Loading Icon
          $ionicLoading.hide();

          // // get directions using google maps api
         function calculateAndDisplayRoute(directionsService, directionsDisplay, map) {
            directionsService.route({
              origin: 'Chicago, IL',
              destination: 'St. Louis, MO',
              travelMode: google.maps.TravelMode.DRIVING
            }, function(response, status) {
              if (status === google.maps.DirectionsStatus.OK) {
                console.log("Success=", response);
                console.log('map', map);
                directionsDisplay.setMap(map);
                directionsDisplay.setDirections(response);
              } else {
                console.log('Directions request failed due to ' + status);
              }
            });
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
