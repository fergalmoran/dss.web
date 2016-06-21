angular.module('dssWebApp')
    .provider('DRFAdapter', function () {

        'use strict';

        var defaults = this.defaults = {
            queryTransform: function (resourceName, params) {
                return params;
            }
        };

        // inject whatever you need here
        this.$get = ['$q', function ($q) {

            return {
                defaults: defaults,

                // implement each function that will be used
                find: function (resourceConfig, id, options) {

                    // "resourceConfig" will be the return value of DS.defineResource(...)

                    var deferred = $q.deferred();

                    // asynchronously retrieve a single item from wherever
                    // then resolve or reject the promise

                    return deferred.promise;
                },
                findAll: function (resourceConfig, params, options) {
                },
                create: function create(resourceConfig, attrs, options) {
                },
                update: function (resourceConfig, id, attrs, options) {
                },
                updateAll: function (resourceConfig, attrs, params, options) {
                },
                destroy: function (resourceConfig, id, options) {
                },
                destroyAll: function destroyAll(resourceConfig, params, options) {
                }
            };
        }];
    });
