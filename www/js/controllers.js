// App controllers will go here :)
angular.module('sifter.controllers', [])

.controller('DashCtrl', function($scope, $location, $ionicLoading, Camera, ImgUpload, SifterAPI) {

  $scope.image = 'Hello world';

  $scope.getPhoto = function() {
    Camera.takePhoto({
      destinationType : navigator.camera.DestinationType.DATA_URL
    })
    .then(function(imageURI) {
      // show loading screen while awaiting response from server
      $scope.showLoading();
      return ImgUpload.uploadImage(imageURI);
    }, function(err) {
      $scope.hideLoading();
      console.error('CAMERA ERROR:', err);
    })
    .then(function(response) {
      console.log('SUCCESSFUL UPLOAD:', response);
      // forward resulting url to server
      return SifterAPI.postImgUrl(response.data);
    })
    .then(function(response) {
      var data = JSON.parse(response.data);
      console.log('SUCCESSFUL CLASSIFICATION:', data);
      $scope.image = data;
      $scope.hideLoading();
    })
    .catch(function(err) {
      console.error('ERROR:', err);
      $scope.hideLoading();
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