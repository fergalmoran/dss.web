'use strict';

angular.module('dssWebApp')
    .controller('FooterCtrl', function ($scope, AudioService, AUDIO_EVENTS, PLAYSTATES) {
        var sliding = false;
        $scope.mix = {};
        $scope.sliding = false;
        $scope.vm = {
            playState: PLAYSTATES.stopped,
            playPos: 0,
            max: 100,
            currentVolume: AudioService.getVolume(),
            timeCurrent: "00:00",
            timeDuration: "00:00"
        };

        $('.currentVolume').slider({
            range: [0, 1],
            step: 0.01,
            start : 0.5,
            handles: 1,
            slide: function() {
                var volume = Math.round($(this).val()* 100);
                AudioService.setVolume(volume);
                $('.volumeText').html('Volume: ' + (volume).toFixed(0) + '');
                $scope.vm.currentVolume = volume;
                $scope.$apply();
            }
        });
        $scope.playPause = function () {
            switch ($scope.vm.playState) {
                case PLAYSTATES.playing:
                    AudioService.pause();
                    break;
                case PLAYSTATES.paused:
                    AudioService.resume();
                    break;
                default:
                    break;
            }
            event.stopPropagation();
        };

        $scope.$on(AUDIO_EVENTS.audioStart, function (event, mix, id, duration) {
            $scope.mix = mix;
            $scope.vm.playState = PLAYSTATES.playing;
            $scope.vm.timeDuration = duration/1000;
        });

        $scope.$on(AUDIO_EVENTS.audioPause, function (event, id) {
            $scope.vm.playState = PLAYSTATES.paused;
        });

        $scope.$on(AUDIO_EVENTS.audioResume, function (event, id) {
            $scope.vm.playState = PLAYSTATES.playing;
        });

        $scope.$on(AUDIO_EVENTS.audioProgress, function (event, duration, position) {
            if (position)
                $scope.vm.timeCurrent = position / 1000;
            if (duration)
                $scope.vm.timeDuration = duration/1000;
            $scope.vm.playPos = (position / duration) * 100;
            if (!$scope.$$phase) {
                $scope.$apply();
            }
        });
        $scope.doSeek = function($event){
            var $bar = $(event.currentTarget);
            var newPosition = ((event.pageX - ($bar.offset().left)) / ($bar.width()) * 100);
            AudioService.setPosition(newPosition, false);
        }
    });
