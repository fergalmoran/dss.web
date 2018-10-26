"use strict";

angular.module("dssWebApp")
    .controller("MixesCtrl", function ($scope, $stateParams, mixes, MixModel) {
        console.log("MixesCtrl", $scope);

        var infiniteScrollQuery = {
            page: $scope.page,
            waveform_generated: "True",
            is_featured: "True",
            limit: 3
        };
        //bit ugly but have to check if we should show breadcrumbs
        $scope.breadcrumbs = [];
        if ($stateParams.playlist !== undefined) {
            $scope.breadcrumbs = [
                {name: 'Playlists', state: 'root.playlists'},
                {name: $stateParams.playlist}
            ];
            infiniteScrollQuery['playlist__slug'] = $stateParams.playlist;
        }
        $scope.mixes = mixes;
        $scope.page = 1;
        $scope.nextPage = function (e) {
            $scope.page++;

            MixModel.findAll(infiniteScrollQuery);
        };
        //MixModel.bindAll(null, $scope, "mixes");
    });
