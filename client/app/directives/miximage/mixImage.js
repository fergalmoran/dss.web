'use strict';

angular.module('dssWebApp')
    .directive('dssMixImage', function (){
        return {
            restrict: 'E',
            templateUrl: 'app/directives/miximage/miximage.html',
            replace: true
        }
    });