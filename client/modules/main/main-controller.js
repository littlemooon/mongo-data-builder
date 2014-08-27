angular.module('app.main').controller('MainCtrl', function($scope){

  // DATA
  
  $scope.tabs = tabs;
});

// OBJECTS

var tabs = [
  { name: "DATA", route:".entry" },
  { name: "Columns", route:".property" }
];