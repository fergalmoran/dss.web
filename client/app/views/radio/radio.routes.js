'use strict';

angular.module('dssWebApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('root.radio', {
                url: '/radio',
                views: {
                    'content@': {
                        templateUrl: 'app/views/radio/radio.html',
                        controller: 'RadioAdminCtrl'
                    }
                }
            });
    });
