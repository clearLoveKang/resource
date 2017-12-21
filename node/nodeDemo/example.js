/**
 * Created by DELL on 2017/5/8.
 */
var http = require('http');

var hostname = '127.0.0.1';
var port = 8888;

//const server = http.createServer((req, res) => {
//    res.statusCode = 200;
//res.setHeader('Content-Type', 'text/plain');
//res.end('Hello World\n');
//});
//
//server.listen(port, hostname, () => {
//    console.log('服务器运行在 http://${hostname}:${port}/');
//});
var server = http.createServer(function(request,response){
    response.statusCode = 200;
    response.setHeader('Content-Type','text/plain');
    response.end('Hello World\n');
});
server.listen(function(port,hostname){

    console.log('服务器运行在 http://'+hostname+":"+port+'/');

});