angular.module('dssWebApp')
    .controller('confirmDialogCtrl', function ($scope, $modalInstance, data) {

        $scope.data = data;

        $scope.doClose = function (result) {
            $modalInstance.close(result);
        };
    });
