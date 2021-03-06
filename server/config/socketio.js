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
sub.subscribe('user:broadcast');
sub.subscribe('chat');

sub.on("error", function (err) {
    //console.error("Error connecting to redis", err);
});

sub.on('message', function (channel, message) {
    console.info('Message received: %s - %s', channel, message);
    var msg = JSON.parse(message);
    if (channel === 'chat') {
        sessions.forEach(function (socket) {
            socket.emit(channel, message);
        });
    } else if (channel === 'user:broadcast') {
        console.info('User broadcast message received');
        onUserMessage(channel, msg);
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
    console.info('OnConnect - Address(%s) : Token(%s)', socket.address, socket.handshake.query.token);
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
    console.info('Message for session: %s', message.session);
    if (sessions.has(message.session)) {
        console.info('Session found');
        var socket = sessions.get(message.session);
        console.info('Sending %s to %s', message.message, channel);
        socket.emit(channel, message.message);
    }else{
        console.error('Session not found');
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
        })
    }, isMember: function (session) {
        return sessions.has(session);
    }
};
