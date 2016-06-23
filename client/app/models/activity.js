angular.module('dssWebApp')
    .factory('ActivityModel', function (DS) {
        return DS.defineResource({
            name: 'activity'
        });
    });
