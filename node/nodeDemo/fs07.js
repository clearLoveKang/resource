//创建目录
var fs = require('fs');

//console.log("创建目录F:\KK_worke\KK_demo\node/test/")
//fs.mkdir('F:/KK_worke/KK_demo/node/test/',function(err){
//	if (err) {
//		return console.error(err)
//	}
//	console.log("目录创建成功")
//	
//})

//读取目录
//console.log('查看、test目录');
//fs.readdir('/test/',function(err,files){
//	if (err) {
//		return console.error(err)
//	}
//	files.forEach(function(file){
//		console.log(file);
//	})
//	
//})

//删除目录
console.log('开始删除目录F:/KK_worke/KK_demo/node/test/')
fs.rmdir('F:/KK_worke/KK_demo/node/test/',function(err){
	if (err) {
		return console.error(err)
	}
	console.log('读取F:/KK_worke/KK_demo/node/test/目录')
	fs.readdir('F:/KK_worke/KK_demo/node/test/',function(err,files){
		if (err) {
			return console.error(err)
		}
		files.forEach(function(file){
			console.log(file);
		})
		
		
	});
})

