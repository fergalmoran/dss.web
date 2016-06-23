'use strict';
angular.module('dssWebApp')
    .directive('timeAgo', function (TimedNotificationService) {
        return {
            template: '<span>{{timeAgo}}</span>',
            replace: true,
            link: function (scope, element, attrs) {
                var updateTime = function () {
                    scope.timeAgo = moment(scope.$eval(attrs.timeAgo)).fromNow();
                };
                TimedNotificationService.onTimeAgo(scope, updateTime); // subscribe
                updateTime();
            }
        }
    });
