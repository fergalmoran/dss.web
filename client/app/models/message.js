angular.module('dssWebApp')
    .factory('MessageModel', function (DS) {
        return DS.defineResource({
            name: 'messages',
            idAttribute: 'id'
        });
    });
