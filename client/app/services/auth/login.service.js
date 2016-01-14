angular.module('dssWebApp')
    .factory('LoginService', function ($rootScope, $http, $q, Session, UserModel, logger,
                                       SERVER_CONFIG, STORAGE, AUTH_BACKENDS, AUTH_EVENTS) {

        return {
            loginUser: loginUser,
            logoutUser: logoutUser,
            getUserProfile: getUserProfile,
            getJwtToken: getJwtToken
        };

        function loginUser(provider) {
            var defer = $q.defer();
            var backend = provider || Session.getBackend();
            hello(backend).login({force: false}).then(function (result) {
                var response = hello.getAuthResponse(backend);
                var data = {
                    "access_token": response.access_token,
                    "backend": backend
                };
                if (backend === 'twitter') {
                    data.access_token_secret= response.oauth_token_secret;
                }
                Session.setLocalToken(response.access_token);
                getJwtToken(data, AUTH_BACKENDS[backend])
                    .then(function (user) {
                        defer.resolve(user);
                    }).error(function (reason, code) {
                    defer.reject(reason, code);
                });
            }, function (e) {
                console.error(e);
                defer.reject(e);
            });
            return defer.promise;
        }

        function getJwtToken(data, backend) {
            var defer = $q.defer();
            //need to clear any cached tokens before attempting login
            //otherwise server will 403 us
            Session.removeJwtToken();
            $http.post(SERVER_CONFIG.apiUrl + '/_login/', data).success(function (response, status, headers, config) {
                if (response.token) {
                    Session.setToken(response.token);
                    Session.setSession(response.session);
                    Session.setBackend(backend);
                    defer.resolve(backend);
                } else {
                    defer.reject("Invalid response token", 500);
                }
            }).error(function (response, status, headers, config) {
                defer.reject("Unable to retrieve access token", 500);
            });
            return defer.promise;
        }

        function getUserProfile() {
            var defer = $q.defer();
            $http.get(SERVER_CONFIG.apiUrl + '/__u/')
                .success(function (data, status, headers, config) {
                    UserModel.find(data.slug)
                        .then(function (user) {
                            Session.create(user);
                            $rootScope.$broadcast(AUTH_EVENTS.loginSuccess, user);
                            defer.resolve(user);
                        }, function (result) {
                            defer.reject("Unable to get user object", 500);
                        })
                }).error(function (data, status, headers, config) {
                defer.reject("Unable to get user proxy", 500);
            });
            return defer.promise;
        }

        function logoutUser() {
            var defer = $q.defer();
            hello.logout(Session.getBackend())
                .then(function () {
                    Session.destroy();
                    defer.resolve();
                }, function () {
                    Session.destroy();
                    defer.resolve();
                });
            return defer.promise;
        }
    });
