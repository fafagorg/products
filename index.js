'use strict';
const server = require('./server');
const env = process.env.NODE_ENV ? process.env.NODE_ENV : 'production';

server.deploy(env).catch(err => { console.log(err); });
