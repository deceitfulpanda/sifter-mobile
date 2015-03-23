// Test for ImgUpload interaction service
describe('Unit: ImgUpload', function() {
  // Load module with service
  beforeEach(module('sifter.services'));
  beforeEach(module('sifter.config'));

  var service, $httpBackend, creds;
  beforeEach(inject(function(ImgUpload, Cloudinary, _$httpBackend_) {
    creds = Cloudinary;
    service = ImgUpload;
    $httpBackend = _$httpBackend_;
  }));

  describe('uploadImage', function() {

    it('should make an ajax call to /image/upload', function() {
      $httpBackend.whenPOST(creds.url).respond({
        url: 'http://www.example.com'
      });

      var promise = service.uploadImage('some;image;data');

      promise.then(function(response) {
        expect(response.data.url).toBe('http://www.example.com');
      });
      $httpBackend.flush();
    });
  })
});