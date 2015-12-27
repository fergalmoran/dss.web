'use strict';

angular.module('dssWebApp')
    .controller('MixUploadCtrl',
        function ($scope, $rootScope, $location, $state, $timeout, $http, mix, dialogs, SocketService, jwtHelper,
                  Session, MixModel, LoginService, ImageUploadService, SERVER_CONFIG, AUTH_EVENTS) {

            $scope.mix = mix;
            $scope.waveformHeader = '(drag & drop or click & browse)';
            $scope.waveformFooter = '';
            $scope.sending = false;

            $scope.multipleDemo = {};
            $scope.multipleDemo.colors = ['Blue', 'Red'];

            var uploadStates = {
                VIRGIN: 0,
                AUDIO_SENDING: 1,
                AUDIO_SENT: 2,
                EDIT_MODE: 3
            };
            $scope.uploadStates = uploadStates;
            var _uploadHash = generateUUID();

            var processingStates = {
                VIRGIN: 0,
                PROCESSED: 1
            };
            $scope.processingStates = processingStates;

            function generateUUID() {
                var d = new Date().getTime();
                return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                    var r = (d + Math.random() * 16) % 16 | 0;
                    d = Math.floor(d / 16);
                    return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
                });
            }

            function _checkRedirect() {
                $scope.sending = false;
                if ($scope.detailsEntered && $scope.uploadState >= uploadStates.AUDIO_SENT &&
                    $scope.processingState == processingStates.PROCESSED) {
                    MixModel.refresh($scope.mix.slug).then(function (m) {
                        $state.go('root.user.mix', {user: m.user.slug, mix: m.slug});
                    });
                }
            }

            function _registerProcessingCallback() {
                SocketService.registerHandler('user:process', function (message) {
                    console.log("Received user:process message: ", message);
                    if (message.type === 'waveform' && message.target === _uploadHash) {
                        $scope.waveformHeader = "Waveform generated.";
                        $scope.processingState = processingStates.PROCESSED;
                        $scope.$apply();
                        _checkRedirect();
                    }
                });
            }

            if ($rootScope.currentUser) {
                _registerProcessingCallback();
            } else {
                $rootScope.$on(AUTH_EVENTS.loginSuccess, function (data) {
                    _registerProcessingCallback();
                });
            }

            if (!$scope.mix) {
                $scope.detailsEntered = false;
                $scope.mix = {
                    title: '',
                    description: '',
                    uid: _uploadHash,
                    genres: [],
                    is_downloadable: true,
                    is_featured: false,
                    is_private: false,
                    image: 'assets/images/placeholders/upload-placeholder.png'
                };
                $scope.uploadState = uploadStates.VIRGIN;
                $scope.processingState = processingStates.VIRGIN;
            } else {
                $scope.detailsEntered = true;
                $scope.uploadState = uploadStates.EDIT_MODE;
                $scope.processingState = processingStates.PROCESSED;
                _uploadHash = $scope.mix.uid;
            }

            $scope.saveMix = function () {
                $scope.$broadcast('show-errors-check-validity');
                if ($scope.uploadForm.$valid) {
                    $scope.sending = true;
                    /*
                    $.each($('#genres', this.el).select2('data'), function (i, item) {
                        $scope.mix.genres.push({'slug': item.slug, 'description': item.description})
                    });
                    */
                    if ($scope.uploadState != uploadStates.EDIT_MODE) {
                        MixModel.create($scope.mix).then(function (result) {
                            _processResult(result);
                        });
                    } else {
                        MixModel.update($scope.mix.slug, $scope.mix).then(function (result) {
                            console.log('Updated mix', result);
                            _processResult(result);
                        });
                    }
                    var _processResult = function (result) {
                        $scope.mix = result;
                        $timeout(function () {
                            $scope.waveformFooter = "Waveform processing is taking longer than expected.<br />" +
                                "Your mix should be available <a ui-sref='root.user.mix({user: currentUser.slug, mix: mix.slug})'>Here</a>";
                            $scope.$apply();
                        }, 120000);

                        var imageFile = document.getElementById('mix-image-fileinput').files[0];
                        if (imageFile) {
                            ImageUploadService.uploadMixImage(_uploadHash, imageFile, function (result) {
                                $scope.detailsEntered = true;
                                _checkRedirect();
                            });
                        } else {
                            $scope.detailsEntered = true;
                            _checkRedirect();
                        }
                    };
                } else {
                    $scope.uploadForm.$dirty = true;
                }
            };
            //TODO: refactor dropzone out to a directive
            $('#dss-file-upload').dropzone({
                addRemoveLinks: true,
                acceptedFiles: '.mp3',
                url: SERVER_CONFIG.apiUrl + '/_upload/',
                dictDefaultMessage: '<span class="bigger-150 bolder"><i class="ace-icon fa fa-caret-right red"></i> Drop files</span> to upload ' +
                '<span class="smaller-80 grey">(or click)</span> <br /> <i class="upload-icon ace-icon fa fa-cloud-upload blue fa-3x"></i>',
                maxFilesize: 512,
                sending: function (file, xhr, formData) {
                    xhr.setRequestHeader('Session-Id', Session.getSession())
                    xhr.setRequestHeader('Upload-Hash', _uploadHash);
                    $scope.uploadState = uploadStates.AUDIO_SENDING;
                    $scope.$apply();
                },
                uploadprogress: function (e, progress, bytesSent) {
                    $scope.uploadProgress = Math.round(progress);
                    $scope.uploadProgressStyle = {'width': progress + '%'};
                    $scope.$apply();
                },
                complete: function (file) {
                    if (file.status !== 'error') {
                        $scope.waveformHeader = "Generating waveform.";
                        $scope.uploadState = uploadStates.AUDIO_SENT;
                        $scope.$apply();
                        _checkRedirect();
                    } else {
                        var dlg = dialogs.create('app/dialogs/alert/alertDialog.html', 'AlertDialogCtrl', {
                            title: "Error",
                            body: "There was an error uploading the audio file. Maybe try again later?"
                        });
                    }
                }
            });
            $scope.refreshGenres = function (search) {
                $http.get(SERVER_CONFIG.apiUrl + '/genre/?q=' + search)
                    .then(function (results) {
                        $scope.genreSearchResults = results.data.results;
                    });
            };
        });
