/**
 * Created by DELL on 2017/5/18.
 * route01
 */
var server = require('./node_route');
var router = require('./route');
server.start(router.route);