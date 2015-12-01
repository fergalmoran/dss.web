'use strict';

angular.module('dssWebApp')
    .controller('UsersCtrl', function ($scope, users) {
        $scope.users = users;
    });
