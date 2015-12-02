'use strict';

angular.module('dssWebApp')
    .directive('dssAudioPlayer', function ($rootScope, $state, $http, dialogs, MixModel, UserModel,
                                           AudioService, SERVER_CONFIG, PLAYSTATES, AUDIO_EVENTS) {

        return {
            restrict: 'E',

            link: function (scope, elem, attrs) {
                scope.getTemplateUrl = function () {
                    return 'app/' + attrs.template;
                }
            },
            template: '<div ng-include="getTemplateUrl()"></div>',
            controller: function ($scope, AudioService) {
                $scope.addingComment = false;
                $scope.playState = PLAYSTATES.stopped;
                $scope.playPos = 0;
                $scope.elapsed = 0;
                if (AudioService.isPlaying($scope.mix)) {
                    $scope.playState = PLAYSTATES.playing;
                }

                $scope.showCommentForm = function (event) {
                    console.log(event);
                    $scope.addingComment = !$scope.addingComment;
                };

                $scope.downloadFile = function () {
                    var url = SERVER_CONFIG.apiUrl + '/_download/?uid=' + $scope.mix.uid;
                    $http.get(url)
                        .success(function (data, status, headers, config) {
                            var link = document.createElement('a');
                            link.href = data.url;
                            document.body.appendChild(link);
                            link.click();
                        }).error(function (data, status, headers, config) {
                            alert("Error downloading mix");
                        });
                };

                $scope.shareEmbed = function () {
                    var dlg = dialogs.create(
                        'app/dialogs/sharing/shareMix.html',
                        'ShareMixCtrl',
                        {mix: $scope.mix},
                        {size: 'md'});
                };
                $scope.shareFacebook = function () {
                    helpers.social.postToFacebook($scope.mix);
                };
                $scope.shareTwitter = function () {
                    helpers.social.postToTwitter($scope.mix);
                };
                $scope.toggleFollow = function () {
                    if ($scope.currentUser) {
                        if ($scope.mix.user.is_following) {
                            _.remove($scope.currentUser.following, function (n) {
                                return n.slug === $scope.mix.user.slug;
                            });
                        } else {
                            $scope.currentUser.following.push({slug: $scope.mix.user.slug});
                        }
                        UserModel.save($scope.currentUser.slug)
                            .then(function (result) {
                                console.log('Updated following', result);
                                $scope.mix.user.is_following = !$scope.mix.user.is_following;
                            }, function (error) {
                                console.error('Error updating follow', error);
                            });
                    }
                };
                $scope.toggleLike = function () {
                    if ($scope.mix.is_liked) {
                        console.log("Here");
                        _.remove($scope.mix.likes, function (n) {
                            return n.slug === $rootScope.currentUser.slug;
                        });
                    } else {
                        $scope.mix.likes.push({slug: $rootScope.currentUser.slug});
                    }
                    MixModel.save($scope.mix.slug);
                };
                $scope.play = function (event) {
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
                            AudioService.stop();
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
                            break;
                    }
                };
            }
        };
        function _addListeners($scope, AUDIO_EVENTS, PLAYSTATES) {
            var _stopListener = $scope.$on(AUDIO_EVENTS.audioStop, function (event, id) {
                if ($scope.playingId === id) {
                    $scope.playingId = -1;
                    $scope.playState = PLAYSTATES.stopped;
                    _stopListener();
                    _progressListener();
                }
            });
        }
    });
