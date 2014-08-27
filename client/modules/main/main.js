angular
  .module('app.main', [
    'ui.router',
    'app.common',
    'app.entry',
    'app.property'
  ])

  .config(function($stateProvider, $urlRouterProvider) {

    $stateProvider
      .state("main", {
        url: '/',
        abstract: true,
        templateUrl: 'modules/main/main.html',
        controller: 'MainCtrl'
      })
        .state("main.entry", { 
          url: "", 
          templateUrl: 'modules/entry/entry.html',
          controller: 'EntryCtrl'
        })
        .state("main.property", { 
          url: 'property',
          templateUrl: 'modules/property/property.html',
          controller: 'PropertyCtrl'
        });

    $urlRouterProvider.when("/main", "/main/entry");
  });