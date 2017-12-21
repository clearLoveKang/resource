//删除文件

var fs = require('fs');

console.log("准备删除文件01")
fs.unlink('index_1.txt',function(err){
	if (err) {
		return console.error(err);
	}
	
	console.log('删除文件成功02');
	
})
