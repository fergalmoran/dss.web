'use strict';

module.exports = {
    // MongoDB connection options
    mongo: {
        uri: 'mongodb://localhost/dssweb-dev'
    },

    seedDB: true,
    redisHost: 'localhost',
    apiUrl: 'http://ext-test.deepsouthsounds.com:8001',
    podcastUrl: 'http://ext-test.deepsouthsounds.com:8001/podcasts',
    //apiUrl: 'http://localhost:8001',
    radioUrl: 'http://localhost:8000'
};
