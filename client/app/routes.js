'use strict';
angular.module('dssWebApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('root', {
                url: '/',
                controller: function ($scope) {
                    $scope.$watch('currentUser', function () {
                        $state.reload();
                    });
                },
                resolve: {
                    mixes: function (MixModel) {
                        return MixModel.findAll({
                            waveform_generated: "True",
                            is_featured: "True"
                        });
                    }
                },
                views: {
                    'navbar': {
                        templateUrl: 'app/components/navbar/navbar.html',
                        controller: 'NavbarCtrl'
                    },
                    'pageheader': {
                        templateUrl: 'app/components/pageheader/pageheader.html',
                        controller: 'PageheaderCtrl'
                    },
                    'chatbar': {
                        templateUrl: 'app/components/chatbar/chatbar.html',
                        controller: 'ChatbarCtrl'
                    },
                    'footer': {
                        templateUrl: 'app/components/footer/footer.html',
                        controller: 'FooterCtrl'
                    },
                    'content@': {
                        templateUrl: 'app/views/mixes/mixes.html',
                        controller: 'MixesCtrl'
                    }
                }
            })
            .state('root.upload', {
                url: 'upload',
                resolve: {
                    mix: function () {
                        return null;
                    }
                },
                views: {
                    'content@': {
                        templateUrl: 'app/views/mixes/upload/upload.html',
                        controller: 'MixUploadCtrl'
                    }
                }
            })
            .state('root.mixes', {
                url: 'mixes?genres=:genre',
                resolve: {
                    mixes: function (MixModel, $stateParams) {
                        return MixModel.findAll({
                            waveform_generated: "True",
                            genres__slug: $stateParams.genre
                        });
                    }
                },
                views: {
                    'content@': {
                        templateUrl: 'app/views/mixes/mixes.html',
                        controller: 'MixesCtrl'
                    }
                }
            })
            .state('root.me', {
                url: 'me',
                resolve: {
                    user: function ($rootScope, UserModel) {
                        return UserModel.find($rootScope.currentUser.slug);
                    }
                },
                views: {
                    'content@': {
                        templateUrl: 'app/views/user/item/userItem.html',
                        controller: 'UserItemCtrl'
                    }
                }
            })
            .state('root.me.edit', {
                url: '/edit',
                resolve: {
                    user: function ($rootScope, UserModel) {
                        return UserModel.findAll({slug: $rootScope.currentUser.slug});
                    }
                },
                views: {
                    'content@': {
                        templateUrl: 'app/views/user/edit/userEdit.html',
                        controller: 'UserEditCtrl'
                    }
                }
            })
            .state('root.user', {
                url: ':user',
                resolve: {
                    user: function ($stateParams, UserModel) {
                        return UserModel.find($stateParams.user);
                    }
                },
                views: {
                    'content@': {
                        templateUrl: 'app/views/user/item/userItem.html',
                        controller: 'UserItemCtrl'
                    }
                }
            })
            .state('root.user.mix', {
                url: '/:mix',
                resolve: {
                    mix: function ($stateParams, MixModel) {
                        return MixModel.find($stateParams.mix);
                    },
                    comments: function ($stateParams, CommentModel) {
                        return CommentModel.findAll({
                            mix__slug: $stateParams.mix,
                            ordering: '-id'
                        });
                    }
                },
                views: {
                    'content@': {
                        templateUrl: 'app/views/mixes/item/mix.html',
                        controller: 'MixCtrl'
                    }
                }
            })
            .state('root.user.mix.edit', {
                url: '/edit',
                resolve: {
                    mix: function ($stateParams, MixModel) {
                        var ret = MixModel.find($stateParams.mix);
                        return ret;
                    }
                },
                views: {
                    'content@': {
                        templateUrl: 'app/views/mixes/upload/upload.html',
                        controller: 'MixUploadCtrl'
                    }
                }
            });
    });
