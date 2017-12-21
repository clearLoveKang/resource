/**
 * Created by DELL on 2017/5/18.
 * util.inspect(object,[showHidden],[depth],[colors])是一个将任意对象转换 为字符串的方法，通常用于调试和错误输出。它至少接受一个参数 object，即要转换的对象。
 */

var util = require('util');
function Person(){
    this.name = "康康beyond";
    this.toString = function(){
        return this.name;
    };

};

var obj = new Person();
console.log(util.inspect(obj));
console.log(util.inspect(obj,true,2,true));

//util.isArray()判断是否为数组
console.log(util.isArray([]));
console.log(util.isArray(new Array));
console.log(util.isArray({}));

//util.isRegExp(object)
//如果给定的参数 "object" 是一个正则表达式返回true，否则返回false。


//util.isDate(object)
//如果给定的参数 "object" 是一个日期返回true，否则返回false。


//util.isError(object)
//如果给定的参数 "object" 是一个错误对象返回true，否则返回false。

















