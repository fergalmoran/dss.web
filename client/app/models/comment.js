angular.module('dssWebApp')
    .factory('CommentModel', function (DS, logger) {
        var count = 0;
        var next = "";
        var previous = "";

        return DS.defineResource({
            name: 'comments',
            idAttribute: 'id'
        });
    });
