'use strict';

angular.module('dssWebApp')
    .directive('dssPlaylist', function () {
        return {
            templateUrl: 'app/directives/playlist/playlist.html',
            restrict: 'EA',
            link: function (scope, element, attrs) {
            }
        };
    });