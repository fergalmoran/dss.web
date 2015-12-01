angular.module('dssWebApp')
    .factory('ShowModel', function (DS) {
        return DS.defineResource({
            name: 'shows'
        });
    });
