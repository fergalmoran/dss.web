'use strict';

angular.module('dssWebApp')
    .controller('RadioAdminCtrl', function ($scope, $http, SERVER_CONFIG) {
        $scope.mix = {};
        $scope.shuffleTrack = function () {
            $http.post(SERVER_CONFIG.apiUrl + '/_radio?action=shuffle')
                .then(function (result) {
                    console.log("Shuffled", result);
                });
        };
        $scope.playMix = function (something) {
            console.log($scope.mix);
            $http.post(SERVER_CONFIG.apiUrl + '/_radio?action=play&slug=' + $scope.mix.slug)
                .then(function (restult) {
                    console.log("Shuffled", result);
                });
        };
    });
