var express=require("express");
var app=express();
var fs=require('fs');

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
app.get('/', function (req, res) {
   res.send("<html><head><title>TEST</title></head><body><h1>TEST</h1></body></html>");
}) 
var server = app.listen(8081, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("ADDR:http://%s:%s", host, port) 
})

