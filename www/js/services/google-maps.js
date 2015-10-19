angular.module('GoogleMapsService', [])

.factory('GoogleMaps', function() {
  
  return {
      calcRoute:  function calcRoute(polyline, userLocation, map, pointB) {
          var directionsService = new google.maps.DirectionsService();
          var start = userLocation;
          var end = pointB.formatted_address;
          var travelMode = google.maps.DirectionsTravelMode.DRIVING
          var request = {
              origin: start,
              destination: end,
              travelMode: travelMode
          };
          var marker;

          directionsService.route(request, function(response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
              polyline.setPath([]);
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
                    polyline.getPath().push(nextSegment[k]);
                    bounds.extend(nextSegment[k]);
                  }
                }
              }

              polyline.setMap(map);

              computeTotalDistance(polyline, response, map);

            } 
          });                     
      }
  } 

  function createMarker(latlng, label, html, map) {
        // console.log(latlng+", " + label + ", " + html + ")");
        var contentString = '<b>'+label+'</b><br>'+ html;
        var marker        = new google.maps.Marker({
            position: latlng,
            map: map,
            title: label,
            zIndex: Math.round(latlng.lat()*-100000)<<5
        });
        marker.myname  = label;
        var infowindow = new google.maps.InfoWindow();

        google.maps.event.addListener(marker, 'click', function() {
            infowindow.setContent(contentString+"<br>"+marker.getPosition().toUrlValue(6)); 
            infowindow.open(map,marker);
            });
        return marker;
  }

  var totalDist = 0;
  function computeTotalDistance(polyline, response, map) {
      totalDist = 0;
      var myroute = response.routes[0];
      for (i = 0; i < myroute.legs.length; i++) {
        totalDist += myroute.legs[i].distance.value;
      }
      putMarkerOnRoute(polyline, 50, map);

      // totalDist = totalDist / 1000;
  }

  function putMarkerOnRoute(polyline, percentage, map) {

    var distance = (percentage/100) * totalDist;
    var marker;
    var midpoint = polyline.GetPointAtDistance(distance);

    if (!marker) {

        marker = createMarker(midpoint,"midPoint","this is the midpoint of the locations.", map);
        googlePlaceSearch(midpoint, map);

    } else {                

        marker.setPosition(midpoint);
        googlePlaceSearch(midpoint, map);

    }
  }

  function googlePlaceSearch(midpoint, map) {
    
    var service;
    var request = {
      location: midpoint, 
      radius: 800, // .50 mile radius
      types: ['cafe', 'restaurant', 'bar']
    }

    service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, function(results, status) {
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
        
          var POI = results[i];
          addPOIMarker(POI, map);

        }
      }

    });

  }


  function addPOIMarker(POI, map) {
    var placeLoc = POI.geometry.location;
    var marker   = new google.maps.Marker({
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

  }



});