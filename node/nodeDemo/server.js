var http = require('http');

//创建服务器
http.createServer(function(request,response){
	//发送http头部
	//HTTP 状态值：200 ：OK
	//内容类型 ：text/plain
	response.writeHead(200,{'Content-Type':'text/plain;charset=utf-8'});
	
	//发送相应数据“Hello World”
	//response.setEncoding('UTF8');
	response.end('你好！老表！');
	
}).listen(8888);

//终端打印如下信息
console.log('Server running at http://127.0.0.1:8888/');
