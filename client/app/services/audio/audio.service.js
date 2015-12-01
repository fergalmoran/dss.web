'use strict';

angular.module('dssWebApp')
    .service('AudioService', function AudioService($rootScope, $interval, $q, logger, AUDIO_EVENTS, AUDIO_CONSTANTS) {
        // AngularJS will instantiate a singleton by calling "new" on this function
        var _currentMix;
        var _currentSound;
        var _soundId;

        soundManager.setup({
            html5PollingInterval: 50,
            flashVersion: 9,
            debugMode: false,
            defaultOptions: {
                volume: _getStoredVolume()
            }
        });

        function _getStoredVolume() {
            return  Math.round(localStorage.getItem(AUDIO_CONSTANTS.volume) || 50);
        }

        function _setStoredVolume(volume) {
            localStorage.setItem(AUDIO_CONSTANTS.volume, Math.round(volume));
        }

        function makeSound(url) {
            var sound = soundManager.createSound({
                url: url,
                whileplaying: function () {
                    if (this.duration) {
                        $rootScope.$broadcast(AUDIO_EVENTS.audioProgress, this.durationEstimate, this.position, this.elapsed);
                    }
                },
                onplay: function () {
                    $rootScope.$broadcast(AUDIO_EVENTS.audioStart, _currentMix, _soundId, this.duration);
                    $rootScope.isPlaying = true;
                },
                onstop: function () {
                    $rootScope.$broadcast(AUDIO_EVENTS.audioStop, _soundId);
                },
                onfinish: function () {
                    $rootScope.$broadcast(AUDIO_EVENTS.audioFinish, _soundId);
                }

            });
            return sound;
        }

        this.playLive = function (url, title) {
            var _this = this;
            return $q(function (resolve, reject) {
                if ($rootScope.radioPlaying) {
                    _this.stop();
                    $rootScope.radioPlaying = false;
                    $rootScope.radioLoading = false;
                    resolve(true);
                } else {
                    $rootScope.safeApply();
                    _this.stop();
                    _currentSound = soundManager.createSound({
                        url: url,
                        onload: function () {
                            resolve();
                        }
                    });
                    _currentSound.play({
                        url: url
                    });
                    _soundId = title;
                }
            });
        };
        this.play = function (mix, url) {
            var _this = this;
            return $q(function (resolve, reject) {
                if (soundManager.canPlayURL(url)) {
                    _this.stop();
                    _currentMix = mix;
                    _currentSound = makeSound(url);
                    _currentSound.play({
                        url: mix.stream_url,
                        position: 0
                    });
                    _soundId = mix.slug;
                    resolve();
                } else {
                    $rootScope.$broadcast(AUDIO_EVENTS.audioFailed, _soundId);
                }
            });
        };
        this.pause = function () {
            if (_currentSound) {
                _currentSound.togglePause();
                $rootScope.$broadcast(AUDIO_EVENTS.audioPause, _soundId);
            }
        };
        this.resume = function () {
            if (_currentSound) {
                _currentSound.togglePause();
                $rootScope.$broadcast(AUDIO_EVENTS.audioResume, _soundId);
            }
        };
        this.stop = function () {
            if (_currentSound) {
                _currentSound.stop();
                $rootScope.$broadcast(AUDIO_EVENTS.audioStop, _soundId);
            }
        };
        this.setPosition = function (position, absolute) {
            if (absolute)
                _currentSound.setPosition(position);
            else
                _currentSound.setPosition((_currentSound.durationEstimate / 100) * position);
            _currentSound._iO.whileplaying.apply(_currentSound);
        };
        this.isPlaying = function (mix) {
            return _soundId === mix.slug;
        };
        this.setVolume = function (volume) {
            if (_currentSound) {
                _currentSound.setVolume(volume);
            }
            _setStoredVolume(volume);
        };
        this.getVolume = function (volume) {
            return _getStoredVolume();
        };
    });
