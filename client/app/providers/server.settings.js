'use strict';

angular.module('dssWebApp')
    .provider('ServerSettings', function () {
        var values = {
            apiUrl: '',
            radioHost: ''
        };

        return {
            $get: function () {
                return values;
            }
        }
    });
