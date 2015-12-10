'use strict';

angular.module('dssWebApp')
    .controller('UserItemCtrl', function ($scope, UserModel, MixModel, user, logger) {
        logger.logSuccess('UserItemCtrl', $scope);
        $scope.user = user;
        $scope.showLatest = function () {
            $scope.mixTitle = "Latest";
            MixModel.findAll({
                user__slug: user.slug,
                waveform_generated: "True",
                ordering: "-id"
            }).then(function (mixes) {
                $scope.mixes = mixes;
                $scope.mixPage = 1;
            });
        };
        $scope.showPopular = function () {
            $scope.mixTitle = "Popular";
            MixModel.findAll({
                user__slug: user.slug,
                waveform_generated: "True",
                ordering: "-play_count"
            }).then(function (mixes) {
                $scope.mixes = mixes;
                $scope.mixPage = 1;
            });
        };
        $scope.showLatest();
    });