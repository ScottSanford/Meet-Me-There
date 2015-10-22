// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('mmtApp', [
  'ionic', 
  'starter.controllers', 
  'GoogleMapsService', 
  'uiGmapgoogle-maps',
  'ngCordova', 
  'ion-google-place',
  'ui.bootstrap', 
  'ngAnimate', 
  'ionic.contrib.drawer.vertical', 
  'LocalStorageModule', 
  'localstorage', 
  'ngCordova.plugins.appRate', 
  'queryString'
])


.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }
  });
})

.filter('capitalize', function() {
    return function(input) {
      return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
    }
})

.config(function($stateProvider, $urlRouterProvider, uiGmapGoogleMapApiProvider, $cordovaAppRateProvider) {

  uiGmapGoogleMapApiProvider.configure({
      //    key: 'your api key',
      v: '3.20', //defaults to latest 3.X anyhow
      libraries: 'places' // Required for SearchBox.
  });

  $stateProvider
    .state('tab', {
      url: '/tab',
      abstract: true,
      templateUrl: 'templates/tabs.html'
    })
    .state('tab.search', {
      url: '/search',
      views: {
        'tab-search': {
          templateUrl: 'templates/tab-search.html',
          controller: 'SearchCtrl'
        }
      }
    })
    .state('tab.map', {
        url: '/map?pointB&selectedPlaces',
        views: {
          'tab-map': {
            templateUrl: 'templates/tab-map.html',
            controller: 'GoogleMapCtrl'
          }
        }
      })
    .state('tab.settings', {
      url: '/settings',
      views: {
        'tab-settings': {
          templateUrl: 'templates/tab-settings.html',
          controller: 'SettingsCtrl'
        }
      }
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/map');

  document.addEventListener("deviceready", function () {

   var prefs = {
     language: 'en',
     appName: 'MY APP',
     iosURL: '<my_app_id>'
   };

   $cordovaAppRateProvider.setPreferences(prefs)

 }, false);

});
