'use strict';

describe('Directive: playlist', function () {

  // load the directive's module and view
  beforeEach(module('dssWebApp'));
  beforeEach(module('app/directives/playlist/playlist.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<playlist></playlist>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the playlist directive');
  }));
});