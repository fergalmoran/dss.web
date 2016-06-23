'use strict';

angular.module('dssWebApp')
    .filter('truncate', function () {
        return function (input, length, ellipse) {
            if (input.length < length) {
                return input;
            }
            var string = input.substring(0, length);
            if (ellipse)
                string += '...';
            return string;
        };
    });
