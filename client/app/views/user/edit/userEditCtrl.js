'use strict';

angular.module('dssWebApp')
    .controller('UserEditCtrl', function ($scope, $http, $q, SERVER_CONFIG, UserModel, user, logger) {
        console.log('Editing user', user);
        $scope.sharing_options = [
            {'abbr': 'Plays', 'power': 0},
            {'abbr': 'Likes', 'power': 1},
            {'abbr': 'Favourites', 'power': 2},
            {'abbr': 'Comments', 'power': 3},
            {'abbr': 'Follows', 'power': 4}
        ];
        $scope.editorOptions = {};

        $scope.vm = {
            user: user[0],
            tempSlug: user[0].slug,
            slugChanging: false,
            slugError: false
        };

        $scope.$on('$locationChangeStart', function (event) {
            updateUser();
        });

        $scope.detailsChange = function () {
            console.log('Details changed');
        };

        $scope.saveSlug = function () {
            if ($scope.vm.tempSlug != $scope.vm.user.slug) {
                $scope.checkSlug()
                    .then(function () {
                        $scope.vm.user.slug = $scope.vm.tempSlug;
                        updateUser();
                    });
            }
        };

        $scope.checkSlug = function () {
            if ($scope.vm.tempSlug != $scope.vm.user.slug) {
                var defer = $q.defer();
                $scope.vm.slugChanging = true;
                $http.get(SERVER_CONFIG.apiUrl + '/__u/checkslug' + '?slug=' + $scope.vm.tempSlug)
                    .then(function (result) {
                        if (result.status == 200) {
                            console.log('Slug checks out ok');
                            $scope.vm.slugChanging = false;
                            $scope.vm.slugError = false;
                            defer.resolve();
                        } else {
                            console.log('Slug must be unique');
                            $scope.vm.slugChanging = false;
                            $scope.vm.slugError = true;
                            defer.reject('Slug must be unique');
                        }
                    }, function (result) {
                        defer.reject('Error checking slug');
                    });

                return defer.promise;
            }
        };

        $scope.updateUser = function () {
            updateUser();
        };
        $scope.updateDescription = function () {
            console.log('Updating description', $scope.vm.user.description);
            updateUser();
        };

        function updateUser() {
            UserModel.save($scope.vm.user)
                .then(function (result) {
                    console.log('User saved successfully', result);
                }, function (error) {
                    console.log('Error saving user: ', error);
                });
        }
    });
