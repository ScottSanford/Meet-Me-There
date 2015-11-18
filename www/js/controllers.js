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
  $scope, $state, $stateParams, $cordovaGeolocation, $ionicLoading, 
  GoogleMaps, Meetups, queryString, localStorageService,
  $cordovaSms, $cordovaToast, $cordovaAppAvailability) {

      var directionsDisplay;
      var map;
      var marker;
      var service;
      var infowindow;
      var polyline = null;

      initialize();

      function initialize() {

        // set variables for parameters
        var pointA = $stateParams.pointA;
        var pointB = $stateParams.pointB;

        $scope.pointB = pointB;


        // get position of user and then set the center of the map to that position
        $cordovaGeolocation
          .getCurrentPosition()
          .then(function (position) {

            var userLocation = {
                lat: position.coords.latitude, 
                lng: position.coords.longitude
            };

            // $scope.loading = $ionicLoading.show({
            //   template: '<img src="img/icon.png" class="loading-icon">' +
            //            '<p class="loading-text">Finding meetups...</p>'
            // });

            GoogleMaps.initGoogleMap(userLocation);

            if ($stateParams.pointB) {


              var typeID = queryString.selectedTypeArray();

              // Calculate route, midpoint, all that jazz!
              GoogleMaps.calcRoute(pLine, userLocation, googleMap.map, pointA, pointB, typeID).then(function(results){

                $scope.results = results;

              }, function(error){
                console.log(error);
              }); 

            }

            $scope.noresults = 'Sorry, no meetups found! Try expanding the search radius under the Settings tab.';

            // $ionicLoading.hide(); 

            document.addEventListener("deviceready", function() {

              $scope.openGoogleMapsApp = function(address) {

                  var stringAddress = address.split(' ').join('+');

                  var scheme = 'comgooglemaps://?saddr=' + userLocation.lat + ',' + userLocation.lng + '&daddr=' + stringAddress + '&directionsmode=driving';

                  navigator.startApp.start(scheme, function(message){
                    console.log(message);
                  });

              };
              
            });

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

      document.addEventListener("deviceready", function() {

        var options = {
          replaceLineBreaks: false, // true to replace \n by a new line, false by default
        };
       
        $scope.sendTextMessage = function(name, address) {

          var sms = {
            number: '', 
            message: "Meet Me There:" + "\n" + name + "\n" + address
          }
       
          $cordovaSms
            .send(sms.number, sms.message, options)
            .then(function() {

            }, function(error) {

            });
        }
      });

        



})

.controller('SettingsCtrl', function($scope, localStorageService, $cordovaEmailComposer, EmailComposer, $cordovaAppRate, $cordovaDialogs, Meetups, AppRate) {

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
  
  $scope.changedRadiusRange = function(range) {

    localStorageService.set('radiusRange', range);
    
  }

  $scope.radiusRange = localStorageService.get('radiusRange') !== null ? localStorageService.get('radiusRange') : 800;


    document.addEventListener('deviceready', function(){

      // Rate the App
      $scope.rateApp = function() {
        
        $cordovaAppRate.promptForRating(true).then(function(){

          $cordovaAppRate.setPreferences(AppRate);

        }, function() {
          console.log('Oops! Something went wrong :(');
        });
      }

    });


  document.addEventListener('deviceready', function(){

    // Give Feedback 
    $scope.giveFeedback = function() {

      $cordovaEmailComposer.isAvailable().then(function(){

        $cordovaEmailComposer.open(EmailComposer).then(function(){

        });

      }, function(){
        console.log('Error, the plugin is not available');
      });

    }

  });


});





