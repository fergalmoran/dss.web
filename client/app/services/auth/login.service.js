angular.module('dssWebApp')
    .factory('LoginService', function ($rootScope, $http, $q, $auth, Session, UserModel, logger,
                                       SERVER_CONFIG, STORAGE, AUTH_BACKENDS, AUTH_EVENTS) {

        return {
            loginUser: loginUser,
            logoutUser: logoutUser,
            getUserProfile: getUserProfile,
            getJwtToken: getJwtToken
        };

        function loginUser(provider) {
            var deferred = $q.defer();

            var prov = provider || Session.getBackend();
            $auth.authenticate(prov, {backend: prov})
                .then(function () {
                    console.log('You have successfully signed in with ' + prov + '!');
                    deferred.resolve();
                })
                .catch(function (error) {
                    if (error.error) {
                        // Popup error - invalid redirect_uri, pressed cancel button, etc.
                        console.error(error.error);
                        deferred.reject(error.error);
                    } else if (error.data) {
                        // HTTP response error from server
                        console.error(error.data.message, error.status);
                        deferred.reject(error.status);
                    } else {
                        console.error(error);
                        deferred.reject(error);
                    }
                });
            return deferred.promise;
        }

        function getJwtToken(token, backend) {
            var defer = $q.defer();
            //need to clear any cached tokens before attempting login
            //otherwise server will 403 us
            Session.removeJwtToken();
            $http.post(SERVER_CONFIG.apiUrl + '/_login/?backend?backend=' + backend , {
                'code': token
            }).success(function (response, status, headers, config) {
                if (response.token) {
                    Session.setToken(response.token);
                    Session.setSession(response.session);
                    Session.setBackend(backend);
                    defer.resolve(backend);
                } else {
                    defer.reject('Invalid response token', 500);
                }
            }).error(function (response, status, headers, config) {
                defer.reject('Unable to retrieve access token', 500);
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
                            Session.setSession(data.session);
                            $rootScope.$broadcast(AUTH_EVENTS.loginSuccess, user);
                            defer.resolve(user);
                        }, function (result) {
                            defer.reject('Unable to get user object', 500);
                        })
                }).error(function (data, status, headers, config) {
                defer.reject('Unable to get user proxy', 500);
            });
            return defer.promise;
        }

        function logoutUser() {
            var defer = $q.defer();
            $auth.logout()
                .then(function(){
                    defer.resolve();
                });

            return defer.promise;
        }
    });
