/**
 * Created by DELL on 2017/5/12.
 */
var fs = require('fs');
//创建一个可读流
var readerStream = fs.createReadStream('index.txt');

//创建一个可写流
var writerStream = fs.createWriteStream('output.txt');

//管道读写操作
//读取文件input内容，写入到output中
readerStream.pipe(writerStream);
console.log('蛋蛋执行完毕')