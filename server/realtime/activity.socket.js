'use strict';

var socket;
exports.register = function (sock) {
    socket = sock;
};

exports.send = function (target, data) {
    //filter messages not for us
    socket.emit('site:broadcast', data);
};
