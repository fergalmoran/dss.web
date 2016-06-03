/* global io */
'use strict';

angular.module('dssWebApp')
    .factory('SocketService', function (socketFactory, Session) {
        var ioSocket = io('', {
            query: 'token=' + Session.getSession(),
            path: '/socket.io-client'
        });
        var socket = socketFactory({
            ioSocket: ioSocket
        });
        socket.forward('error');
        return socket;
    });
