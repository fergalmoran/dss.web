angular.module('dssWebApp')
    .controller('loginDialogCtrl', function ($scope, $modalInstance) {
        $scope.doLogin = function (backend) {
            $modalInstance.close(backend);
        };
    });
