'use strict';

angular.module('dssWebApp')
    .constant('AUDIO_EVENTS', {
        audioStart: 'audio-start',
        audioLoaded: 'audio-loaded',
        audioFailed: 'audio-failed',
        audioStop: 'audio-stop',
        audioPause: 'audio-pause',
        audioResume: 'audio-resume',
        audioFinish: 'audio-finish',
        audioProgress: 'audio-progress'
    });
