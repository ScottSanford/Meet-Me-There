angular.module('starter.controllers', [])

.controller('SearchCtrl', function($scope, $location, GoogleMaps, localStorage, Meetups) {

    function displayOnlyActiveMeetups() {
      var activeMeetups = localStorage.getItem('meetupList');
      var aMeetups = [];
      for (var i = 0; i < activeMeetups.length; i++) {
        if (activeMeetups[i].checked) {
          aMeetups.push(activeMeetups[i]);
        }
      }
      return aMeetups;
    }

    $scope.places = displayOnlyActiveMeetups();

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
  $scope, $state, $window,
  $stateParams, $cordovaGeolocation, $ionicLoading, 
  GoogleMaps, queryString) {

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


        



})

.controller('SettingsCtrl', function($scope, localStorage, $cordovaEmailComposer, EmailComposer, $cordovaAppRate, $cordovaDialogs, Meetups, AppRate) {


  $scope.goBack = function() {
    $location.url('/tabs/settings');
  }

  // Save Work and Home Address

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


  // Meetup Logic Starts here

  function initMeetupList() {
    var lsKeys = localStorage.getKeys();
    for (var i=0; i< lsKeys.length; i++) {
      if (lsKeys[i] === 'meetupList') {
        var lsList = localStorage.getItem('meetupList');
        return lsList;
      } else {
        localStorage.submit('meetupList', Meetups.types);
        return Meetups.types;
      }
    }    
  }

  $scope.meetups = initMeetupList();

  $scope.updateLocalStorage = function(meetup) {
    localStorage.bind($scope, 'meetups', null, 'meetupList');
  }
  


  // Rate the App
  $scope.rateApp = function() {
    console.log(AppRate);
    $cordovaAppRate.promptForRating(true).then(function(){

      $cordovaAppRate.setPreferences(AppRate);

    }, function() {
      console.log('Oops! Something went wrong :(');
    });
  }


  // Give Feedback 
  $scope.giveFeedback = function() {

    $cordovaEmailComposer.isAvailable().then(function(){
      console.log('Success, the plugin is available!');
      $cordovaEmailComposer.open(EmailComposer);
    }, function(){
      console.log('Error, the plugin is not available');
    })

  }


});





