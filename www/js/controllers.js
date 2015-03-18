// App controllers will go here :)
angular.module('sifter.controllers', [])

.controller('DashCtrl', function($scope, $location, $ionicLoading, $ionicPopup, Camera, ImgUpload, SifterAPI) {

  $scope.image = 'Hello world';

  $scope.getPhoto = function() {
    console.log('Initiating Camera intent');
    Camera.takePhoto({
      destinationType : navigator.camera.DestinationType.DATA_URL
    })
    .then(function(imageURI) {
      // show loading screen while awaiting response from server
      $scope.showLoading('Uploading...');
      return ImgUpload.uploadImage(imageURI);
    }, function(err) {
      $scope.hideLoading();
      console.error('CAMERA ERROR:', err);
    })
    .then(function(response) {
      console.log('SUCCESSFUL UPLOAD:', response);
      // forward resulting url to server
      $scope.showLoading('Classifying...');
      return SifterAPI.postImgUrl(response.data);
    })
    .then(function(response) {
      var data = JSON.parse(response.data);
      console.log('SUCCESSFUL CLASSIFICATION:', data);
      // $scope.image = data;
      $scope.hideLoading();
      $scope.showClassification(data.classification);
      // TODO: add card for newly scanned item (may happen automatically on card refresh?)
    })
    .catch(function(err) {
      console.error('ERROR:', err);
      $scope.hideLoading();
    });
  };

  $scope.showLoading = function(message) {
    $ionicLoading.show({
      template: '<ion-spinner></ion-spinner><div style="margin-top:5px">'+message+'</div>'
    });
  };

  $scope.hideLoading = function(){
    $ionicLoading.hide();
  };

  $scope.showClassification = function(classification) {
    var confirm = $ionicPopup.confirm({
      title: classification,
      template: 'Scan another item?',
      buttons: [
        { text: 'Cancel',
          onTap: function() {
            return false;
          }
        },
        {
          text: '<i class="icon ion-camera"></i>',
          type: 'button-positive',
          onTap: function() {
            return true;
          }
        }
      ]
    });

    confirm.then(function(res) {
      console.log('res', res);
      if (res) {
        console.log('Scanning another item');
        $scope.getPhoto();
      } else {
        console.log('Done scanning items');
        // TODO: refresh cards
      }
    })
  };

  // $scope.showClassification('Compost'); // for testing

});