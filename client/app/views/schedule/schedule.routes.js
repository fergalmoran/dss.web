'use strict';

angular.module('dssWebApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('root.schedule', {
                url: '/schedule',
                views: {
                    'content@': {
                        templateUrl: 'app/views/schedule/schedule.html',
                        controller: 'ScheduleCtrl'
                    }
                }, resolve: {
                    shows: function (ShowModel) {
                        return ShowModel.findAll({});
                    }
                }
            });
    });
