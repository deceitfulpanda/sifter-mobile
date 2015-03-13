// App controllers will go here :)
angular.module('sifter.controllers', [])

.controller('DashCtrl', function($scope, $location, $ionicLoading, Camera) {

  $scope.image = 'Hello world';

  $scope.getPhoto = function() {
    Camera.takePhoto({
      destinationType : navigator.camera.DestinationType.DATA_URL
    }).then(function(imageURI) {
      // show loading screen while awaiting response from server
      $scope.showLoading();
      $scope.image = imageURI;
    }, function(err) {
      console.log(err);
    });
  };

  $scope.showLoading = function() {
    $ionicLoading.show({
      template: 'Sifting...'
    });
  };

  $scope.hideLoading = function(){
    $ionicLoading.hide();
  };

});