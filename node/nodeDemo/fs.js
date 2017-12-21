var fs = require('fs');

//异步读取
fs.readFile('index.txt',function(err,data){
	if (err) {
		return console.error(err)
	}
	console.log("异步读取:"+data.toString());
	
});

//同步读取数据
var data = fs.readFileSync('index.txt');
console.log("同步数据:"+data.toString());

console.log("程序执行完毕")



