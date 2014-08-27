angular.module('app').controller('AppCtrl', function($scope, $state){
	  
  // VIEW FUNCTIONS

  $scope.isActive = function(route) {
    return $state.is(route);
  };
});