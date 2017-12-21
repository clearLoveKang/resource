var fs = require('fs');

console.log("准备写入文件")
fs.writeFile('index.txt','大哥！我错了，是嫂子自愿的！',function(err){
	if (err) {
		return console.log(err)
	}
	console.log("写入成功")
	console.log('-------------分割线----------');
	console.log('读取写入数据')
	fs.readFile('index.txt',function(err,data){
		if (err) {
			return console.error(err)
		}
		console.log("异步读取文件"+data.toString())
		
		
	})
	
})
