// App services will go here :)

angular.module('sifter.services', [])

.factory('Camera', ['$q', function($q) {
  var takePhoto = function(options) {
    var q = $q.defer();

      navigator.camera.getPicture(function(result) {
        // Do any magic you need
        q.resolve(result);
      }, function(err) {
        q.reject(err);
      }, options);

      return q.promise;
  };

  return {
    takePhoto: takePhoto
  };
}])

.factory('ImgUpload', function() {
  var uploadImage = function(imageURI) {
    // upload image to cloudinary here
  };

  return {
    uploadImage: uploadImage
  };
});