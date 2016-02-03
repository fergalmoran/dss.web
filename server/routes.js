'use strict';
var errors = require('./components/errors');
var http = require('http');
var url = require('url');
function _parseUrl(u) {
    var parts = url.parse(u, true, true);

    var path = parts.pathname.split('/').filter(function (arg) {
        return arg;
    });
    if (path.length == 2) {
        //probably a mix, reconstruct url and return
        return parts.protocol + "//" + parts.host + "/mix/" + path[1] + "/";
    }
    return u;
}

function isHttps(u){
    var parts = url.parse(u, true, true);
    return parts.protocol === 'https';
}

module.exports = function (app) {

    app.route('/config')
        .get(function (req, res) {
            console.log('Sending config');
            res.send(JSON.stringify({
                apiUrl: app.get('apiUrl'),
                radioUrl: app.get('radioUrl')
            }));
        });

    app.use('/rt', require('./realtime'));

    app.route('/:url(api|auth|components|app|bower_components|assets)/*')
        .get(errors[404]);

    app.route('/*')
        .get(function (req, res) {
            if (req.headers['user-agent'].indexOf('facebookexternalhit') > -1) {
                var url = _parseUrl((app.get('apiUrl') + req.path + '/').replace(/([^:]\/)\/+/g, "$1"));
                console.log('Api url: ' + url);
                var fun = isHttps(url) ? https : http;
                fun.get(url, function (api_res) {
                    var body = '';
                    api_res.on('data', function (chunk) {
                        body += chunk;
                    });
                    api_res.on('end', function () {
                        res.render('social/facebook/mix', JSON.parse(body));
                    });
                }).on('error', function (e) {
                    console.log("Got error: " + e.message);
                });
            } else {
                res.sendfile(app.get('appPath') + '/index.html');
            }
        });
};
