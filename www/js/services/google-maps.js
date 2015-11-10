angular.module('GoogleMapsService', [])

.factory('GoogleMaps', function($q) {
  
  var totalDist = 0;

  var GoogleMaps = {
    POI: null, 
    pLine: null
  }; 

      GoogleMaps.initGoogleMap = function(userLocation) {
          directionsDisplay = new google.maps.DirectionsRenderer();

          // options for Google Maps
          var myOptions = {
            zoom: 14,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            center: userLocation
          }

          // google map
          map = new google.maps.Map(document.getElementById("map"), myOptions);

          // place marker on GeoLocation
          marker = new google.maps.Marker({
            position: userLocation, 
            map: map
          });

          var infowindow = new google.maps.InfoWindow();

          google.maps.event.addListener(marker, 'click', function() {
            infowindow.setContent("You are here!"); 
            infowindow.open(map,marker);
          });

          // polyline for later use of MidPoint
          polyline = new google.maps.Polyline({
            path: [],
            strokeColor: '#FF0000',
            strokeWeight: 0
          });

          // // show directions
          directionsDisplay.setMap(map);

          pLine = polyline;
          map = map;

          // return variables for other functions
          return googleMap = {
              pLine: pLine,
              map: map
          };  

          GoogleMaps.pLine = pline;
      };

      GoogleMaps.calcRoute = function (pLine, userLocation, map, pointA, pointB, typeID) {
          var deferred = $q.defer();
          var directionsService = new google.maps.DirectionsService();
          var start = pointA != "undefined" ? pointA : userLocation;
          var end = pointB;
          var travelMode = google.maps.DirectionsTravelMode.DRIVING
          var request = {
              origin: start,
              destination: end,
              travelMode: travelMode
          };

          directionsService.route(request, function(response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
              pLine.setPath([]);
              var bounds = new google.maps.LatLngBounds();

              directionsDisplay.setDirections(response);

              // set PolyLine on Google Map
              var path = response.routes[0].overview_path;
              var legs = response.routes[0].legs;
              for (i=0;i<legs.length;i++) {
                var steps = legs[i].steps;
                for (j=0;j<steps.length;j++) {
                  var nextSegment = steps[j].path;
                  for (k=0;k<nextSegment.length;k++) {
                    pLine.getPath().push(nextSegment[k]);
                    bounds.extend(nextSegment[k]);
                  }
                }
              }


              pLine.setMap(map);

              deferred.resolve(GoogleMaps.computeTotalDistance(pLine, response, map, typeID));

            } else {
              console.log("Directions query failed: " + status, request);
            } 
          });    
          return deferred.promise;                 
      };

      GoogleMaps.createMarker = function(latlng, label, html, map) {
        // console.log(latlng+", " + label + ", " + html + ")");
        var contentString = '<b>'+label+'</b><br>'+ html;
        var marker        = new google.maps.Marker({
            position: latlng,
            map: map,
            title: label,
            zIndex: Math.round(latlng.lat()*-100000)<<5, 
            icon: 'img/marker.png'
        });
        marker.myname  = label;
        var infowindow = new google.maps.InfoWindow();

        google.maps.event.addListener(marker, 'click', function() {
            infowindow.setContent(contentString+"<br>"); 
            console.log(marker);
            infowindow.open(map,marker);
            });
        return marker;
      }; 

      GoogleMaps.computeTotalDistance = function(pLine, response, map, typeID) {

          totalDist = 0;
          var myroute = response.routes[0];
          for (i = 0; i < myroute.legs.length; i++) {
            totalDist += myroute.legs[i].distance.value;
          }
          return GoogleMaps.putMarkerOnRoute(pLine, 50, map, typeID);

          // totalDist = totalDist / 1000;
      };

      GoogleMaps.putMarkerOnRoute = function(pLine, percentage, map, typeID) {

        var distance = (percentage/100) * totalDist;
        var marker;
        var midpoint = pLine.GetPointAtDistance(distance);

        if (!marker) {

            marker = GoogleMaps.createMarker(midpoint,"Midpoint","This is the midpoint of the locations.", map);
            return GoogleMaps.googlePlaceSearch(midpoint, map, typeID);

        } else {                

            marker.setPosition(midpoint);
            return GoogleMaps.googlePlaceSearch(midpoint, map, typeID);

        }
      };

      GoogleMaps.googlePlaceSearch = function(midpoint, map, typeID) {
        var deffered = $q.defer();
        var service;
        var request = {
          location: midpoint, 
          radius: 800, // .50 mile radius
          types: typeID
        }

        service = new google.maps.places.PlacesService(map);
        service.nearbySearch(request, function(results, status) {
          if (status == google.maps.places.PlacesServiceStatus.OK) {
            for (var i = 0; i < results.length; i++) {
              
              var POI = results[i];
              var scopePOI = results;

              deffered.resolve(scopePOI);
              
              GoogleMaps.addPOIMarker(POI, map);
            }
          }

        });
        return deffered.promise;
      };

      GoogleMaps.addPOIMarker = function(POI, map) {
          var marker;
          // var markers = [];
          var placeLoc = POI.geometry.location;
          // if (marker) {
          //   setMapOnAll(null);
          //   markers = [];
          // }
          marker   = new google.maps.Marker({
            map: map,
            position: placeLoc,
            icon: {
              url: POI.icon,
              scaledSize: new google.maps.Size(25, 25)
            }
          });
          infowindow = new google.maps.InfoWindow();

          google.maps.event.addListener(marker, 'click', function() {
              infowindow.close();
              infowindow.setContent(POI.name);
              infowindow.open(map, this);
          });

      };

      GoogleMaps.midPoint = function(midpoint) {
        return midpoint;
      };

  return GoogleMaps;

});