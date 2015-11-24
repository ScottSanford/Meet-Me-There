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
  // Meetup View

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

/////////////////////////////////////////////////////////////////////////////////
///////////////////////////// TRAVEL MODE VIEW /////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

  $scope.travelModes = [
    {
      text: 'Driving', 
      value: google.maps.TravelMode.DRIVING
    },
    {
      text: 'Transit', 
      value: google.maps.TravelMode.TRANSIT
    },    
    {
      text: 'Walking', 
      value: google.maps.TravelMode.WALKING
    },
    {
      text: 'Bicycling', 
      value: google.maps.TravelMode.BICYCLING
    }
  ];
  var travelLS = localStorageService.get('travelMode');
  $scope.radio = {
    checked: travelLS !== null ? travelLS : google.maps.TravelMode.DRIVING 
  }

  $scope.changedTravelMode = function(mode) {
      
    localStorageService.set('travelMode', mode);

  }

  /////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////// RADIUS RANGE  VIEW ///////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////
  $scope.changedRadiusRange = function(range) {

    localStorageService.set('radiusRange', range);
    
  }

  var rRange = localStorageService.get('radiusRange');

  $scope.radiusRange = rRange !== null ? rRange : 800;

/////////////////////////////////////////////////////////////////////////////////
///////////////////////////// CUSTOMIZE MIDPOINT VIEW //////////////////////////
///////////////////////////////////////////////////////////////////////////////

  $scope.changedMidpoint = function(midpoint) {

    localStorageService.set('midpointPercentage', midpoint);

  }

  var mpPercentage = localStorageService.get('midpointPercentage');

  $scope.midpointPercentage = mpPercentage !== null ? mpPercentage : 50;

/////////////////////////////////////////////////////////////////////////////////
///////////////////////////// RATE APP /////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

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

/////////////////////////////////////////////////////////////////////////////////
///////////////////////////// EMAIL VIEW ///////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////


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





