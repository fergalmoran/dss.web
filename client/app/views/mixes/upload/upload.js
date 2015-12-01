'use strict';

angular.module('dssWebApp')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('root.upload', {
                url: '/upload',
                resolve: {
                    mix: function () {
                        return null;
                    }
                },
                views: {
                    'content@': {
                        templateUrl: 'app/views/mixes/upload/upload.html',
                        controller: 'MixUploadCtrl'
                    }
                }
            }).state('root.edit', {
                url: '/edit/:slug',
                resolve: {
                    mix: function ($stateParams, MixModel) {
                        var ret = MixModel.find($stateParams.slug);
                        return ret;
                    }
                },
                views: {
                    'content@': {
                        templateUrl: 'app/views/mixes/upload/upload.html',
                        controller: 'MixUploadCtrl'
                    }
                }
            });
    }]);
