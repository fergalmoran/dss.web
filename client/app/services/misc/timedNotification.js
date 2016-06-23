'use strict';

angular.module('dssWebApp')
    .factory('TimedNotificationService', function ($rootScope) {
        // events:
        var TIME_AGO_TICK = "e:timeAgo";
        var timeAgoTick = function () {
            $rootScope.$broadcast(TIME_AGO_TICK);
        };
        // every minute, publish/$broadcast a TIME_AGO_TICK event
        setInterval(function () {
            timeAgoTick();
            $rootScope.$apply();
        }, 1000 * 60);
        return {
            // publish
            timeAgoTick: timeAgoTick,
            // subscribe
            onTimeAgo: function ($scope, handler) {
                $scope.$on(TIME_AGO_TICK, function () {
                    handler();
                });
            }
        };
    });
