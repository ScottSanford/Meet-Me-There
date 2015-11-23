angular.module('SearchController', [])

.controller('SearchCtrl', function($scope, $location, localStorageService) {

    $scope.pointB = '';
    var places;

    var displaySuggestions = function(predictions, status) {

      var results = [];

      predictions.forEach(function(prediction) {
        results.push(prediction);
      });

      places = results;
      return places;

    };


    $scope.getPlaces = function(query) {
      var service = new google.maps.places.AutocompleteService();
      service.getPlacePredictions({ input: query || 'ch' }, displaySuggestions);

      if (query) {
        return {
          results: places
        }
      }
      return {results: []};
    };




    function fillInAddress() {


      var place = autocomplete.getPlacePredictions({input: query});

    }

    function geolocate() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
          var geolocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          var circle = new google.maps.Circle({
            center: geolocation,
            radius: position.coords.accuracy
          });
          autocomplete.setBounds(circle.getBounds());
        });
      }
    }

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
        $location.url('/tabs/map?pointA=' + pointA + '&pointB=' + pointB + '&typeID=' + typeID);
      } else {
        $location.url('/tabs/map?pointA=' + pointA + '&pointB=' + pointB + '&typeID=' + typeID); 
      }
    };

});