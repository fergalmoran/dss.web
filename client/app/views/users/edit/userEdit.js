'use strict';

angular.module('dssWebApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('root.users.edit', {
                url: '/edit',
                resolve: {
                    user: function ($stateParams, $rootScope, UserModel) {
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
