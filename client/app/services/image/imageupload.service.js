'use strict';

angular.module('dssWebApp')
    .service('ImageUploadService', function ($upload, logger, SERVER_CONFIG) {
        return {
            uploadMixImage: function (hash, image, success) {
                $upload.upload({
                    url: SERVER_CONFIG.apiUrl + '/_image/',
                    data: hash,
                    file: image
                }).success(function (data, status, headers, config) {
                    success(data);
                }).error(function (reason) {
                    logger.logError(reason, arguments);
                });
            }
        }
    }
);
