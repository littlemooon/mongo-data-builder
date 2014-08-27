angular
  .module('app', [
    'ui.router',
    'app.common',
    'app.main',
    'app.entry',
    'app.property'
  ])

  .config(function($urlRouterProvider, $locationProvider) {
 
    $urlRouterProvider.otherwise('/');
    $locationProvider.html5Mode(true);
  });