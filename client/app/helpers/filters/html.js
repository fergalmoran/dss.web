'use strict';

angular.module('dssWebApp')
    .filter('dssHtml', function () {
        return function (text) {
            return text ? text.replace(/\n/g, '<br/>') : '';
        };
    });
