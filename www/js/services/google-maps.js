angular.module('GoogleMapsService', [])

.factory('GoogleMaps', function() {
  
  return {

      calcRoute:  function calcRoute(polyline, userLocation, map) {
                    var directionsService = new google.maps.DirectionsService();
                    var start = userLocation;
                    var end = '5820 N Sheridan Rd, Chicago, IL 60660';
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
                        var startLocation = {};
                        var endLocation = {};
                      
                        directionsDisplay.setDirections(response);
                        var route = response.routes[0];

                        // For each route, display summary information.
                        var path = response.routes[0].overview_path;
                        var legs = response.routes[0].legs;
                        for (i=0;i<legs.length;i++) {
                          if (i == 0) { 
                            startLocation.latlng = legs[i].start_location;
                            startLocation.address = legs[i].start_address;

                            marker = createMarker(legs[i].start_location,"midpoint","Point A", map);
                            // marker.setMap(map);
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

                        computeTotalDistance(polyline, response, map);
                      } else {
                        console.log("directions response "+status);
                      }
                    });
                  }
  } 

                  function createMarker(latlng, label, html, map) {
                        // console.log(latlng+", " + label + ", " + html + ")");
                        var contentString = '<b>'+label+'</b><br>'+ html;
                        var marker = new google.maps.Marker({
                            position: latlng,
                            map: map,
                            title: label,
                            zIndex: Math.round(latlng.lat()*-100000)<<5
                            });
                            marker.myname = label;
                        var infowindow = new google.maps.InfoWindow();

                        google.maps.event.addListener(marker, 'click', function() {
                            infowindow.setContent(contentString+"<br>"+marker.getPosition().toUrlValue(6)); 
                            infowindow.open(map,marker);
                            console.log(marker.position);
                            });
                        return marker;
                  }

                  var totalDist = 0;
                  function computeTotalDistance(polyline, result, map) {
                      totalDist = 0;
                      var myroute = result.routes[0];
                      for (i = 0; i < myroute.legs.length; i++) {
                        totalDist += myroute.legs[i].distance.value;
                      }
                      putMarkerOnRoute(polyline, 50, map);

                      totalDist = totalDist / 1000;
                  }

                  function putMarkerOnRoute(polyline, percentage, map) {

                    var distance = (percentage/100) * totalDist;
                    var marker;
                    var midpoint = polyline.GetPointAtDistance(distance);
     
                    if (!marker) {

                        marker = createMarker(midpoint,"midPoint","marker", map);
                        googlePlaceSearch(midpoint, map);

                    } else {                

                        marker.setPosition(midpoint);
                        googlePlaceSearch(midpoint, map);
                
                    }
                  }

                  function googlePlaceSearch(midpoint, map) {
                    var service;
                    console.log('google midpoint', midpoint);

                    var request = {
                      location: midpoint, 
                      radius: 700, 
                      types: ['cafe', 'restaurant', 'bar']
                    }

                    service = new google.maps.places.PlacesService(map);
                    service.nearbySearch(request, callback);
                  }

                  function callback(results, status, map) {
                    if (status == google.maps.places.PlacesServiceStatus.OK) {
                      for (var i = 0; i < results.length; i++) {
                        
                        var places = results[i];
                        addMarker(places, map);

                        // $scope.results = results[i];
                          
                      }
                    }
                  }

                  function addMarker(places, map) {
                     var placeLoc = places.geometry.location;
                     var marker = new google.maps.Marker({
                      map: map,
                      position: places.geometry.location,
                      icon: {
                        url: places.icon,
                        scaledSize: new google.maps.Size(25, 25)
                      }
                     });

                      google.maps.event.addListener(marker, 'click', function() {
                          infowindow.setContent(place.name);
                          infowindow.open(map, this);
                      });
                  }



});