'use strict';

angular.module('dssWebApp')
    .directive('dssNotifications', function ($timeout, $rootScope, $q, NotificationModel, MESSAGE_EVENTS) {
        var markNotifications = function (scope) {
            scope.notifications.forEach(function (notification) {
                if (notification.accepted_date === null) {
                    console.log(notification.id);
                    notification.accepted_date = new Date();
                    NotificationModel.save(notification);
                    scope.notificationCount--;
                }
            });
        };

        function getNotifications(scope) {
            var defer = $q.defer();
            NotificationModel.ejectAll();
            NotificationModel.findAll().then(function (results) {
                scope.notifications = results;
                scope.notificationCount = results.filter(function (x) {
                    return x.accepted_date === null;
                }).length;
                defer.resolve();
            });
            return defer.promise;
        }

        return {
            restrict: 'E',
            templateUrl: 'app/directives/notifications/notifications.html',
            replace: true,
            link: function (scope, elem, attrs) {
                scope.notifications = [];
                getNotifications(scope);
                $('#navbar-notification-dropdown').on('hide.bs.dropdown', function () {
                    markNotifications(scope);
                });
                scope.$on(MESSAGE_EVENTS.broadcast, function (message) {
                    getNotifications(scope)
                        .then(function(){
                            scope.$apply();
                        });
                });
            }
        }
    });
