angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $location) {
    $scope.places = [
                {"type": "Coffee","checked": false},
                {"type": "Food","checked": false},
                {"type": "Drinks", "checked": false}
            ]

    $scope.gotoMap = function() {
        $location.url('/tab/map');
    }
})

.controller('GoogleMapCtrl', function($scope, uiGmapGoogleMapApi) {
       $scope.myLocation = {
        lng : '',
        lat: ''
      }
       
      $scope.drawMap = function(position) {
     
        //$scope.$apply is needed to trigger the digest cycle when the geolocation arrives and to update all the watchers
        $scope.$apply(function() {
          $scope.myLocation.lng = position.coords.longitude;
          $scope.myLocation.lat = position.coords.latitude;
     
          $scope.map = {
            center: {
              latitude: $scope.myLocation.lat,
              longitude: $scope.myLocation.lng
            },
            zoom: 14,
            pan: 1
          };
     
          $scope.marker = {
            id: 0,
            coords: {
              latitude: $scope.myLocation.lat,
              longitude: $scope.myLocation.lng
            }
          }; 

          $scope.searchbox = {
            template:'searchbox.tpl.html', 
            position:'top-center', 
            options: { bounds: {} }, 
            events: {
              places_changed: function(searchBox){
                console.log(searchBox);
                var places = searchBox.getPlaces(); 

                if (places.length == 0) {
                  return;
                }
              }
            }
          }
           
        });
      }
     
      navigator.geolocation.getCurrentPosition($scope.drawMap);  
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
