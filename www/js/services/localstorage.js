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
      bind: function(scope, property, value, key) {
        return localStorageService.bind(scope, property, value, key);
      }, 
      removeKey: function(key) {
        return localStorageService.remove(key);
      }, 
      getKeys: function() {
        return localStorageService.keys();
      }
  }
}]);