/***
 * 这是一个测试与向导程序。 
 * 如果未开启mongoDB，则无需任何改变，可以运行一个nodejs的“hello world”小程序。
 * 如果开启了mongoDB，则去config.js文件按指引操作，可以运行获得一个通过mongoskin模块连接的nodejs+mongodb测试小程序。
 ***/
var http = require('http'),
    db = require('./config').db;
http.createServer(function(req, res){
    res.writeHead(200, {"content-type":"text/html;charset=utf8"});
    if(db){
         testMongoDB(res);
	}else{
         res.end("hello,cnode app engine!");	
	}
}).listen(80);
console.log("server started at port 80");
/*** 
 * mongoDB测试示例函数。如果已经开启mongoDB，请先去config.js修改填入数据库名称用户名和密码。
 ***/
function testMongoDB(res){
    //生成collection对象
    var testMongo = db.collection("testMongo");
    console.log("testMongo");
    //mongoDB存数据
    testMongo.save({title:"welcome",words:"欢迎来到CNAE的世界。这条欢迎语通过mongoDB发出。"}, function(err){
      if(err){
          console.log(err.toString());
          res.end(err.toString());
      }else{
          //查找数据库
          testMongo.findOne({title:"welcome"}, function(err, data){
              if(err){
                  console.log(err.toString());
                  res.end(err.toString());
              }else{  
                  res.end(data.words);
                  //删除数据
                  testMongo.remove({title:"welcome"},function(){});        
                             
              }
          });
      }
   });
}

