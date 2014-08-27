angular.module('app.entry').controller('EntryCtrl', function($scope, EntryService, PropertyService){

  // DATA

  EntryService.get().
    success(function(data) {
      $scope.entries =  data;
    });
  PropertyService.get().
    success(function(data) {
      $scope.properties =  data;
    });

  $scope.newEntry = {};

  // IO FUNCTIONS

  $scope.addEntry = function(entry) {
    // create entry
    EntryService.add(entry).success(function (id) {

      // add to scope
      entry.id = id;
      $scope.entries.unshift(entry);
    });

    // reset new entry
    $scope.newEntry = {};
  };
  $scope.updateEntry = function(entry) {
    EntryService.update(entry);
  };
  $scope.deleteEntry = function(entry) {
    // delete entry
    EntryService.delete(entry);

    // remove from scope
    var index = $scope.entries.indexOf(entry);
    if (index > -1) $scope.entries.splice(index, 1);
  };
});