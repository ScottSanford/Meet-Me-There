angular.module('starter.controllers', [])

.controller('SearchCtrl', function($scope, $location, GoogleMaps, localStorage, Meetups) {

    console.log(Meetups.types);

    function activeMeetups() {
      var activeMeetups = [];
      for (var i = 0; i < Meetups.types.length; i++) {
        if (Meetups.types[i].checked) {
          activeMeetups.push(Meetups.types[i])
        }
      }
      return activeMeetups;
    }

    $scope.places = activeMeetups();

    $scope.getDirections = function(pointB) {

      var placesObj = $scope.places;

      function isPlaceSelected(place) {
        if (place.checked) {
          return place;
        }
      }

      var typeID = placesObj.filter(isPlaceSelected).map(function(place){
        return place.id;
      });

      var workAdd = localStorage.getItem('work').formatted_address;

      //local storage
      if (pointB === 'work') {
        return pointB = workAdd;
        console.log('pointB :: ', pointB);
      }

      // reroute user to map page with query string
      $location.url('/tab/map?pointB=' + pointB.formatted_address + '&typeID=' + typeID);
    };

})

.controller('GoogleMapCtrl', function(
  $scope, 
  $state,
  $window,
  $stateParams,
  $cordovaGeolocation, 
  $ionicLoading, 
  GoogleMaps, 
  queryString) {


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
          var typeID = queryString.selectedTypeArray();
          // init Google Maps 
          initialize(userLocation, typeID);

          function initialize(userLocation, typeID) {

            GoogleMaps.initGoogleMap(userLocation, typeID);

            if ($stateParams.pointB) {
              GoogleMaps.calcRoute(pLine, userLocation, googleMap.map, pointB, typeID); 
            }

            $ionicLoading.hide();

          }

    });



})

.controller('SettingsCtrl', function($scope, localStorage, $cordovaAppRate, $cordovaDialogs) {

  console.log($cordovaDialogs);

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

  // Rate the App
  $scope.rateApp = function() {
    // 1
    AppRate.preferences.useLanguage = 'en';
     
    // 2
    var popupInfo = {};
    popupInfo.title = "Rate YOUR APPTITLE";
    popupInfo.message = "You like YOUR APPTITLE? We would be glad if you share your experience with others. Thanks for your support!";
    popupInfo.cancelButtonLabel = "No, thanks";
    popupInfo.laterButtonLabel = "Remind Me Later";
    popupInfo.rateButtonLabel = "Rate Now";
    AppRate.preferences.customLocale = popupInfo;
     
    // 3
    AppRate.preferences.openStoreInApp = true;
     
    // 4
    AppRate.preferences.storeAppURL.ios = '849930087';
    // AppRate.preferences.storeAppURL.android = 'market://details?id=<package_name>';
     
    // 5 
    AppRate.promptForRating(true);
  }

})

.controller('MeetupsCtrl', function($scope, Meetups) {

    $scope.meetups = Meetups.types;

});






