'use strict';

angular.module('dssWebApp')
    .controller('MainCtrl', function ($scope, $rootScope, $http, $state, $auth, inform,
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
                        return $state.go(toState.name, toParams);
                    }, function (reason) {
                        debugger;
                        console.error(reason);
                    });
            } else {
                debugger;
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
            SocketService.removeListener('user:broadcast');
            var html = "";
            html += "                <div class=\"media\">";
            html += "                    <a class=\"thumbnail pull-left\" href=\"#\">";
            html += "                        <img class=\"media-object\" src=\"http:\/\/critterapp.pagodabox.com\/img\/user.jpg\">";
            html += "                    <\/a>";
            html += "                    <div class=\"media-body\">";
            html += "                        <h4 class=\"media-heading\">First Last Name<\/h4>";
            html += "                        <p><span class=\"label label-info\">888 photos<\/span> <span class=\"label label-warning\">150 followers<\/span><\/p>";
            html += "                        <p>";
            html += "                            <a href=\"#\" class=\"btn btn-xs btn-default\"><span class=\"glyphicon glyphicon-comment\"><\/span> Message<\/a>";
            html += "                            <a href=\"#\" class=\"btn btn-xs btn-default\"><span class=\"glyphicon glyphicon-heart\"><\/span> Favorite<\/a>";
            html += "                            <a href=\"#\" class=\"btn btn-xs btn-default\"><span class=\"glyphicon glyphicon-ban-circle\"><\/span> Unfollow<\/a>";
            html += "                        <\/p>";
            html += "                    <\/div>";
            html += "                <\/div>";

            SocketService.on('user:broadcast', function (message) {
                alert(message);
                inform.add(html, {
                    ttl: 800000,
                    html: true,
                    type: 'default'
                });
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
        };

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
