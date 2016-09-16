'use strict';

angular.module('dssWebApp')
    .controller('ErrorCtrl', function ($scope, errorObj) {
        $scope.error = errorObj;
    });