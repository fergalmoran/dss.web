'use strict';

angular.module('dssWebApp')
    .constant('AUTH_BACKENDS', {
        twitter: 'twitter',
        facebook: 'facebook',
        google: 'google'
        //google: 'google-oauth2'
        //google: 'google-plus'
    });
