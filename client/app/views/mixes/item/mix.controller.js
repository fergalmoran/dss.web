'use strict';

angular.module('dssWebApp')
    .controller('MixCtrl', function ($scope, mix, comments) {
        $scope.playState = 0;
        $scope.mix = mix;
        $scope.comments = comments;
    });
