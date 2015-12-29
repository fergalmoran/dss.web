'use strict';

angular.module('dssWebApp')
    .controller('MixesCtrl', function ($scope, mixes, MixModel, AudioService) {
        console.log("MixesCtrl", $scope);
        $scope.mixes = mixes;
        $scope.page = 1;
        $scope.nextPage = function (e) {
            $scope.page++;
            MixModel.findAll({
                page: $scope.page,
                waveform_generated: "True",
                is_featured: "True",
                limit: 3
            });
        };
        MixModel.bindAll(null, $scope, 'mixes');
    });
