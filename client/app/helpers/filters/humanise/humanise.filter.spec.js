'use strict';

describe('Filter: humanise', function () {

  // load the filter's module
  beforeEach(module('dssWebApp'));

  // initialize a new instance of the filter before each test
  var humanise;
  beforeEach(inject(function ($filter) {
    humanise = $filter('humanise');
  }));

  it('should return the input prefixed with "humanise filter:"', function () {
    var text = 'angularjs';
    expect(humanise(text)).toBe('humanise filter: ' + text);
  });

});
