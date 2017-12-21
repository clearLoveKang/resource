var fs = require('fs');

//fs.stat('/KK_worke/KK_demo/node/fs.js',function(err,stats){
//	
//	console.log(stats.isFile());
//})

console.log("准备打开文件");
fs.stat('index.txt',function(err,stats){
	if (err) {
		return console.error(err);
	}
	console.log(stats);
	console.log('文件读取成功');
	//检查文件类型
	console.log('是否为文件(isFile)?'+stats.isFile());
	console.log('是否为目录文件(isDirectory)?'+stats.isDirectory());
	
	
	
	
});
