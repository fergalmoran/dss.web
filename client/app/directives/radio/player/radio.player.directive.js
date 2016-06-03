'use strict';

angular.module('dssWebApp')
    .directive('dssRadioPlayer', function ($rootScope, $http, SocketService, AudioService, SERVER_CONFIG) {
        return {
            restrict: 'E',
            templateUrl: 'app/directives/radio/player/radio.player.html',
            scope: {},
            link: function ($scope, $element, $attrs) {
                $rootScope.radioAvailable = false;
                $scope.radioPlaying = false;
                $scope.radioLoading = false;

                SocketService.on('socket:site:radio_changed', function (data) {
                    console.log('site:radio_changed', data);
                    var d = JSON.parse(data);
                    $scope.radioNowPlaying = d.message.description;
                    $scope.radioNowPlayingUrl = d.message.url;
                    $scope.$apply();
                });

                $scope.checkRadioStatus = function () {
                    $http.get(SERVER_CONFIG.apiUrl + '/_radio?np')
                        .then(function (result) {
                            console.log("Radio", result);
                            $scope.radioAvailable = result.data.status === 2;
                            if (result.data.status === 2) {
                                $scope.radioNowPlaying = result.data.metadata.current_song;
                            }
                        });
                };
                $scope.checkRadioStatus();
                $scope.playRadio = function ($event) {
                    if (!$scope.radioPlaying) {
                        $scope.radioLoading = true;
                        //TODO: get rid of radioUrl here and query api server for url
                        AudioService.playLive(SERVER_CONFIG.radioUrl + "/dss", "DSS Radio")
                            .then(function (result) {
                                $scope.radioLoading = false;
                                $scope.radioPlaying = true;
                            });
                    } else {
                        AudioService.stop();
                        $scope.radioPlaying = false;
                    }
                    $event.stopPropagation();
                };
            }
        }
    });
