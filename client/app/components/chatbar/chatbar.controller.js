'use strict';

angular.module('dssWebApp')
    .controller('ChatbarCtrl', function ($scope, $rootScope, $http, SocketService, SERVER_CONFIG, AUTH_EVENTS, toastr) {
        console.log('ChatbarCtrl', $scope);
        $scope.messages = [];
        $scope.chatMessage = '';

        function _registerChatHandler() {
            console.log('Registering chat handler');
            SocketService.on('chat', function (message) {
                var data = JSON.parse(message);
                console.log("Received chat message: " + data);
                toastr.success(data);
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
                user: '2',
                message: $scope.chatMessage
            });
        };

    });
