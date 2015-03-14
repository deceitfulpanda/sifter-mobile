// App controllers will go here :)
angular.module('sifter.controllers', [])

.controller('DashCtrl', function($scope, $location, $ionicLoading, Camera, ImgUpload) {

  $scope.image = 'Hello world';

  $scope.getPhoto = function() {
    Camera.takePhoto({
      destinationType : navigator.camera.DestinationType.DATA_URL
    })
    .then(function(imageURI) {
      // show loading screen while awaiting response from server
      $scope.showLoading();
      return ImgUpload.uploadImage(imageURI);
    })
    .then(function(promise) {
      // TODO: inspector is saying Object has no 'success' property...??
      promise
      .success(function(data, status, headers, config) {
        console.log('success',data);
        $scope.image = data;
        $scope.hideLoading();
      })
      .error(function(data, status, headers, config) {
        // handle Cloudinary error
        console.log('error',data);
        $scope.image = data;
        $scope.hideLoading();
      });
    })
    .catch(function(err) {
      console.log('ERROR:', err);
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