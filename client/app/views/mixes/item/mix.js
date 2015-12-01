'use strict'

angular.module('dssWebApp')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('root.mixes.mix', {
                url: '/:slug',
                resolve: {
                    mix: function ($stateParams, MixModel) {
                        return MixModel.find($stateParams.slug);
                    },
                    comments: function ($stateParams, CommentModel) {
                        return CommentModel.findAll({
                            mix__slug: $stateParams.slug,
                            ordering: '-id'
                        });
                    }
                },
                views: {
                    'content@': {
                        templateUrl: 'app/views/mixes/item/mix.html',
                        controller: 'MixCtrl'
                    }
                }
            })
    }]);
