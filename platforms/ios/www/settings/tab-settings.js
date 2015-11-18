angular.module('SettingsController', [])

.controller('SettingsCtrl', function($scope, localStorageService, $cordovaEmailComposer, EmailComposer, $cordovaAppRate, $cordovaDialogs, Meetups, AppRate) {

  // Save Work and Home Address

  var home = localStorageService.get('home');
  var work = localStorageService.get('work');

  if (home == undefined) {
    $scope.userHomeAddress = 'Enter your home address';
  } 

  if (work == undefined) {
    $scope.userWorkAddress = 'Enter your work address'; 
  } else {

    var homeAdd = localStorageService.get('home').formatted_address;
    var workAdd = localStorageService.get('work').formatted_address;

    $scope.userHomeAddress = homeAdd;
    $scope.userWorkAddress = workAdd;

  }

  $scope.saveChanges = function(homeAddress, workAddress) {
    console.log("Home Address :: " , homeAddress);
    console.log("Work Address :: " , workAddress);
    localStorageService.set('home', homeAddress);
    localStorageService.set('work', workAddress);
  }


  // Meetup Logic Starts here

  function initMeetupList() {
    var lsKeys = localStorageService.deriveKey();
    for (var i=0; i< lsKeys.length; i++) {
      if (lsKeys[i] === 'meetupList') {
        var lsList = localStorageService.get('meetupList');
        return lsList;
      } else {
        localStorageService.set('meetupList', Meetups.types);
        return Meetups.types;
      }
    }    
  }

  $scope.meetups = initMeetupList();

  $scope.updateLocalStorage = function(meetup) {
    var meetupList = localStorageService.get('meetupList');
    meetupList.forEach(function(m){
      if (m.id === meetup.id) {
        m.checked = meetup.checked;
      }
    })
    localStorageService.set('meetupList', meetupList);
  }
  
  $scope.changedRadiusRange = function(range) {

    localStorageService.set('radiusRange', range);
    
  }

  $scope.radiusRange = localStorageService.get('radiusRange') !== null ? localStorageService.get('radiusRange') : 800;


    document.addEventListener('deviceready', function(){

      // Rate the App
      $scope.rateApp = function() {
        
        $cordovaAppRate.promptForRating(true).then(function(){

          $cordovaAppRate.setPreferences(AppRate);

        }, function() {
          console.log('Oops! Something went wrong :(');
        });
      }

    });


  document.addEventListener('deviceready', function(){

    // Give Feedback 
    $scope.giveFeedback = function() {

      $cordovaEmailComposer.isAvailable().then(function(){

        $cordovaEmailComposer.open(EmailComposer).then(function(){

        });

      }, function(){
        console.log('Error, the plugin is not available');
      });

    }

  });


});





