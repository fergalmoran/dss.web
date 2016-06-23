angular.module('dssWebApp')
    .factory('NotificationModel', function (DS) {
        return DS.defineResource({
            name: 'notification'
        });
    });
