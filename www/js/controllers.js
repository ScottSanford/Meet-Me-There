angular.module('starter.controllers', [])

.controller('SearchCtrl', function($scope, $location) {

    $scope.places = [
                {"type": "Coffee","checked": false},
                {"type": "Food","checked": false},
                {"type": "Drinks", "checked": false}
            ]

    $scope.gotoMap = function() {
        $location.url('/tab/map');
    }

})

.controller('GoogleMapCtrl', function($scope, uiGmapGoogleMapApi, $cordovaGeolocation, $ionicLoading) {

      $scope.loading = $ionicLoading.show();

      // get position of user and then set the center of the map to that position
      $cordovaGeolocation
        .getCurrentPosition()
        .then(function (position) {
          var latitude  = position.coords.latitude
          var longitude = position.coords.longitude
          $scope.map = {
            center: {
              latitude: latitude, 
              longitude: longitude
            }, 
            zoom: 14 
          };
          $scope.marker = {
            id: 0,
            coords: {
              latitude: latitude, 
              longitude: longitude
            }
          }
          $ionicLoading.hide();
        }, function(err) {
          console.log('there was an error', err);
        });

})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('SettingsCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };

});
