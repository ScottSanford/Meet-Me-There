angular.module('queryString', [])

.factory('queryString', ['$window', function($window) {
  return {

        selectedTypeArray: function selectedTypeArray() {

          var query_string = QueryStringToJSON();
          var placeArray = query_string.selectedPlaces.split(',');
          return placeArray;
         
        }
  }

         function QueryStringToJSON() {

          var url = $window.location.href;
          var queryString = url.substring(url.indexOf('?') + 1);
          var pairs = queryString.split('&');
          
          var result = {};
          pairs.forEach(function(pair){
            pair = pair.split('=');
            result[pair[0]] = decodeURIComponent(pair[1] || '');
          })

          return JSON.parse(JSON.stringify(result));
          
        }
}]);