'use strict';

describe('Directive: waveform', function () {

  // load the directive's module and view
  beforeEach(module('dsswebApp'));
  beforeEach(module('app/directives/waveform/waveform.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<waveform></waveform>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the waveform directive');
  }));
});