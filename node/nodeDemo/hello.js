/**
 * Created by DELL on 2017/5/12.
 */
//exports.world = function(){
//    console.info('蛋蛋是个菜鸡')
//}

function hello(){
    var name;
    this.setName = function(inname){
        name = inname;
    }
    this.getName = function(){
        console.info("看看傻逼是谁，就是："+name)
    }

}
module.exports = hello;