angular.module('MapController', [])

.controller('GoogleMapCtrl', function(
  $scope, $state, $stateParams, $cordovaGeolocation, $ionicLoading, 
  GoogleMaps, Meetups, queryString, localStorageService,
  $cordovaSms, $cordovaToast, $cordovaAppAvailability, $cordovaInAppBrowser, $timeout) {

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

              GoogleMaps.calcRoute(pLine, userLocation, googleMap.map, pointA, pointB, typeID).then(function(results){

                // $scope.dataLoaded = false;

                // $scope.dataLoaded = true;

                $scope.results = results;


              }, function(error){
                console.log(error);
              }); 

            }

            $scope.noresults = 'Sorry, no meetups found! Try expanding the search radius under the Settings tab.';

            // $ionicLoading.hide(); 

            document.addEventListener("deviceready", function() {

              $scope.getMoreInfo = function(placeId) {
                
                GoogleMaps.googleGetPlaceDetails(placeId, googleMap.map).then(function(url) {

                  var options = {
                    location: 'yes',
                    clearcache: 'yes',
                    toolbarposition: 'top',
                    closebuttoncaption: 'Close'
                  };

                  $cordovaInAppBrowser.open(url, '_blank', options)
                        .then(function(event) {
                          // success
                        })
                        .catch(function(event) {
                          // error
                        });
                        
                });

                
            };

            }, false);

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

});