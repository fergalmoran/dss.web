'use strict';

angular.module('dssWebApp')
    .controller('UserItemCtrl', function ($scope, UserModel, MixModel, SERVER_CONFIG, user, logger) {
        logger.logSuccess('UserItemCtrl', $scope);
        $scope.user = user;
        $scope.userPodcastUrl = SERVER_CONFIG.podcastUrl + '/' + user.slug;
        function _getMixes (ordering) {
            $scope.mixTitle = "Latest";
            MixModel.findAll({
                user__slug: user.slug,
                waveform_generated: "True",
                limit: 6,
                ordering: ordering
            }).then(function (mixes) {
                $scope.mixes = mixes;
                $scope.mixPage = 1;
            });
        }
        _getMixes("-id");
        $('#mixes-tabs').find('a').click(function (e) {
            console.log("Tabbing");
            e.preventDefault();
            _getMixes($(e.target).data("dss-ordering"));
        });
    });