// test our secret cloudinary configuration
describe('Unit: Cloudinary', function() {
  // Load module with service
  beforeEach(module('sifter.config'));

  var service;
  beforeEach(inject(function(Cloudinary) {
    service = Cloudinary;
  }));

  it('should have API credentials', function() {
    expect(service.url).toBeDefined();
    expect(service.cloudName).toBeDefined();
    expect(service.apiKey).toBeDefined();
    expect(service.secret).toBeDefined();
  });

  it('should get a signature using API credentials', function() {
    var timestamp = 1427072588549;
    var hash = CryptoJS.SHA1('timestamp=' + timestamp + service.secret).toString();
    expect(service.getSignature(timestamp)).toBe(hash);
  })
});