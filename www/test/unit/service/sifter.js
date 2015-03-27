// Test for ImgUpload interaction service
describe('Unit: SifterAPI', function() {
  // Load module with service
  beforeEach(module('sifter.services'));

  var service, $httpBackend;
  beforeEach(inject(function(SifterAPI, _$httpBackend_) {
    service = SifterAPI;
    $httpBackend = _$httpBackend_;
  }));

  describe('uploadImage', function() {

    it('should make an ajax call to /api/imgurl', function() {
      $httpBackend.whenPOST('https://pandasifter.herokuapp.com/api/imgurl').respond({
        classification: 'compost'
      });

      var promise = service.postImgUrl('http://www.notavalidurl.net');

      promise.then(function(response) {
        expect(response.data.classification).toBe('compost');
      });
      $httpBackend.flush();
    });
  })
});