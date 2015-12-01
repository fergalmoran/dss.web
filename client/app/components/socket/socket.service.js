/* global io */
'use strict';

angular.module('dssWebApp')
    .factory('SocketService', function (socketFactory, Session) {
        var ioSocket;

        var socket;

        return {
            socket: socket,
            registerHandler: function (message, cb) {
                console.log('Registering socket handler for: ' + message);
                cb = cb || angular.noop;
                if (socket) {
                    socket.on(message, function (data) {
                        cb(data);
                    });
                } else {
                    console.error("Unable to connect to socket service");
                }
            },
            removeHandler: function (event) {
                if (socket)
                    socket.removeAllListeners(event);
            },
            connectSocket: function (token) {
                console.log('Connecting socket: ' + token);
                ioSocket = io('', {
                    query: 'token=' + token,
                    path: '/socket.io-client'
                });
                socket = socketFactory({
                    ioSocket: ioSocket
                });
            }
        };
    });
