angular.module('GoogleMapsService', [])

.factory('GoogleMaps', function() {
  
  return {

      calcRoute:  function calcRoute(polyline, userLocation) {
                    var directionsService = new google.maps.DirectionsService();
                    var start = userLocation;
                    var end = '5820 N Sheridan Rd, Chicago, IL 60660';
                    var travelMode = google.maps.DirectionsTravelMode.DRIVING
                    console.log("userLocation:: ", userLocation);

                    var request = {
                        origin: start,
                        destination: end,
                        travelMode: travelMode
                    };

                    directionsService.route(request, function(response, status) {
                      if (status == google.maps.DirectionsStatus.OK) {

                        polyline.setPath([]);
                        var bounds = new google.maps.LatLngBounds();
                        startLocation = {};
                        endLocation = {};
                      
                        directionsDisplay.setDirections(response);
                        var route = response.routes[0];
                        console.log('Google Maps Driving Response :: ', response);

                        // For each route, display summary information.
                        var path = response.routes[0].overview_path;
                        var legs = response.routes[0].legs;
                        for (i=0;i<legs.length;i++) {
                          if (i == 0) { 
                            startLocation.latlng = legs[i].start_location;
                            startLocation.address = legs[i].start_address;
                            console.log('startLocation.latlng:: ', response.request.origin);
                            // marker = google.maps.Marker({map:map,position: startLocation.latlng});
                            marker = createMarker(response.request.origin,"midpoint","","Point A");
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
                        console.log("directions response "+status);
                      }
                    });
                  }
  } 

                  function createMarker(latlng, label, html) {
                        // console.log(latlng+", " + label + ", " + html + ")");
                        var contentString = '<b>'+label+'</b><br>'+ html;
                        var marker = new google.maps.Marker({
                            position: latlng,
                            map: map,
                            title: label,
                            zIndex: Math.round(latlng.lat()*-100000)<<5
                            });
                            marker.myname = label;

                        google.maps.event.addListener(marker, 'click', function() {
                            infowindow.setContent(contentString+"<br>"+marker.getPosition().toUrlValue(6)); 
                            infowindow.open(map,marker);
                            console.log(marker.position);
                            });
                        return marker;
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

                      totalDist = totalDist / 1000;
                  }

                  function putMarkerOnRoute(polyline, percentage) {

                    var distance = (percentage/100) * totalDist;
                    var time = ((percentage/100) * totalTime/60).toFixed(2);
                    // console.log("Time:"+time+" totalTime:"+totalTime+" totalDist:"+totalDist+" dist:"+distance);

                    if (!marker) {
                            marker = createMarker(polyline.GetPointAtDistance(distance),"time: "+time,"marker");
                    } else {

                            var midLat = polyline.GetPointAtDistance(distance).J;
                            var midLng = polyline.GetPointAtDistance(distance).M;
                            var midpoint = new google.maps.LatLng(midLat, midLng);

                            marker.setPosition(polyline.GetPointAtDistance(distance));
                            marker.setTitle("time:"+time);

                            googlePlaceSearch(midpoint, map);
                
                    }
                  }

                  function googlePlaceSearch(midpoint, map) {
                    var service;

                    var request = {
                      location: midpoint, 
                      radius: 700, 
                      types: ['cafe', 'restaurant', 'bar']
                    }

                    service = new google.maps.places.PlacesService(map);
                    service.nearbySearch(request, callback);
                  }

                  function callback(results, status) {
                    if (status == google.maps.places.PlacesServiceStatus.OK) {
                      for (var i = 0; i < results.length; i++) {
                        
                        var place = results[i];
                        addMarker(results[i], map);

                        // $scope.results = results[i];
                          
                      }
                    }
                  }

                  function addMarker(place, map) {
                     var placeLoc = place.geometry.location;
                     var marker = new google.maps.Marker({
                      map: map,
                      position: place.geometry.location,
                      icon: {
                        url: place.icon,
                        scaledSize: new google.maps.Size(25, 25)
                      }
                     });

                      google.maps.event.addListener(marker, 'click', function() {
                          infowindow.setContent(place.name);
                          infowindow.open(map, this);
                      });
                  }



});