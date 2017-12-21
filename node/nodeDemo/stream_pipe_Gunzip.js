/**
 * Created by DELL on 2017/5/12.
 */
var fs = require('fs');
var zlib = require('zlib');

//解压所文件index.txt.gz为index_1.txt
fs.createReadStream('index.txt.gz')
    .pipe(zlib.createGunzip())
    .pipe(fs.createWriteStream('index_1.txt'));
console.info('压缩文件解压完成');