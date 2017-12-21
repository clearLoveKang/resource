/**
 * Created by DELL on 2017/5/12.
 * exports require node 模块
 */

var hello = require('./hello');
//hello.world();
var Hello = new hello();
Hello.setName('郭二蛋');
Hello.getName();