angular.module('dssWebApp')
    .factory('UserModel', function (DS) {
        return DS.defineResource({
            name: 'user',
            idAttribute: 'slug',
            relations: {
                hasMany: {
                    mix: {
                        localField: 'mixes',
                        foreignKey: 'user__slug'
                    }
                }
            }
        });
    });
