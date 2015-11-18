angular.module('AppRateService', [])

.factory('AppRate', function() {
  
  var prefs = {
     language: 'en',
     appName: 'Meet Me There',
     iosURL: '<my_app_id>', 
     openStoreInApp: true
  } 

  return prefs;

});