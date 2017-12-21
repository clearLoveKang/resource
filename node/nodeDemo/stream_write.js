/**
 * Created by DELL on 2017/5/12.
 */
var fs = require('fs');
var data = '恕在下直言，在座的各位都是垃圾';

//创建一个可以写入的流，写入到文件index。txt中
var writerStream = fs.createWriteStream('index.txt');

//使用UTF8编码写入数据
writerStream.write(data,'UTF8');
//标记文件末尾
writerStream.end();

//处理流事件-->data end error
writerStream.on('finish',function(){
    console.log('写入完成')
});
writerStream.on('error',function(err){
    console.log(err.stack)
});

console.log('程序执行完毕')