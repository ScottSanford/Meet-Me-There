angular.module('meetups', [])

.factory('Meetups', function() {
  return {
      types:[
        {
          "name": "Atm",
          "id": "atm",
          "checked": false, 
        },
        {
          "name": "Church",
          "id": "church",
          "checked": false, 
        },
        {
          "name": "Gas Station",
          "id": "gas_station",
           "checked": false, 
         },
        {
          "name": "Grocery",
          "id": "grocery_or_supermarket",
          "checked": false, 
        },
        {
          "name": "Gym",
          "id": "gym",
          "checked": false, 
        },
        {
          "name": "Movie Theater",
          "id": "movie_theater",
           "checked": false, 
         },        
         {
          "name": "Cafe",
          "id": "cafe",
           "checked": true, 
         },        
         {
          "name": "Restaurant",
          "id": "restaurant",
           "checked": true, 
         },        
         {
          "name": "Bar",
          "id": "bar",
           "checked": true, 
         }, 
        ] 
  }
});