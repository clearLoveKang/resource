/**
 * Created by DELL on 2017/5/12.
 */
var fs = require('fs');
var zlib = require('zlib');

//压缩index文件为index.txt.gz
fs.createReadStream('index.txt')
    .pipe(zlib.createGzip())
    .pipe(fs.createWriteStream('index.txt.gz'));
console.info('蛋蛋执行完毕');
