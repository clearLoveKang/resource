/**
 * Created by DELL on 2017/5/18.
 * util 是一个Node.js 核心模块，提供常用函数的集合，用于弥补核心JavaScript 的功能 过于精简的不足。
 */
var util = require('util');
function Base(){
    this.name = '蛋蛋';
    this.base = 1992;
    this.sayHello = function(){
        console.log('Hello'+ this.name);
    }
};
    Base.prototype.showName = function(){
        console.log(this.name);
    };

    function Sub(){
        this.name = '张宇';

    };

    util.inherits(Sub,Base);
    var objBase = new Base();
    objBase.showName();
    objBase.sayHello();
    console.log(objBase);
    var objSub = new Sub();
    objSub.showName();
//objSub.sayHello();objSub只继承构造函数原型中的属性
    console.log(objSub);


