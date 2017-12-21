//Express 提供了内置的中间件 express.static 来设置静态文件

var express = require('express');

var app = express()

app.use(express.static('public'));

app.get('/',function(req,res){
	res.send('Hello World')
})

var server = app.listen(8081,function(){
	var host = server.address().address
	var port = server.address().port
	console.log("应用实例，访问地址为 http://%s:%s", host, port)
})
