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

.controller('GoogleMapCtrl', function(
  $scope, 
  uiGmapGoogleMapApi, 
  $cordovaGeolocation, 
  $ionicLoading) {

          initialize();
      // $scope.loading = $ionicLoading.show();

          $scope.ratingStates = [
            {stateOn: 'glyphicon-usd', stateOff: 'glyphicon-usd'},
            {stateOn: 'glyphicon-usd', stateOff: 'glyphicon-usd'},
            {stateOn: 'glyphicon-usd', stateOff: 'glyphicon-usd'},
            {stateOn: 'glyphicon-usd', stateOff: 'glyphicon-usd'},
            {stateOn: 'glyphicon-usd', stateOff: 'glyphicon-usd'}
          ]


          var directionDisplay;
          var map;
          var polyline = null;
          var infowindow = new google.maps.InfoWindow();

          function createMarker(latlng, label, html) {
              console.log(latlng+", " + label + ", " + html + ")");
              var contentString = '<b>'+label+'</b><br>'+html;
              var marker = new google.maps.Marker({
                  position: latlng,
                  map: map,
                  title: label,
                  zIndex: Math.round(latlng.lat()*-100000)<<5
                  });
                  marker.myname = label;
                  // gmarkers.push(marker);

              google.maps.event.addListener(marker, 'click', function() {
                  infowindow.setContent(contentString+"<br>"+marker.getPosition().toUrlValue(6)); 
                  infowindow.open(map,marker);
                  });
              return marker;
          }

          function initialize() {
            directionsDisplay = new google.maps.DirectionsRenderer();
            var chicago = new google.maps.LatLng(41.850033, -87.6500523);
            var myOptions = {
              zoom: 6,
              mapTypeId: google.maps.MapTypeId.ROADMAP,
              center: chicago
            }
            map = new google.maps.Map(document.getElementById("map"), myOptions);
            polyline = new google.maps.Polyline({
              path: [],
              strokeColor: '#FF0000',
              strokeWeight: 3
            });
            directionsDisplay.setMap(map);
            calcRoute(polyline);
          }
  
          function calcRoute(polyline) {

            var directionsService = new google.maps.DirectionsService();
            var start = 'Chicago, IL';
            var end = 'St. Louis, MO';
            var travelMode = google.maps.DirectionsTravelMode.DRIVING

            var request = {
                origin: start,
                destination: end,
                travelMode: travelMode
            };
            directionsService.route(request, function(response, status) {
              if (status == google.maps.DirectionsStatus.OK) {
                polyline.setPath([]);
                var bounds = new google.maps.LatLngBounds();
                startLocation = new Object();
                endLocation = new Object();
              
                directionsDisplay.setDirections(response);
                var route = response.routes[0];

                // For each route, display summary information.
                var path = response.routes[0].overview_path;
                var legs = response.routes[0].legs;
                for (i=0;i<legs.length;i++) {
                  if (i == 0) { 
                    startLocation.latlng = legs[i].start_location;
                    startLocation.address = legs[i].start_address;
                    // marker = google.maps.Marker({map:map,position: startLocation.latlng});
                    marker = createMarker(legs[i].start_location,"midpoint","","green");
                  }
                  endLocation.latlng = legs[i].end_location;
                  endLocation.address = legs[i].end_address;
                  var steps = legs[i].steps;
                  for (j=0;j<steps.length;j++) {
                    var nextSegment = steps[j].path;
                    for (k=0;k<nextSegment.length;k++) {
                      polyline.getPath().push(nextSegment[k]);
                      bounds.extend(nextSegment[k]);
                    }
                  }
                }

                polyline.setMap(map);

                computeTotalDistance(polyline, response);
              } else {
                alert("directions response "+status);
              }
            });
          }

      var totalDist = 0;
      var totalTime = 0;
      function computeTotalDistance(polyline, result) {
      totalDist = 0;
      totalTime = 0;
      var myroute = result.routes[0];
      for (i = 0; i < myroute.legs.length; i++) {
        totalDist += myroute.legs[i].distance.value;
        totalTime += myroute.legs[i].duration.value;      
      }
      putMarkerOnRoute(polyline, 50);

      totalDist = totalDist / 1000.
      }

      function putMarkerOnRoute(polyline, percentage) {

        var distance = (percentage/100) * totalDist;
        var time = ((percentage/100) * totalTime/60).toFixed(2);
        console.log("Time:"+time+" totalTime:"+totalTime+" totalDist:"+totalDist+" dist:"+distance);

        if (!marker) {
                marker = createMarker(polyline.GetPointAtDistance(distance),"time: "+time,"marker");
                console.log('true');
        } else {
                marker.setPosition(polyline.GetPointAtDistance(distance));
                marker.setTitle("time:"+time);
                console.log('false');
        }
      }


})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('SettingsCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };

});
