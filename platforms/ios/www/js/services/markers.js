angular.module('MarkersService', [])

.factory('Marker', function() {

	for (var i = 0; i < POI.types.length; i++) {
		if (POI.types[i] === 'restaurant') {
			return '';
		} else if (POI.types[i] === 'restaurant') {
			return 'img/restaurant.png';
		} else if (POI.types[i] === 'cafe') {
			return 'img/cafe.png';
		} else if (POI.types[i] === 'grocery_or_supermarket') {
			return 'img/grocery.png';
		} else if (POI.types[i] === 'gym') {
			return 'img/gym.png';
		} else if (POI.types[i] === 'movie_theater') {
			return 'img/movies.png';
		} else if (POI.types[i] === 'bar') {
			return 'img/bar.png';
		}
	};


});