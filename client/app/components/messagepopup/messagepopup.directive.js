'use strict';

angular.module('dssWebApp')
    .directive('dssMessagePopup', function ($rootScope, logger, SocketService, MessageModel, CHAT_EVENTS) {

        return {
            templateUrl: 'app/components/messagepopup/messagepopup.html',
            restrict: 'A',
            link: function (scope, elem, attrs) {
                scope.vm = {
                    messages: []
                };
                function _loadMessages() {
                    MessageModel.findAll({
                        to_user: scope.vm.chattingWith.slug,
                        type: 'chat'
                    }).then(function (results) {
                        scope.vm.messages = results;
                        scope.$apply();
                        $(".panel-body", elem).scrollTop($(".panel-body", elem)[0].scrollHeight);
                    });
                }
                $rootScope.$on(CHAT_EVENTS.startChat, function (args, user) {
                    scope.vm.chattingWith = user;
                    _loadMessages();
                    SocketService.on('user:message', function (message) {
                        console.log("You got a message", message);
                        if (message.from_user === scope.vm.chattingWith.slug) {
                            MessageModel.ejectAll({
                                to_user: scope.vm.chattingWith.slug,
                                type: 'chat'
                            });
                            _loadMessages();
                        }
                    });
                });
                scope.closeChat = function () {
                    $rootScope.isMessaging = false;
                    SocketService.removeHandler('user:message');
                };
                scope.sendMessage = function () {
                    console.log("Sending message", scope.message);
                    MessageModel.create({
                        body: scope.message,
                        to_user: scope.vm.chattingWith.slug
                    }).then(function (result) {
                        scope.vm.messages.push(result);
                        scope.message = "";
                        $(".panel-body", elem).scrollTop($(".panel-body", elem)[0].scrollHeight);
                    });
                };
            }
        }
    });
