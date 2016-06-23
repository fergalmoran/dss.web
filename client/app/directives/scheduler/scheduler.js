angular.module('dssWebApp')
    .directive('dssScheduler', function ($http, SERVER_CONFIG) {
        return {
            restrict: 'E',
            templateUrl: 'app/directives/scheduler/scheduler.html',
            link: function (scope, elem, attrs) {
                scope.selected = undefined;
                scope.vm.start_date = moment(scope.vm.start_date).format('DD/MM/YYYY - HH:00');
                $('#start-date', elem).datetimepicker({
                    format: "dd/mm/yyyy - hh:ii",
                    minView: '1',
                    autoclose: true
                });
                scope.chooseValue = function (viewValue) {
                    console.log(viewValue);
                    scope.vm.performer = viewValue;
                };
                scope.getUserSearchResults = function (val) {
                    scope.loadingSearchResults = true;
                    return $http.get(SERVER_CONFIG.apiUrl + '/_search/', {
                        params: {
                            type: 'user',
                            q: val
                        }
                    }).then(function (response) {
                        return response.data.map(function (item) {
                            return {
                                'id': item.id,
                                'display_name': item.display_name,
                                'image': item.image
                            };
                        });
                    });
                };
                scope.getUserSearchResults = function (val) {
                    scope.loadingSearchResults = true;
                    return $http.get(SERVER_CONFIG.apiUrl + '/_search/', {
                        params: {
                            type: 'user',
                            q: val
                        }
                    }).then(function (response) {
                        return response.data.map(function (item) {
                            return {
                                'id': item.id,
                                'display_name': item.display_name,
                                'image': item.image
                            };
                        });
                    });
                };
            }
        };
    });
