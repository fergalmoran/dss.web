'use strict';

angular.module('dssWebApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('root.users.user', {
                url: '/:slug',
                resolve: {
                    user: function ($stateParams, UserModel) {
                        return UserModel.find($stateParams.slug);
                    }
                },
                views: {
                    'content@': {
                        templateUrl: 'app/views/users/item/userItem.html',
                        controller: 'UserItemCtrl'
                    }
                }
            });
    });
