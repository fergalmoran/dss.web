'use strict';

angular.module('dssWebApp')
    .controller('ErrorCtrl', function ($scope, errorObj) {
        debugger;
        $scope.error = errorObj;
    });