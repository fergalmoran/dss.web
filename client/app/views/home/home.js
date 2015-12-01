'use strict';

angular.module('dssWebApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('root.home', {
                url: '/',
                controller: function ($scope) {
                    $scope.$watch('currentUser', function () {
                        $state.reload();
                    });
                },
                resolve: {
                    mixes: function (MixModel) {
                        return MixModel.findAll({
                            waveform_generated: "True",
                            is_featured: "True"
                        });
                    }
                },
                views: {
                    'content@': {
                        templateUrl: 'app/views/home/home.html',
                        controller: 'HomeCtrl'
                    }
                }
            });
    });
