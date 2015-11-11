angular.module('starter.controllers', [])

.controller('SearchCtrl', function($scope, $location, GoogleMaps, localStorageService, Meetups) {

    function displayOnlyActiveMeetups() {
      return localStorageService.get('meetupList').filter(function(meetup){
        return meetup.checked;
      });
    }

    $scope.places = displayOnlyActiveMeetups();

    $scope.getDirections = function(pointA, pointB) {
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
      if (pointA === undefined) {
        $location.url('/tabs/map?pointA=' + pointA + '&pointB=' + pointB.formatted_address + '&typeID=' + typeID);
      } else {
        $location.url('/tabs/map?pointA=' + pointA.formatted_address + '&pointB=' + pointB.formatted_address + '&typeID=' + typeID); 
      }
    };

})

.controller('GoogleMapCtrl', function(
  $scope, $state, $window,
  $stateParams, $cordovaGeolocation, $ionicLoading, 
  GoogleMaps, Meetups, queryString, $cordovaSms, $cordovaToast, $cordovaAppAvailability, localStorageService, $timeout) {

      var userLocation;
      var directionsDisplay;
      var map;
      var marker;
      var service;
      var infowindow;
      var polyline = null;
      
      // init loading message
      $scope.loading = $ionicLoading.show({
        template: '<img src="img/icon.png" class="loading-icon">' +
                   '<p class="loading-text">Finding meetups...</p>'
      });

      // init google maps
      if (document.readyState === "complete") {
        initialize();
      } else {
        google.maps.event.addDomListener(window, 'load', initialize);
      }

    function initialize(userLocation) {

        // set variables for parameters
        var pointA = $stateParams.pointA;
        var pointB = $stateParams.pointB;

        $scope.pointB = pointB;


        // get position of user and then set the center of the map to that position
        $cordovaGeolocation
          .getCurrentPosition()
          .then(function (position) {

            userLocation = {
                lat: position.coords.latitude, 
                lng: position.coords.longitude
            };

            GoogleMaps.initGoogleMap(userLocation);

            if ($stateParams.pointB) {

              var typeID = queryString.selectedTypeArray();

              // Calculate route, midpoint, all that jazz!
              GoogleMaps.calcRoute(pLine, userLocation, googleMap.map, pointA, pointB, typeID).then(function(results){
                $scope.results = results;

                function displayOnlyActiveMeetups() {
                  return localStorageService.get('meetupList').filter(function(meetup){
                    return meetup.checked;
                  });
                }

                $scope.titles = displayOnlyActiveMeetups();
              }, function(error){
                console.log(error);
                $scope.noresults = "Sorry, there were no close meet up locations. Please try again!";
              }); 

            }

            $ionicLoading.hide(); 


            $scope.openGoogleMapsApp = function(address) {

              console.log('userLocation :: ' , userLocation);

              var scheme = {
                url: 'comgooglemaps://?saddr=' + userLocation + '&daddr=' + address + '&directionsmode=driving'  
              }

              $cordovaAppAvailability.check(scheme.url).then(function(){
                console.log('open Google Maps Success!');
              });

            };

        });
      };

      // $$ expensive ratings (put in service)
      $scope.ratingStates = [
        {stateOn: 'glyphicon-usd', stateOff: 'glyphicon-usd'},
        {stateOn: 'glyphicon-usd', stateOff: 'glyphicon-usd'},
        {stateOn: 'glyphicon-usd', stateOff: 'glyphicon-usd'},
        {stateOn: 'glyphicon-usd', stateOff: 'glyphicon-usd'},
        {stateOn: 'glyphicon-usd', stateOff: 'glyphicon-usd'}
      ]

      $scope.sendTextMessage = function(name, address) {

        var sms = {
          number: '', 
          message: name + " :" + address
        }

        var options = {
          replaceLineBreaks: false
        }

        $cordovaSms.send(sms.number, sms.message, options).then(function() {
          // Success! SMS was sent
          console.log('message sent!');

          $cordovaToast.show('Your message was sent!', 'short', 'center').then(function(){
            console.log('toast message sent success!');
          })
        }, function(error) {
          // An error occurred
          console.log('message failed');
        });

      };

        



})

.controller('SettingsCtrl', function($scope, localStorageService, $cordovaEmailComposer, EmailComposer, $cordovaAppRate, $cordovaDialogs, Meetups, AppRate) {


  $scope.goBack = function() {
    $location.url('/tabs/settings');
  }

  // Save Work and Home Address

  var home = localStorageService.get('home');
  var work = localStorageService.get('work');

  if (home == undefined) {
    $scope.userHomeAddress = 'Enter your home address';
  } 

  if (work == undefined) {
    $scope.userWorkAddress = 'Enter your work address'; 
  } else {

    var homeAdd = localStorageService.get('home').formatted_address;
    var workAdd = localStorageService.get('work').formatted_address;

    $scope.userHomeAddress = homeAdd;
    $scope.userWorkAddress = workAdd;

  }

  $scope.saveChanges = function(homeAddress, workAddress) {
    console.log("Home Address :: " , homeAddress);
    console.log("Work Address :: " , workAddress);
    localStorageService.set('home', homeAddress);
    localStorageService.set('work', workAddress);
  }


  // Meetup Logic Starts here

  function initMeetupList() {
    var lsKeys = localStorageService.deriveKey();
    for (var i=0; i< lsKeys.length; i++) {
      if (lsKeys[i] === 'meetupList') {
        var lsList = localStorageService.get('meetupList');
        return lsList;
      } else {
        localStorageService.set('meetupList', Meetups.types);
        return Meetups.types;
      }
    }    
  }

  $scope.meetups = initMeetupList();

  $scope.updateLocalStorage = function(meetup) {
    var meetupList = localStorageService.get('meetupList');
    meetupList.forEach(function(m){
      if (m.id === meetup.id) {
        m.checked = meetup.checked;
      }
    })
    localStorageService.set('meetupList', meetupList);
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





