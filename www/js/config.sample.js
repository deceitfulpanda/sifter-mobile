// Our super secret API keys will live here...

angular.module('sifter.config', [])

.factory('Cloudinary', function() {

  var cloudName = CLOUD_NAME;
  var url = 'https://api.cloudinary.com/v1_1/'+ cloudName +'/image/upload';
  var apiKey = API_KEY;
  var secret = SECRET;

  // Cloudinary needs a SHA1-hashed signature to authenticate uploads
  var getSignature = function(timestamp) {
    return CryptoJS.SHA1('timestamp=' + timestamp + secret);
  };

  return {
    cloudName: cloudName,
    url: url,
    apiKey: apiKey,
    secret: secret,
    getSignature: getSignature
  };
});