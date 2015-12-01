'use strict'
angular.module('dssWebApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('root', {
                url: '',
                abstract: true,
                views: {
                    'navbar': {
                        templateUrl: 'app/components/navbar/navbar.html',
                        controller: 'NavbarCtrl'
                    },
                    'pageheader': {
                        templateUrl: 'app/components/pageheader/pageheader.html',
                        controller: 'PageheaderCtrl'
                    },
                    'sidebar': {
                        templateUrl: 'app/components/sidebar/sidebar.html',
                        controller: 'SidebarCtrl'
                    },
                    'chatbar': {
                        templateUrl: 'app/components/chatbar/chatbar.html',
                        controller: 'ChatbarCtrl'
                    },
                    'footer': {
                        templateUrl: 'app/components/footer/footer.html',
                        controller: 'FooterCtrl'
                    }
                }
            });
    });
