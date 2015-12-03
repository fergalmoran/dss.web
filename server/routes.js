'use strict';
var errors = require('./components/errors');
var http = require('http');

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
                var url = (app.get('apiUrl') + req.path + '/').replace(/([^:]\/)\/+/g, "$1");
                console.log('Api url: ' + url);
                http.get(url, function (api_res) {
                    var body = '';
                    api_res.on('data', function(chunk) {
                        body += chunk;
                    });
                    api_res.on('end', function() {
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
