angular.module('MapController', [])

.controller('GoogleMapCtrl', function(
  $scope, $state, $stateParams, $cordovaGeolocation, $ionicLoading, 
  GoogleMaps, Meetups, queryString, localStorageService,
  $cordovaSms, $cordovaToast, $cordovaAppAvailability, $cordovaInAppBrowser, $timeout, $ionicPlatform) {

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
        $ionicPlatform.ready(function(){

          $cordovaGeolocation
            .getCurrentPosition()
            .then(function (position) {

              var userLocation = {
                  lat: position.coords.latitude, 
                  lng: position.coords.longitude
              };

              localStorageService.set('userLocation', userLocation);

              // $scope.loading = $ionicLoading.show({
              //   template: '<img src="img/icon.png" class="loading-icon">' +
              //            '<p class="loading-text">Finding meetups...</p>'
              // });

              GoogleMaps.initGoogleMap(userLocation);

              if ($stateParams.pointB) {

                // fix bug issue when pointA=?pointB
                if (typeof pointA === 'undefined') {
                  pointA = 'undefined';
                }

                var typeID = queryString.selectedTypeArray();

                GoogleMaps.calcRoute(pLine, userLocation, googleMap.map, pointA, pointB, typeID).then(function(results){

                  // $scope.dataLoaded = false;

                  // $scope.dataLoaded = true;

                  var mLocation = results[0].mLocation;

                  getETA(mLocation); 
                  $scope.results = results;

                  results.forEach(function(value,i){
                    var thumbIcon = 'thumbIcon';
                    value[thumbIcon] = GoogleMaps.customMarker(value).thumb;
                  });


                }, function(error){
                  console.log(error);
                }); 

              }


              function getETA (midpoint) {
                  var directionsService = new google.maps.DirectionsService();
                  var start = pointA != "undefined" ? pointA : userLocation;
                  var end = midpoint;

                  var driving = google.maps.DirectionsTravelMode.DRIVING
                  var travelLocalStorage = localStorageService.get('travelMode');
                  
                  var travelType = travelLocalStorage != null ? travelLocalStorage : driving

                  var request = {
                      origin: start,
                      destination: end,
                      travelMode: travelType
                  };

                  directionsService.route(request, function(response, status) {
                    if (status == google.maps.DirectionsStatus.OK) {

                      var eta = response.routes[ 0 ].legs[ 0 ].duration.text;
                      $scope.eta = eta;
                      
                    }
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

                    $cordovaInAppBrowser.open(url, '_system', options)
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

                    var googleTravel = localStorageService.get('travelMode');
                    var appleTravel = localStorageService.get('appleMode');

                    var googleMode = googleTravel != null ? googleTravel : 'driving';
                    var appleMode = appleTravel != null ? appleTravel : 'd';

                    var googleScheme = 'comgooglemaps://?saddr=' + userLocation.lat + ',' + userLocation.lng + '&daddr=' + stringAddress + '&directionsmode=' + googleMode;
                    var appleScheme  = 'http://maps.apple.com/?saddr=' + userLocation.lat + ',' + userLocation.lng + '&daddr=' + stringAddress + '&dirflg=' + appleMode;
                    
                    $cordovaAppAvailability.check('comgooglemaps://')
                      .then(function(){
                          navigator.startApp.start(googleScheme, function(message){
                            console.log(message);
                          });
                      }, function(){
                          navigator.startApp.start(appleScheme, function(message){
                            console.log(message);
                          });
                      });
                };
                
              });

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
            message: "Meet You There:" + "\n" + name + "\n" + address
          }
       
          $cordovaSms
            .send(sms.number, sms.message, options)
            .then(function() {

            }, function(error) {

            });
        }
      });

});