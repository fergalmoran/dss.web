'use strict';

angular.module('dssWebApp')
    .controller('UsersCtrl', function ($scope, $stateParams, UserModel, users) {
        $scope.users = users;
        $scope.initials = [
            'A',
            'B',
            'C',
            'D',
            'E',
            'F',
            'G',
            'H',
            'I',
            'J',
            'K',
            'L',
            'M',
            'N',
            'O',
            'P',
            'Q',
            'R',
            'S',
            'T',
            'U',
            'V',
            'W',
            'X',
            'Y',
            'Z'
        ];
        console.log($stateParams);
        if ($stateParams.initial !== undefined){
            $scope.currentInitial = $stateParams.initial;
        }else{
            $scope.currentInitial = '';
        }
        /*
        $scope.page = 1;

        $scope.nextPage = function (e) {
            $scope.page++;
            UserModel.findAll({
                page: $scope.page,
                limit: 3
            });
        };
        UserModel.bindAll(null, $scope, 'users');*/
    });
