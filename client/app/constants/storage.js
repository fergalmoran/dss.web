'use strict';

angular.module('dssWebApp')
    .constant('STORAGE', {
        authBackend: 'dss_at_backend',
        authToken: 'dss_at_token',
        authServerToken: 'dss_at_server_token',
        authLocalToken: 'dss_at_local_token',
        authServerSession: 'dss_at_server_session',
        authRefreshToken: 'refresh_token'
    });
