angular.module('dssWebApp')
    .directive('dssSearchMix', function ($http, SERVER_CONFIG) {
        console.log('dssSearchMix');
        return {
            restrict: 'E',
            templateUrl: 'app/directives/search/mix/searchMix.html',
            scope: {
                mix: "=mix"
            },
            link: function (scope, element, attrs) {
                scope.chooseValue = function (viewValue) {
                    //console.log(viewValue);
                    //scope.mix = viewValue;
                    document.activeElement.blur();
                    $('#search-input').blur();
                };
                scope.dismiss = function () {
                    alert('Hello');
                };
                scope.getMixSearchResults = function (val) {
                    console.log("Getting results");
                    scope.loadingSearchResults = true;
                    return $http.get(SERVER_CONFIG.apiUrl + '/_search/', {
                        params: {
                            type: 'mix',
                            q: val
                        }
                    }).then(function (response) {
                        return response.data.map(function (item) {
                            return {
                                'id': item.id,
                                'user': item.user,
                                'slug': item.slug,
                                'url': item.url,
                                'display_name': item.title,
                                'image': item.image
                            };
                        });
                    });
                };
            }
        };
    });
