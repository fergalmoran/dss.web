'use strict';

angular.module('dssWebApp')
    .controller('NavbarCtrl', function ($rootScope, $scope, $location, $http, SERVER_CONFIG) {
        $scope.menu = [{
            'title': 'Home',
            'link': '/'
        }];
        $scope.selected = undefined;
        $scope.isCollapsed = true;
        $scope.loadingSearchResults = false;
        $scope.notificationCount = 0;
        $scope.isActive = function (route) {
            return route === $location.path();
        };
        $scope.podcastUrl = SERVER_CONFIG.podcastUrl;

        $scope.showActivityArea = function () {
            $scope.activityAreaOpen = true;
        };

        $scope.getSearchResults = function (val) {
            $scope.loadingSearchResults = true;
            return $http.get(SERVER_CONFIG.apiUrl + '/_search/', {
                params: {
                    q: val
                }
            }).then(function (response) {
                return response.data;
            });
        };

        $scope.doDebug = function () {
            $http.get(SERVER_CONFIG.apiUrl + '/__debug/');
        };

    });
