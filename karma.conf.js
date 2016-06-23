// Karma configuration
// http://karma-runner.github.io/0.10/config/configuration-file.html

module.exports = function (config) {
    config.set({
        // base path, that will be used to resolve files and exclude
        basePath: '',

        // testing framework to use (jasmine/mocha/qunit/...)
        frameworks: ['jasmine'],

        // list of files / patterns to load in the browser
        files: [
            'client/bower_components/jquery/dist/jquery.js',
            'client/bower_components/SoundManager2/script/soundmanager2.js',
            'client/bower_components/angular/angular.js',
            'client/bower_components/angular-mocks/angular-mocks.js',
            'client/bower_components/angular-animate/angular-animate.js',
            'client/bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
            'client/bower_components/angular-cookies/angular-cookies.js',
            'client/bower_components/angular-sanitize/angular-sanitize.js',
            'client/bower_components/angular-translate/angular-translate.js',
            'client/bower_components/angular-dialog-service/dist/dialogs.min.js',
            'client/bower_components/angular-dialog-service/dist/dialogs-default-translations.min.js',
            'client/bower_components/angular-jwt/dist/angular-jwt.js',
            'client/bower_components/angular-resource/angular-resource.js',
            'client/bower_components/angular-smilies/dist/angular-smilies.js',
            'client/bower_components/angular-socket-io/socket.js',
            'client/bower_components/angular-ui-router/release/angular-ui-router.js',
            'client/bower_components/waypoints/waypoints.js',
            'client/bower_components/SHA-1/sha1.js',
            'client/bower_components/angulartics/src/angulartics.js',
            'client/bower_components/angulartics/src/angulartics-adobe.js',
            'client/bower_components/angulartics/src/angulartics-chartbeat.js',
            'client/bower_components/angulartics/src/angulartics-cnzz.js',
            'client/bower_components/angulartics/src/angulartics-flurry.js',
            'client/bower_components/angulartics/src/angulartics-ga-cordova.js',
            'client/bower_components/angulartics/src/angulartics-ga.js',
            'client/bower_components/angulartics/src/angulartics-gtm.js',
            'client/bower_components/angulartics/src/angulartics-kissmetrics.js',
            'client/bower_components/angulartics/src/angulartics-mixpanel.js',
            'client/bower_components/angulartics/src/angulartics-piwik.js',
            'client/bower_components/angulartics/src/angulartics-scroll.js',
            'client/bower_components/angulartics/src/angulartics-segmentio.js',
            'client/bower_components/angulartics/src/angulartics-splunk.js',
            'client/bower_components/angulartics/src/angulartics-woopra.js',
            'client/bower_components/angulartics/src/angulartics-marketo.js',
            'client/bower_components/angulartics/src/angulartics-intercom.js',
            'client/bower_components/ckeditor/ckeditor.js',
            'client/bower_components/moment/moment.js',
            'client/bower_components/fullcalendar/dist/fullcalendar.js',
            'client/bower_components/hello/dist/hello.all.min.js',
            'client/bower_components/js-data/dist/js-data.js',
            'client/bower_components/js-data-angular/dist/js-data-angular.js',
            'client/bower_components/lodash/dist/lodash.compat.js',
            'client/bower_components/ng-file-upload/angular-file-upload.js',
            'client/bower_components/ng-file-upload-shim/angular-file-upload-shim.js',
            'client/bower_components/ngInfiniteScroll/build/ng-infinite-scroll.js',
            'client/bower_components/oauth-js/dist/oauth.min.js',
            'client/bower_components/remarkable-bootstrap-notify/bootstrap-notify.js',
            'client/bower_components/seiyria-bootstrap-slider/js/bootstrap-slider.js',
            'client/bower_components/smalot-bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',


            'client/app/app.js',
            'client/app/**/*.js',
            'client/app/**/**/*.js',
            'client/app/**/**/**/*.js',
            'client/app/**/**/**/**/*.js',
            'client/app/**/**/**/**/**/*.js',
            'client/app/**/**/**/**/**/**/*.js',
            'client/app/components/**/*.js',
            'client/app/**/*.jade',
            'client/app/components/**/*.jade',
            'client/app/**/*.html',
            'client/app/components/**/*.html'
        ],

        preprocessors: {
            '**/*.jade': 'ng-jade2js',
            '**/*.html': 'html2js',
            '**/*.coffee': 'coffee',
        },

        ngHtml2JsPreprocessor: {
            stripPrefix: 'client/'
        },

        ngJade2JsPreprocessor: {
            stripPrefix: 'client/'
        },

        // list of files / patterns to exclude
        exclude: [],

        // web server port
        port: 8080,

        // level of logging
        // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: false,


        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera
        // - Safari (only Mac)
        // - PhantomJS
        // - IE (only Windows)
        browsers: ['PhantomJS'],


        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun: false
    });
};
