'use strict';

angular.module('dssWebApp')
    .factory('NotificationService', function () {
        return {
            getNotifications: function () {
                console.log('Notifications');
            }
        };
    });
