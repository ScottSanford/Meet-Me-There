angular.module('starter.controllers', [])

.controller('SearchCtrl', function($scope, $location, GoogleMaps, localStorage) {

    $scope.places = [
                {"type": "Coffee","checked": false},
                {"type": "Food","checked": false},
                {"type": "Drinks", "checked": false}
            ]

    $scope.getDirections = function(pointB) {

      var workAdd = localStorage.getItem('work').formatted_address;

      if (pointB === 'work') {
        return pointB = workAdd;
        console.log('pointB :: ', pointB);
      }

        // $location.url('/tab/map?pointB=' + pointB.formatted_address);
    };

})

.controller('GoogleMapCtrl', function(
  $scope, 
  $state,
  $window,
  $stateParams,
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

          var pointB = $stateParams.pointB;
          // init Google Maps 
          initialize(userLocation);

          function initialize(userLocation) {

            GoogleMaps.initGoogleMap(userLocation);

            if ($stateParams.pointB) {
              GoogleMaps.calcRoute(pLine, userLocation, googleMap.map, pointB); 
            }

            $ionicLoading.hide();

          }

    });



})

.controller('SettingsCtrl', function($scope, localStorage) {

  var home = localStorage.getItem('home');
  var work = localStorage.getItem('work');

  if (home == undefined) {
    $scope.userHomeAddress = 'Enter your home address';
  } 

  if (work == undefined) {
    $scope.userWorkAddress = 'Enter your work address'; 
  } else {

    var homeAdd = localStorage.getItem('home').formatted_address;
    var workAdd = localStorage.getItem('work').formatted_address;

    $scope.userHomeAddress = homeAdd;
    $scope.userWorkAddress = workAdd;

  }


  $scope.saveChanges = function(homeAddress, workAddress) {
    console.log("Home Address :: " , homeAddress);
    console.log("Work Address :: " , workAddress);
    localStorage.submit('home', homeAddress);
    localStorage.submit('work', workAddress);
  }

});
