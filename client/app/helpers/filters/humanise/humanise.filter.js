'use strict';

angular.module('dssWebApp')
    .filter('humaniseTime', function () {
        return function (input) {
            return helpers.humanise.humaniseTime(input);
        };
    }).filter('humanise', function () {
        return function (input) {
            return moment(input).fromNow();
        };
    });
