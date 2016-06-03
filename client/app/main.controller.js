'use strict';

angular.module('dssWebApp')
    .controller('MainCtrl', function ($scope, $rootScope, $http, $state, $auth,
                                      dialogs, logger, SocketService, AudioService,
                                      MixModel, UserModel, LoginService, Session, SERVER_CONFIG, CHAT_EVENTS, AUTH_EVENTS) {
        $scope.isAuthorized = LoginService.isAuthorized;
        $scope.isAuthenticated = LoginService.isAuthenticated;
        $scope.currentPath = '';
        $scope.chatVisible = false;
        $rootScope.isMessaging = false;
        $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
            if ($auth.isAuthenticated()) {
                LoginService.getUserProfile()
                    .then(function (user) {
                        $rootScope.setCurrentUser(user);
                        $rootScope.connectSockets();
                        return $state.go(toState.name, toParams);
                    });
            }
        });
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

        $scope.$on('socket:error', function (ev, data) {
            console.error(data);
        });

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
        $scope.startChat = function (slug) {
            console.log("Starting chat", slug);
            UserModel.find(slug).then(function (user) {
                $rootScope.isMessaging = true;
                $rootScope.$broadcast(CHAT_EVENTS.startChat, user);
            });
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

        $scope.getMixUrl = function (mix) {
            var port = window.location.port;
            return window.location.protocol +
                "//" + window.location.hostname +
                (port === '80' ? '' : ':' + port) +
                $state.href('root.user.mix', {user: mix.user.slug, mix: mix.slug});
        };

        $scope.copyUrl = function (mix) {
            var url = getMixUrl(mix);
            console.log("Copied URL", url);
        };

        $scope.showChatbar = function () {
            $scope.chatVisible = !$scope.chatVisible;
        };

        $scope.editMix = function (mix) {
            $state.go('root.user.mix.edit', {mix: mix.slug});
        };

        $scope.deleteMix = function (mix) {
            var dlg = dialogs.create('app/dialogs/confirm/confirmDialog.html', 'confirmDialogCtrl', {
                title: "Delete this mix?",
                body: mix.title
            });
            dlg.result.then(function (result) {
                if (result) {
                    MixModel.destroy(mix.slug).then(function () {
                        $state.go('root');
                    });
                }
            });
        };
    });
