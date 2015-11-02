angular.module('starter.controllers', [])

.controller('SearchCtrl', function($scope, $location, GoogleMaps, localStorage, Meetups) {

    var activeMeetups = localStorage.getItem('addMeetup');
    $scope.places = activeMeetups;


    $scope.getDirections = function(pointB) {
      // user types in 'work', brings up work address
      console.log('clicked');
      var workAdd = localStorage.getItem('work').formatted_address;

      //local storage
      if (pointB === 'work') {
        return pointB = workAdd;
        console.log('pointB :: ', pointB);
      }

      // obj for meetups on Search View
      var placesObj = $scope.places;

      // if meetup is true, return 
      function isPlaceSelected(place) {
        if (place.checked) {
          return place;
        }
      }

      // taking place object, filtering, and just returning id
      var typeID = placesObj.filter(isPlaceSelected).map(function(place){
        return place.id;
      });


      // reroute user to map page with query string
      $location.url('/tabs/map?pointB=' + pointB.formatted_address + '&typeID=' + typeID);
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


          $scope.loading = $ionicLoading.show({
            template: '<img src="img/logo_blank.png" class="loading-icon">' +
                       '<p class="loading-text">Preparing Map...</p>'
          });

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

              var typeID = queryString.selectedTypeArray();

              // Calculate route, midpoint, all that jazz!
              GoogleMaps.calcRoute(pLine, userLocation, googleMap.map, pointB, typeID); 

            }

            $ionicLoading.hide();

          }

    });



})

.controller('SettingsCtrl', function($scope, localStorage, $cordovaAppRate, $cordovaDialogs, Meetups) {

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
    popupInfo.title = "Rate Meet Me There";
    popupInfo.message = "You like Meet Me There? We would be glad if you share your experience with others. Thanks for your support!";
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

  // Meetup Logic Starts here

  localStorage.submit('meetupList', Meetups.types);
  var lsList = localStorage.getItem('meetupList');
  
  $scope.meetups = lsList;

  var ls = localStorage.getItem('addMeetup');
  var lsArr = [];


  $scope.updateLS = function(meetup) {
    for (var i = 0; i < lsList.length; i++) {

      if (meetup.checked) {
        lsArr.push(meetup);
        localStorage.submit('addMeetup', lsArr);
        console.log(lsArr);
      } else {
        console.log(lsList);
      }
    }

  }

  $scope.removeLSItem = function() {
    localStorage.bind($scope, 'addMeetup');
  }

  $scope.goBack = function() {
    $location.url('/tab/settings');
  }

});





