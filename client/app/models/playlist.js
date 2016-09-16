angular.module('dssWebApp')
    .factory('PlaylistModel', function (DS) {
        return DS.defineResource({
            name: 'playlist'
        });
    });
