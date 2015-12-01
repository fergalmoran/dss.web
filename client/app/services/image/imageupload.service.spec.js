'use strict';

describe('Service: imageupload', function () {

  // load the service's module
  beforeEach(module('dssWebApp'));

  // instantiate service
  var imageupload;
  beforeEach(inject(function (_imageupload_) {
    imageupload = _imageupload_;
  }));

  it('should do something', function () {
    expect(!!imageupload).toBe(true);
  });

});
