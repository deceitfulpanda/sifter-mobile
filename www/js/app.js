// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('sifter', ['ionic'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup a dashboard page for our app
  .state('dash', {
    url: "/dash",
    templateUrl: "templates/dash.html"
  })

  // waiting page for server response
  .state('sifting', {
    url: "/sifting",
    templateUrl: "templates/sifting.html"
  })

  // results page (indicates classification response from server)
  .state('sifted', {
    url: "/sifted",
    templateUrl: "templates/sifted.html"
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/dash');

});