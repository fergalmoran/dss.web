'use strict';

angular.module('dssWebApp')
    .controller('UserCtrl', function ($scope, users) {
        $scope.users = users;
    });
