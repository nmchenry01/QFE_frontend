(function () {

  var myApp = angular.module('myApp', ['ui.router', 'ui.bootstrap']);
  myApp.config(
    ["$stateProvider", "$urlRouterProvider",
      function ($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise("/home");

        $stateProvider
          .state("home", {
            url: "/home",
            templateUrl: "assetView.html"
            //controller: "MainController"
          })
      }
    ]);

}());
