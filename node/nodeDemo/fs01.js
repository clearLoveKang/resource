var fs = require('fs');

console.log("准备打开文件");

fs.open('index.txt','r+',function(err,fd){
	if (err) {
		return console.error(err);
	}
	console.log('文件打开成功')
})
//F:\KK_worke\KK_demo\node\global.js
