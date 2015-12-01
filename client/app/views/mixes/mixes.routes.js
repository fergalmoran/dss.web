'use strict';

angular.module('dssWebApp')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('root.mixes', {
                url: '/mix',
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
                        templateUrl: 'app/views/mixes/mixes.html',
                        controller: 'MixesCtrl'
                    }
                }
            });
    }]);
