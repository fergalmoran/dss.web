'use strict';

angular.module('dssWebApp')
    .directive('dssPlaylist', function ($rootScope, PlaylistModel, MixModel) {

        function _refreshPlaylists(PlaylistModel, scope) {
            PlaylistModel.findAll(/*{slug: $rootScope.currentUser.slug}*/)
                .then(function (results) {
                    console.log('Playlists', results);
                    var _mix = scope.mix;
                    scope.playlists = $.map(results, function (item) {
                        console.log('Checking mix in playlist', _mix);
                        var isInPlaylist = _mix.playlists.filter(function (pl) {
                                return pl.slug === item.slug;
                            }).length != 0;
                        item.contains_mix = isInPlaylist;
                        return item;
                    });
                });
        }

        return {
            templateUrl: 'app/directives/playlist/playlist.html',
            restrict: 'EA',
            link: function (scope, element, attrs) {
                _refreshPlaylists(PlaylistModel, scope);

                scope.togglePlaylist = function (slug) {
                    var isInPlaylist = scope.mix.playlists.filter(function (pl) {
                            return pl.slug === slug;
                        }).length != 0;

                    if (isInPlaylist) {
                        _.remove(scope.mix.playlists, function (n) {
                            return n.slug === slug;
                        })
                    } else {
                        scope.mix.playlists.push({slug: slug});
                    }
                    MixModel.save(scope.mix.slug);
                    _refreshPlaylists(PlaylistModel, scope);
                    scope.$apply();
                };

                scope.addPlaylist = function () {
                    PlaylistModel.create({

                    })
                }
            }
        };
    });