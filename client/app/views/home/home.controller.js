'use strict';

angular.module('dssWebApp')
    .controller('HomeCtrl', function ($scope, $rootScope, $state, AUTH_EVENTS,
                                      mixes, MixModel, ActivityModel, UserModel) {
        $scope.activity = [];
        $scope.friendsMixes = [];
        $scope.followers = [];
        $scope.mixes = mixes;
        $scope.$watch('activity', function (activity) {
            $scope.activity = activity;
        });

        function _getActivityDetails(user) {
            MixModel.findAll({friends: 'True'}).then(function (results) {
                $scope.friendsMixes = results;
            });

            ActivityModel.findAll({slug: user.slug, limit: 5}).then(function (results) {
                $scope.activity = results;
            });
        }

        if ($rootScope.currentUser) {
            _getActivityDetails($rootScope.currentUser);
        } else {
            $scope.$on(AUTH_EVENTS.loginSuccess, function (event, user) {
                _getActivityDetails(user);
            });
        }
    });
