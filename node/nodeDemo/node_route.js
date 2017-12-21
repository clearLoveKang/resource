/**
 * Created by DELL on 2017/5/18.
 * route02
 */
var http  = require('http');
var url = require('url');

function start(route){
    function onRequest(request,response){
        var pathname = url.parse(request.url).pathname;
        console.log('Request for '+ pathname+'received.');

        route(pathname);

        response.writeHead(200,{'Content-Type':'text/plain'});
        response.write('你好！老表');
        response.end();
    }

    http.createServer(onRequest).listen(8888);
    console.log('服务已经开始工作');
}
exports.start = start;