//通过connectin（链接）事件演示了EventEmitter 类的应用
var events = require('events');
var eventEmitter = new EventEmitter();

//监听器 #1
var listener1 = function(){
	console.log('监听器 listener1 执行。');
}
// 监听器 #2
var listener2 = function(){
	console.log('监听器 listener2 执行。');
}

//绑定 connection 事件  处理 listener1
eventEmitter.addListener('connection',listener1);
//绑定 connection 事件  处理 listener2
eventEmitter.on('connection',listener2);





