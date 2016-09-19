'use strict';

angular.module('dssWebApp')
    .directive('dssMixItem', function () {
        return {
            templateUrl: 'app/views/mixes/mixes.directive.html',
            restrict: 'EA',
            scope: {
                mix: '='
            },
            link: function (scope, elem, attrs, AudioService, PLAYSTATES) {

            },
            controller: function ($scope, AudioService, AUDIO_EVENTS, PLAYSTATES) {
                $scope.playState = PLAYSTATES.stopped;
                $scope.playingId = "";

                if (AudioService.isPlaying($scope.mix)) {
                    $scope.playState = PLAYSTATES.playing;
                }

                $scope.play = function (mix) {
                    switch ($scope.playState) {
                        case PLAYSTATES.playing:
                            AudioService.pause();
                            $scope.playState = 2;
                            break;
                        case PLAYSTATES.paused:
                            AudioService.resume();
                            $scope.playState = 1;
                            break;
                        case PLAYSTATES.stopped:
                        default:
                            var d = soundManager.creindeateSound({
                                url: 'https://dsscdn2.blob.core.windows.net/assets/fuckyouchrome.mp3',
                                onfinish: function () {
                                    $scope.mix.getStreamUrl().then(function (response) {
                                        AudioService.play($scope.mix, response.data.url).then(function () {
                                            $scope.playingId = $scope.mix.slug;
                                            _addListeners($scope, AUDIO_EVENTS, PLAYSTATES);
                                            $scope.mix.addPlay($rootScope.currentUser ? $rootScope.currentUser.slug : '')
                                                .then(function (response) {
                                                    $scope.mix.plays.push(response);
                                                });
                                        });
                                        $scope.playState = 1;
                                    });
                                }
                            });
                            d.play();
                            break;
                    }
                    event.stopPropagation();
                };

            }
        };
        function _addListeners($scope, AUDIO_EVENTS, PLAYSTATES) {
            var _stopListener = $scope.$on(AUDIO_EVENTS.audioStop, function (event, id) {
                if ($scope.playingId === id) {
                    $scope.playingId = -1;
                    $scope.playState = PLAYSTATES.stopped;
                    _stopListener();
                }
            });

            $scope.$on(AUDIO_EVENTS.audioPause, function (event, id) {
                if ($scope.playingId === id) {
                    $scope.playState = PLAYSTATES.paused;
                }
            });

            $scope.$on(AUDIO_EVENTS.audioResume, function (event, id) {
                if ($scope.playingId === id) {
                    $scope.playState = PLAYSTATES.playing;
                }
            });

        }
    });
