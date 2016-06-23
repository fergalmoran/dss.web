'use strict';

angular.module('dssWebApp')
    .directive('dssActivityFeed', function () {
        return {
            restrict: 'E',
            templateUrl: 'app/directives/activity/activityFeed.html'
        }
    });
