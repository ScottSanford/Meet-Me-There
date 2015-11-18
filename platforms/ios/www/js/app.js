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
  'AppRateService',
  'EmailComposerService',
  'uiGmapgoogle-maps',
  'ngCordova', 
  'ion-google-place',
  'ui.bootstrap', 
  'ngAnimate', 
  'ionic.contrib.drawer.vertical', 
  'LocalStorageModule', 
  'localstorage', 
  'ngCordova.plugins.appRate', 
  'queryString', 
  'meetups', 
  'ngMessages',
  'ngIOS9UIWebViewPatch', 
  'starter.directives'
])


.run(function($ionicPlatform, $ionicPopup) {
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

    if(window.Connection) {
        if(navigator.connection.type == Connection.NONE) {
            $ionicPopup.confirm({
                title: "Internet Disconnected",
                content: "The internet is disconnected on your device."
            })
            .then(function(result) {
                if(!result) {
                    ionic.Platform.exitApp();
                }
            });
        }
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
    .state('tabs', {
      url:'/tabs',
      abstract: true,
      templateUrl: 'templates/tabs.html'
    })
    .state('tabs.search', {
      cache: false,
      url: '/search',
      views: {
        'tabs-search': {
          templateUrl: 'templates/tab-search.html',
          controller: 'SearchCtrl'
        }
      }
    })
    .state('tabs.map', {
        cache: false,
        url: '/map?pointA&pointB&typeID',
        views: {
          'tabs-map': {
            templateUrl: 'templates/tab-map.html',
            controller: 'GoogleMapCtrl'
          }
        }
      })
    .state('tabs.meetups', {
      url: '/meetups',
      views: {
        'tabs-settings': {
          templateUrl: 'templates/meetups.html', 
          controller: 'SettingsCtrl'
        }
      }
    })
    .state('tabs.radius', {
      url: '/radius',
      views: {
        'tabs-settings': {
          templateUrl: 'templates/radius-range.html', 
          controller: 'SettingsCtrl'
        }
      }
    })
    .state('tabs.favorites', {
      url: '/favorites',
      views: {
        'tabs-settings': {
          templateUrl: 'templates/favorites.html', 
          controller: 'SettingsCtrl'
        }
      }
    })
    .state('tabs.settings', {
      url: '/settings',
      views: {
        'tabs-settings': {
          templateUrl: 'templates/tab-settings.html',
          controller: 'SettingsCtrl'
        }
      }
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tabs/search');

  document.addEventListener("deviceready", function () {

   var prefs = {
     language: 'en',
     appName: 'MY APP',
     iosURL: '<my_app_id>'
   };

   $cordovaAppRateProvider.setPreferences(prefs)

 }, false);

});
