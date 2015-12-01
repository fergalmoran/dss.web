angular.module('dssWebApp')
    .controller('AlertDialogCtrl', function ($scope, $modalInstance, data) {
        $scope.data = data;
        $scope.doClose = function (result) {
            $modalInstance.close(result);
        };
    });
