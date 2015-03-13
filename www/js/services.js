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

.factory('ImgUpload', ['$http', 'Cloudinary', function($http, Cloudinary) {

  // Upload image to Cloudinary storage
  // api docs at http://cloudinary.com/documentation/upload_images#remote_upload
  var uploadImage = function(imageURI) {
    var timestamp = +new Date();

    // return a promise to get url from cloudinary
    return $http.post(Cloudinary.url, {
      file: imageURI,
      api_key: Cloudinary.apiKey,
      timestamp: timestamp,
      signature: Cloudinary.getSignature(timestamp)
    });
  };

  return {
    uploadImage: uploadImage
  };
}]);