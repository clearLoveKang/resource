var fs = require('fs');

//阻塞代码
	//var data = fs.readFileSync('index.txt');
	//console.log(data.toString());
	//console.log('程序运行结束')
//非阻塞代码
fs.readFile('index.txt',function(err,data){
	if(err) console.log(err);
	console.log(data.toString())
});
console.log('程序运行结束')