var fs=require('fs');
var url=require('url');
var express=require('express');
var session=require('express-session');
var app=express();
var bodyParser=require("body-parser"); 
var mime = require("./mime").types;
var path = require("path");
app.get('/files/*', function(req, res) {   
var pathname = url.parse(req.url).pathname;
   console.log("Request for " + pathname + " received.");
   fs.readFile(pathname.substr(1), function (err, data) {
      if (err) {
         console.log(err);
         fs.readFile("./files/404.html",function(err,dataa){
			 if(!err){
					res.writeHead(404, {'Content-Type': 'text/html'});
					res.write(dataa);	
					res.end();
				}
			});
      }else{	         
var ext = path.extname(pathname);
ext = ext ? ext.slice(1) : 'unknown';
var contentType = mime[ext] || "text/plain";
res.writeHead(200, {'Content-Type': contentType});
res.write(data);
res.end();
}
});
});
app.get('/', function(req, res) {   
console.log("Request for  / received.");
res.writeHead(302, {
 'Location': '/files/login.html'
});
res.end();
});
var server = app.listen(8081, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("8081");
});
