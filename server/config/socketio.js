'use strict';

var config = require('./environment');
var Map = require("collections/map");
var sessions = new Map();
var cookieReader = require('cookie');
var redis = require('redis');
var cookieParser = require('cookie-parser');
var session = require('cookie-session');

var sub = redis.createClient(6379, config.redisHost, {});
sub.subscribe('site:broadcast');
sub.subscribe('site:radio_changed');
sub.subscribe('user:process');
sub.subscribe('user:message');
sub.subscribe('chat');

sub.on("error", function (err) {
    console.error("Error connecting to redis", err);
});

sub.on('message', function (channel, message) {
    var msg = JSON.parse(message);
    if (channel === 'chat') {
        sessions.forEach(function (socket) {
            socket.emit(channel, message);
        });
    } else if (channel === 'user:process') {
        onUserMessage(channel, msg);
    } else if (channel === 'user:message') {
        onUserMessage(channel, msg);
    } else {
        sessions.forEach(function (socket) {
            socket.emit(channel, message);
        });
    }
});

// When the user connects.. perform this
function onConnect(socket) {
    socket.on('info', function (data) {
        console.info('[%s] %s', socket.address, JSON.stringify(data, null, 2));
    });
    if (!sessions.has(socket.handshake.query.token)) {
        sessions.set(socket.handshake.query.token, socket);
    }

    require('../realtime/activity.socket.js').register(socket);
}
function onDisconnect(socket) {
    if (sessions.has(socket.handshake.query.token)) {
        sessions.delete(socket.handshake.query.token);
    }
    console.info('[%s] DISCONNECTED', socket.address);
}
function onUserMessage(channel, message) {
    if (sessions.has(message.session)) {
        var socket = sessions.get(message.session);
        socket.emit(channel, message.message);
    }
}
module.exports = {
    sessions: sessions,
    scaffold: function (socketio) {
        socketio.set('authorization', function (data, accept) {
            if (data.headers.cookie) {
                data.cookie = cookieReader.parse(data.headers.cookie);
                return accept(null, true);
            } else {
                return accept('error', false);
            }
        });
        socketio.on('connection', function (socket) {
            var session = socket.handshake.query.token || "";

            socket.address = socket.handshake.address !== null ?
            socket.handshake.address.address + ':' + socket.handshake.address.port :
                process.env.DOMAIN;

            socket.connectedAt = new Date();

            // Call onDisconnect.
            socket.on('disconnect', function () {
                onDisconnect(socket);

            });

            // Call onConnect.
            onConnect(socket);

            if (session) {
                if (!sessions.has(session)) {
                    sessions.delete(session);
                }
                sessions.set(session, socket);
            }
            console.info('[%s] CONNECTED', socket.address);
        })
    }, isMember: function (session) {
        return sessions.has(session);
    }
};
