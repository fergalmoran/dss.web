/**
 * Main application file
 */

'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('express');
var session = require('express-session');
var config = require('./config/environment');
 
// Setup server
var app = express();
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');

var server = require('http').createServer(app);
var socketio = require('socket.io')(server, {
    serveClient: (config.env === 'production') ? false : true, //#TODO: invesigate why socket.io isn't being minified
    path: '/socket.io-client'
});
require('./config/socketio').scaffold((socketio));
require('./config/express')(app);
require('./routes')(app);


var mustacheExpress = require('mustache-express');
app.engine('mustache', mustacheExpress());

app.set('view engine', 'mustache');
app.set('views', __dirname + '/views');
app.use(cookieParser);
app.use(cookieSession({
    domain: 'www.deepsouthsounds.com',
    keys: ['key1', 'key2'],
}));

// Start server
server.listen(config.port, config.ip, function () {
    console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
});


// Expose app
exports = module.exports = app;
