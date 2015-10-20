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

          // set global variables
          var directionDisplay;
          var map;
          var marker;
          var service;
          var infowindow;
          var polyline = null;
          var userLocation = {
              lat: position.coords.latitude, 
              lng: position.coords.longitude
          };

          // init Google Maps 
          initialize(userLocation);

          function initialize(userLocation) {

            GoogleMaps.initGoogleMap(userLocation);

            $scope.getDirections = function (pointB) {
                GoogleMaps.calcRoute(pLine, userLocation, googleMap.map, pointB);
            }

            $ionicLoading.hide();

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
