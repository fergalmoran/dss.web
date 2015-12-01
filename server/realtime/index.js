'use strict';

var express = require('express');
var router = express.Router();
var activity = require('./activity.socket');

router.get('/', function (req, res) {
    activity.send(req.query['target'], req.query['data']);
    res.send('Hello Sailor');
});

module.exports = router;

