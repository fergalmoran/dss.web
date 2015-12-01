'use strict';

angular.module('dssWebApp')
    .controller('ChatbarCtrl', function ($scope, $rootScope, $http, SocketService, SERVER_CONFIG, AUTH_EVENTS) {
        console.log('ChatbarCtrl', $scope);
        $scope.messages = [];
        $scope.chatMessage = '';

        function _registerChatHandler() {
            console.log('Registering chat handler');
            SocketService.registerHandler('chat', function (message) {
                var data = JSON.parse(message);
                console.log("Received chat message: " + data);
                $scope.$apply(function () {
                    $scope.messages.push(data);
                    $scope.chatMessage = '';
                });
            });
        }

        if ($rootScope.currentUser) {
            _registerChatHandler();
        } else {
            $rootScope.$on(AUTH_EVENTS.loginSuccess, function (data) {
                _registerChatHandler();
            });
        }

        $scope.postMessage = function () {
            $http.post(SERVER_CONFIG.apiUrl + '/_chat/', {
                user: 'Someone',
                message: $scope.chatMessage
            });
        };

    });
