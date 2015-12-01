'use strict';

angular.module('dssWebApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('root.users', {
                url: '/users',
                templateUrl: 'app/users/users.html',
                controller: 'UsersCtrl',
                resolve: {
                    users: function (UserModel) {
                        return UserModel.findAll();
                    }
                },
                views: {
                    'content@': {
                        templateUrl: 'app/views/users/users.html',
                        controller: 'UsersCtrl'
                    }
                }
            });
    });
