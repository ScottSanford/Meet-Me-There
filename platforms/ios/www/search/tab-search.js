angular.module('SearchController', [])

.controller('SearchCtrl', function($scope, $location, localStorageService) {

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

});