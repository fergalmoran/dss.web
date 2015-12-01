'use strict';

angular.module('dssWebApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('root.me', {
                url: '/me',
                resolve: {
                    user: function ($rootScope, UserModel) {
                        return UserModel.find($rootScope.currentUser.slug);
                    }
                },
                views: {
                    'content@': {
                        templateUrl: 'app/views/users/item/userItem.html',
                        controller: 'UserItemCtrl'
                    }
                }
            }).state('root.me.edit', {
                url: '/edit',
                resolve: {
                    user: function ($rootScope, UserModel) {
                        return UserModel.findAll({slug: $rootScope.currentUser.slug});
                    }
                },
                views: {
                    'content@': {
                        templateUrl: 'app/views/users/edit/userEdit.html',
                        controller: 'UserEditCtrl'
                    }
                }
            });
    });
