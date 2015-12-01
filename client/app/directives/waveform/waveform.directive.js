'use strict';

angular.module('dssWebApp')
    .directive('dssWaveform', function (AudioService, PLAYSTATES, AUDIO_EVENTS) {
        return {
            templateUrl: 'app/directives/waveform/waveform.html',
            restrict: 'EA',
            link: function (scope, elem, attrs) {
                elem.ready(function () {
                    var scrubBar = $('.scrubbar', elem);
                    scope.maxWidth = $('.scrubbar', elem).outerWidth(false);

                    $('.scrub-prog-img').width($('.scrub-bg').width());
                    $('.scrub-bg').bind('widthChange', function () {
                        console.log("WidthChange");
                        $('.scrub-prog-img').width($('.scrub-bg').width());
                    });

                    scrubBar.mousemove(function (e) {
                        $('.scrubBox-hover', scrubBar).css({
                            'left': (e.clientX - scrubBar.offset().left)
                        });
                    });

                    scope.$on(AUDIO_EVENTS.audioProgress, function (event, duration, position) {
                        if (scope.playState == PLAYSTATES.playing) {
                            scope.elapsed = position / 1000;
                            scope.playPos = (position / duration) * scope.maxWidth;
                            if (!scope.$$phase) {
                                scope.$apply();
                            }
                        }
                    });
                    scope.$on(AUDIO_EVENTS.audioFinished, function (id) {
                        scope.playState = PLAYSTATES.stopped;
                    });
                    scope.setPosition = function (event) {
                        console.log("AudioPlayer: setPosition", event);
                        if (scope.playState != PLAYSTATES.stopped) {
                            var newPosition = ((event.pageX - (scrubBar.offset().left)) / (scope.maxWidth) * 100);
                            AudioService.setPosition(newPosition);
                        }
                    };
                });
            },
            controller: function ($scope) {

            }
        };
    });
