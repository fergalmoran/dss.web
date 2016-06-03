'use strict';

angular.module('dssWebApp', [
        'ngCookies',
        'ngResource',
        'ngAnimate',
        'ngSanitize',
        'btford.socket-io',
        'ui.router',
        'angular-loading-bar',
        'js-data',
        'ui.bootstrap',
        'ui.select',
        'dialogs.main',
        'infinite-scroll',
        'angularFileUpload',
        'angulartics',
        'ngClipboard',
        'angular-jwt',
        'angular-smilies',
        'satellizer',
        'toastr',
        'angulartics.google.analytics'
    ])
    .config(function ($stateProvider, $sceDelegateProvider, $httpProvider, $urlRouterProvider, $locationProvider, $provide, $authProvider,
                      ngClipProvider, $analyticsProvider, dialogsProvider, DSProvider, DSHttpAdapterProvider,
                      SERVER_CONFIG, STORAGE) {
        $urlRouterProvider
            .otherwise('/');

        //$httpProvider.defaults.headers.common.Accept = 'application/json';
        $httpProvider.defaults.useXDomain = true;
        //$httpProvider.interceptors.push('AuthInterceptor');

        $authProvider.baseUrl = SERVER_CONFIG.apiUrl + '/';
        $authProvider.loginUrl = '_a/';
        $authProvider.authToken = 'JWT';
        $authProvider.loginRedirect = null;

        $authProvider.facebook({
            name: 'facebook',
            url: '/_a/?backend=facebook',
            clientId: '154504534677009',
            authorizationEndpoint: 'https://www.facebook.com/v2.5/dialog/oauth',
            redirectUri: window.location.origin + '/',
            requiredUrlParams: ['display', 'scope'],
            scope: ['email'],
            scopeDelimiter: ',',
            display: 'popup',
            type: '2.0',
            popupOptions: {width: 580, height: 400}
        });
        $authProvider.twitter({
            url: '_a/?backend=twitter',
            redirectUri: window.location.origin + '/',
        });
        $authProvider.google({
            clientId: '248170132962-gljba6svm1l8q73acmfc3ihkgp4orbnr.apps.googleusercontent.com',
            redirectUri: window.location.origin + '/',
            url: '/_a/?backend=google'
        });
        ngClipProvider.setPath("bower_components/zeroclipboard/dist/ZeroClipboard.swf");

        $analyticsProvider.firstPageview(true);
        $analyticsProvider.withAutoBase(true);

        DSHttpAdapterProvider.defaults.forceTrailingSlash = true;
        DSProvider.defaults.basePath = SERVER_CONFIG.apiUrl;
        DSProvider.defaults.deserialize = function (resourceName, res) {
            if (angular.isDefined(res.data) &&
                angular.isDefined(res.data.count) &&
                angular.isDefined(res.data.next) &&
                angular.isDefined(res.data.previous) &&
                angular.isDefined(res.data.results)) {
                return res.data.results;
            } else {
                return res.data;
            }
        };
        $sceDelegateProvider.resourceUrlWhitelist([
            'self',
            'https://dsscdn.blob.core.windows.net/mixes/**'
        ]);
        $locationProvider.html5Mode(true);
    }).run(function ($http, $rootScope, $state, $window, LoginService, Session, SocketService) {
    $rootScope.isPlaying = false;

    $rootScope.setCurrentUser = function (user) {
        $rootScope.currentUser = user;
    };
    $rootScope.connectSockets = function () {
        //SocketService.connectSocket(Session.getSession());
        SocketService.on('socket:site:broadcast', function (data) {
            console.log(data);
            $.notify({
                message: data,
                icon: '/assets/images/yeoman.png'
            }, {
                placement: {
                    from: 'bottom',
                    align: 'left'
                },
                icon_type: 'image'
            });
        });
    };

});
