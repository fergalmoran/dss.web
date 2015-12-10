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
        'dialogs.main',
        'infinite-scroll',
        'angularFileUpload',
        'angulartics',
        'angular-jwt',
        'http-auth-interceptor',
        'angular-smilies',
        'angulartics.google.analytics'
    ])
    .config(function ($stateProvider, $sceDelegateProvider, $httpProvider, $urlRouterProvider, $locationProvider, $provide,
                      jwtInterceptorProvider, $analyticsProvider, dialogsProvider, DSProvider, DSHttpAdapterProvider,
                      SERVER_CONFIG, STORAGE) {
        $urlRouterProvider
            .otherwise('/');

        //$httpProvider.defaults.headers.common.Accept = 'application/json';
        $httpProvider.defaults.useXDomain = true;
        $httpProvider.interceptors.push('AuthInterceptor');

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
    }).run(function ($http, $rootScope, $state, $anchorScroll, $window, LoginService, Session, SocketService) {
    $rootScope.isPlaying = false;

    $rootScope.setCurrentUser = function (user) {
        console.log('Current user', user);
        $rootScope.currentUser = user;
    };
    $rootScope.connectSockets = function () {
        SocketService.connectSocket(Session.getSession());
        SocketService.registerHandler('site:broadcast', function (data) {
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

    hello.init({
        facebook: '154504534677009',
        twitter: 'qmvJ6tptgd8G9T9WYp6P3Q',
        google: '248170132962-5km115budk9h84raa26hdmnnqdj8ivkl.apps.googleusercontent.com'
    }, {
        redirect_uri: '/'
    });

    //ensure login before state change
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
        if (!$rootScope.currentUser && Session.getLocalToken() != null && Session.getBackend()) {
            LoginService.loginUser().then(function (user) {
                LoginService.getUserProfile()
                    .then(function (user) {
                        $rootScope.setCurrentUser(user);
                        $rootScope.connectSockets();
                        return $state.go(toState.name, toParams);
                    });
            }, function (result) {
                console.log('Unable to login', result);
                if (result.code === 403 || result.code === 400 || result.code === 401 || result.code === 500) {
                    LoginService.logoutUser()
                        .then(function () {
                            return $state.go(toState.name, toParams);
                        });
                } else {
                    debugger;
                    console.error('Ooops');
                    LoginService.logoutUser()
                        .then(function () {
                            return $state.go(toState.name, toParams);
                        });
                }
            });
            event.preventDefault();
        }
    });
    $rootScope.$on('$viewContentLoaded', function (evt, absNewUrl, absOldUrl) {
        $anchorScroll();
        //$window.scrollTop(0, 0);
    });
    $rootScope.$on('$locationChangeSuccess', function (evt, absNewUrl, absOldUrl) {
        $anchorScroll();
    });
    /*
    $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
        console.log('$stateChangeError - fired when an error occurs during transition.');
        console.log(arguments);
    });
    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
        console.log('$stateChangeSuccess to ' + toState.name + '- fired once the state transition is complete.');
    });
    $rootScope.$on('$stateNotFound', function (event, unfoundState, fromState, fromParams) {
        console.log('$stateNotFound ' + unfoundState.to + '  - fired when a state cannot be found by its name.');
        console.log(unfoundState, fromState, fromParams);
    });
    */
});
