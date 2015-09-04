angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {
    $scope.places = [
                {"type": "Coffee","checked": false},
                {"type": "Food","checked": false},
                {"type": "Drinks", "checked": false}
            ]
})

.controller('GoogleMapCtrl', function($scope, Chats, uiGmapGoogleMapApi) {
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
