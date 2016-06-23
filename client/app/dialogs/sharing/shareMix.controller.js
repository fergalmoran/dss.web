angular.module('dssWebApp')
    .controller('ShareMixCtrl', function ($scope, $modalInstance, $http, SERVER_CONFIG, data) {
        var embedLink = SERVER_CONFIG.apiUrl + '/_embed/mix/' + data.mix.slug;
        $scope.vm = {
            embedLink: embedLink,
            embedIframe:
                '<iframe width="100%" height="166" scrolling="no" frameborder="no" ' +
                'src="' + embedLink + '">' +
                '</iframe>'
        };
        $scope.doClose = function (result) {
            $modalInstance.close(result);
        };
        $('.nav-tabs').click(function (e) {
            e.preventDefault()
            $(this).tab('show')
        });
        $('#embed-tab').tab();
    });