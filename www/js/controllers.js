angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {

})

.controller('GoogleMapCtrl', function($scope, Chats, $cordovaGeolocation) {
   $scope.map = { 
      center: { 
          latitude: 41.881832, 
          longitude: -87.623177
          }, 
      zoom: 13
    };

    $scope.marker = {
      id: 0,
      coords: {
          latitude: 41.881832, 
          longitude: -87.623177 
      }
    }
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
