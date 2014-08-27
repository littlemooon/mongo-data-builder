angular.module('app.property').controller('PropertyCtrl', function($scope, PropertyService){

  // DATA

  PropertyService.get().
    success(function(data) {
      $scope.properties =  data;
    });

  $scope.newProperty = {};

  // IO FUNCTIONS

  $scope.addProperty = function(property) {
    // create property
    PropertyService.add(property).success(function (id) {

      // add to scope
      property.id = id;
      $scope.properties.push(property);
    });

    // reset new property
    $scope.newProperty = {};
  };
  $scope.updateProperty = function(property) {
    PropertyService.update(property);
  };
  $scope.deleteProperty = function(property) {
    // delete property
    PropertyService.delete(property);

    // remove from scope
    var index = $scope.properties.indexOf(property);
    if (index > -1) $scope.properties.splice(index, 1);
  };

  $scope.increasePriority = function(property) {
    // move property within array
    var index = _.indexOf($scope.properties, property);
    if (index > 0) {
      $scope.properties.splice(index-1, 0, _.remove($scope.properties, property)[0]);

      // update property
      $scope.properties[index-1].next = $scope.properties[index] && $scope.properties[index].id;
      $scope.properties[index-1].prev = $scope.properties[index-2] && $scope.properties[index-2].id;
      PropertyService.update(property);
    }
  };
  $scope.decreasePriority = function(property) {
    // move property within array
    var index = _.indexOf($scope.properties, property);
    if (index > 0) {
      $scope.properties.splice(index+1, 0, _.remove($scope.properties, property)[0]);

      // update property
      $scope.properties[index+1].next = $scope.properties[index+2] && $scope.properties[index+2].id;
      $scope.properties[index+1].prev = $scope.properties[index] && $scope.properties[index].id;
      PropertyService.update(property);
    }
  };
});