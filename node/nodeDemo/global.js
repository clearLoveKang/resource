/**
 * Created by DELL on 2017/5/18.
 * 全局变量
 */
//__filename 表示当前正在执行的脚本的文件名。它将输出文件所在位置的绝对路径，且和命令行参数所指定的文件名不一定相同。 如果在模块中，返回的值是模块文件的路径。
console.log(__filename);


//__dirname 表示当前执行脚本所在的目录。
console.log(__dirname);


//setTimeout(cb, ms) 全局函数在指定的毫秒(ms)数后执行指定函数(cb)。：setTimeout() 只执行一次指定函数。
//返回一个代表定时器的句柄值。
console.time("获取数据");
function sb(){

    console.log('你好老表')
    console.timeEnd('获取数据')

}
var oTime = setTimeout(sb,5000);

//清除定时器
clearTimeout(oTime);

//var oTime_1 = setInterval(sb,2000);

//输出到终端
process.stdout.write("Hello World!"+'\n');

//通过参数读取
process.argv.forEach(function(val,index,array){
    console.log(index + ':'+val);
});

//获取执行路径
console.log(process.execPath);
//平台信息
console.log(process.platform);
//s输出当前目录
console.log("当前目录"+process.cwd());
//输出当前版本
console.log("当前版本"+process.version);
//输出内存使用情况
console.info(process.memoryUsage());





























