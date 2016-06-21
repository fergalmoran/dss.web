angular.module('dssWebApp')
    .factory('MixModel', function ($http, DS, SERVER_CONFIG) {
        return DS.defineResource({
            name: 'mix',
            idAttribute: 'slug',
            methods: {
                getStreamUrl: function () {
                    return $http.get(SERVER_CONFIG.apiUrl + '/mix/' + this.slug + '/stream_url/');
                },
                addPlay: function (user) {
                    return $http.post(SERVER_CONFIG.apiUrl + '/_act/play' + '?id=' + this.slug);
                }
            }
        });
    })
    .run(function (MixModel) {

    });
