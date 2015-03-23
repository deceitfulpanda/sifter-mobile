// App controllers will go here :)
angular.module('sifter.controllers', [])

.controller('DashCtrl', function($scope, $location, $ionicLoading, $ionicPopup, Camera, ImgUpload, SifterAPI) {

  $scope.imageURL = 'Hello world';
  $scope.imageClassification;
  $scope.imageDescription;
  $scope.hasTrash = false;

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
      // set our most recently scanned item url
      $scope.imageURL = transformURL(response.data.url, 1000);
      // forward resulting url to server
      $scope.showLoading('Classifying...');
      return SifterAPI.postImgUrl(response.data);
    })
    .then(function(response) {
      console.log('SUCCESSFUL CLASSIFICATION:', response);
      var data = response.data;
      $scope.hideLoading();
      $scope.imageClassification = data.classification.toUpperCase();
      $scope.imageDescription = data.description.name.toUpperCase();
      $scope.showClassification(capitalize(data.classification));
      // show our most recently scanned image
      $scope.hasTrash = true;
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
      template: '<img class="popup-image" src="'+images[classification]+'"><div>Scan another item?</div>',
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
      if (res) {
        console.log('Scanning another item');
        $scope.getPhoto();
      } else {
        console.log('Done scanning items');
        // TODO: refresh cards

      }
    })
  };

  var capitalize = function(string) {
    return string.charAt(0).toUpperCase() + string.substring(1).toLowerCase();
  };

  // Cloudinary allows you do apply transformations before grabbing
  // them. Here, we are getting a square (size x size) version of our
  // image, retaining the original proportions (cropping the image).
  var transformURL = function(url, size) {
    var index = url.indexOf('/upload/') + 8;
    var endIndex = url.indexOf('/', index);
    var start = url.substr(0, index);
    var end = url.substr(endIndex);
    return start + 'w_' + size + ',h_' + size + ',c_fill' + end;
  };

  var images = {
    'Compost': './img/compostee.png',
    'Recycle': './img/recyclee.png',
    'Landfill': './img/trashee.png'
  };

});
