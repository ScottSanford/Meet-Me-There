angular.module('localstorage', [])

.factory('localStorage', ['localStorageService', function(localStorageService) {
  return {
      submit: function(key, val) {
        return localStorageService.set(key,val);
      }, 
      getItem: function(key) {
        return localStorageService.get(key);
      },
      keyList: function() {
        return localStorageService.keys();
      }, 
      bind: function(key, val) {
        return localStorageService.bind(key,val);
      }, 
      removeItem: function(key) {
        return localStorageService.remove(key);
      }
  }
}]);