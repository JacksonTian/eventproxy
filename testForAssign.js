var EventProxy = require('./eventproxy.js').EventProxy;

var event = new EventProxy();

event.assign("1", "2", "3", "4", function(){
	console.log("trigger");
	for (var i=0; i!=4; ++i){
		console.log(arguments[i]);
	}
},"persistent");

console.log("first");
event.emit("1", 1);
event.emit("2", 2);
event.emit("3", 3);
event.emit("4", 4);
console.log("second");
event.emit("1", 1);
event.emit("2", 2);
event.emit("3", 3);
event.emit("4", 4);
console.log("third");
event.emit("1", 1);
event.emit("2", 2);
event.emit("3", 3);
event.emit("3", 3);
