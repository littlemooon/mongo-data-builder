angular.module('app.property').factory('PropertyService', function($http) {

  return {
    get: function() {
      return $http.get('/api/properties');
    },
    add: function(property) {
      return $http.post('/api/properties', property);
    },
    update: function(property) {
      return $http.put('/api/properties/' + property.id, property);
    },
    delete: function(property) {
      return $http.delete('/api/properties/' + property.id);
    }
  };
});