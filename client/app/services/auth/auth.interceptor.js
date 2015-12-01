'use strict';
angular.module('dssWebApp')
    .factory('AuthInterceptor', function ($q, jwtHelper, Session) {
        return {
            request: addToken
        };
        function addToken(config) {
            var token = Session.getToken();
            if (token) {
                config.headers = config.headers || {};
                config.headers.Authorization = 'JWT ' + token;
            }
            return config;
        }
    });
