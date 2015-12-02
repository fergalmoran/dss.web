'use strict';

angular.module('dssWebApp')
    .controller('MainCtrl', function ($scope, $rootScope, $http, $state, dialogs, logger, authService, SocketService, AudioService,
                                      MixModel, UserModel, LoginService, Session, SERVER_CONFIG, CHAT_EVENTS, AUTH_EVENTS) {
        $scope.isAuthorized = LoginService.isAuthorized;
        $scope.isAuthenticated = LoginService.isAuthenticated;
        $scope.currentPath = '';
        $scope.chatVisible = false;
        $rootScope.isMessaging = false;

        $rootScope.safeApply = function (fn) {
            var phase = this.$root.$$phase;
            if (phase == '$apply' || phase == '$digest') {
                if (fn && (typeof(fn) === 'function')) {
                    fn();
                }
            } else {
                this.$apply(fn);
            }
        };
        $scope.safeApply = $rootScope.safeApply;

        $scope.currentTheme = localStorage.getItem('dss__theme__') || 'night';

        $scope.isDebugging = function () {
            return $rootScope.currentUser.slug === 'fergalmoran' || $rootScope.currentUser.slug === 'podnoms'
                || false;
        };

        $scope.isInRole = function (role) {
            if ($rootScope.currentUser) {
                return Session.isInRole(role);
            } else {
                return false;
            }
        };

        $scope.swapTheme = function (element) {
            console.log('Swapping Theme', element);
            $scope.currentTheme = element.currentTarget.getAttribute("data-theme");
            localStorage.setItem('dss__theme__', $scope.currentTheme);
        };
        $scope.toggleSidebar = function () {
            var $page = $('#page-container');
            var windowW = utils.getWindowWidth();
            if (windowW > 991) { // Toggle main sidebar in large screens (> 991px)
                $page.toggleClass('sidebar-visible-lg');
                if ($page.hasClass('sidebar-mini')) {
                    $page.toggleClass('sidebar-visible-lg-mini');
                }
                if ($page.hasClass('sidebar-visible-lg')) {
                    $scope.closeSidebarAlt();
                }
            } else { // Toggle main sidebar in small screens (< 992px)
                $page.toggleClass('sidebar-visible-xs');
                if ($page.hasClass('sidebar-visible-xs')) {
                    $scope.closeSidebarAlt();
                }
            }
        };
        $scope.startChat = function (slug) {
            console.log("Starting chat", slug);
            UserModel.find(slug).then(function (user) {
                $rootScope.isMessaging = true;
                $rootScope.$broadcast(CHAT_EVENTS.startChat, user);
            });
        };
        $scope.closeSidebarAlt = function () {

        };
        $scope.openSidebarAlt = function () {

        };
        $scope.$on(AUTH_EVENTS.loginSuccess, function (event, user) {
            $scope.setCurrentUser(user);
            if (!$scope.$$phase) {
                $scope.$apply();
            }
        });

        $rootScope.$on('event:auth-loginConfirmed', function (data) {
            $rootScope.connectSockets();
        });

        $scope.$on('event:auth-loginRequired', function (rejection) {
            console.log("Refreshing token");
            LoginService.getJwtToken(Session.getLocalToken(), Session.getBackend())
                .then(function (result) {
                    authService.loginConfirmed(result, function (config) {
                        config.headers = config.headers || {};
                        config.headers.Authorization = 'JWT ' + Session.getToken();
                        return config;
                    });
                }, function (reason, code) {
                    console.error(reason, code);
                });
        });

        $scope.setCurrentPath = function (path) {
            $scope.currentPath = path;
        };

        $scope.doLogin = function (backend) {
            LoginService.loginUser(backend)
                .then(function (result) {
                    console.log('Logged in', result);
                    LoginService.getUserProfile();
                }, function (result) {
                    console.log('Error logging in', result);
                });
        };

        $scope.logout = function () {
            LoginService.logoutUser()
                .then(function (result) {
                    $rootScope.setCurrentUser(null);
                    $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
                });
            SocketService.removeHandler('site:broadcast');
        };

        $scope.$on('$destroy', function () {
            SocketService.removeHandler('site:broadcast');
        });

        $scope.showChatbar = function () {
            $scope.chatVisible = !$scope.chatVisible;
        };

        $scope.editMix = function (mix) {
            $state.go('root.edit', {slug: mix.slug});
        };

        $scope.deleteMix = function (mix) {
            var dlg = dialogs.create('app/dialogs/confirm/confirmDialog.html', 'confirmDialogCtrl', {
                title: "Delete this mix?",
                body: mix.title
            });
            dlg.result.then(function (result) {
                if (result) {
                    MixModel.destroy(mix.slug).then(function () {
                        $state.go('root.mixes');
                    });
                }
            });
        };
    });
