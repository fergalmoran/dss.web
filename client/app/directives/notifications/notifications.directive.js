'use strict';

angular.module('dssWebApp')
    .directive('dssNotifications', function ($timeout, NotificationModel) {
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

        return {
            restrict: 'E',
            templateUrl: 'app/directives/notifications/notifications.html',
            replace: true,
            link: function (scope, elem, attrs) {
                scope.notifications = [];
                NotificationModel.findAll().then(function (results) {
                    scope.notifications = results;
                    scope.notificationCount = results.filter(function (x) {
                        return x.accepted_date === null;
                    }).length;
                });

                $('#notifications').data('open', false);
                $('#notifications-button').click(function() {
                    if($('#notifications').data('open')) {
                        $('#notifications').data('open', false);
                            markNotifications(scope);
                    } else
                        $('#notifications').data('open', true);
                });
                $(document).click(function() {
                    if($('#notifications').data('open')) {
                        $('#notifications').data('open', false);
                            markNotifications(scope);
                    }
                });
            }
        }
    });
