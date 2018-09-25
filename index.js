var express=require("express");
var app=express();

app.get('/', function (req, res) {
   res.send("<html><head><title>TEST</title></head><body><h1>TEST</h1></body></html>");
})
 
var server = app.listen(8081, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("ADDR:http://%s:%s", host, port) 
})

