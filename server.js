var fs=require('fs');
var url=require('url');
var express=require('express');
var session=require('express-session');
var app=express();
var bodyParser=require("body-parser"); 
var mime = require("./mime").types;
var path = require("path");
var pg = require('pg');
var auth=require("./auth.json");
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
app.use(session({
    store: new RedisStore(),
    secret: auth.sessionsecret
}));
app.use(bodyParser());
var config = {
    user:auth.dbuser,
    database:auth.db,
    password:auth.dbpw,
    port:5432,
    max:20,
    idleTimeoutMillis:3000,
}
var pool = new pg.Pool(config);
app.get('/*', function(req, res) {   
var pathname = url.parse(req.url).pathname;
   console.log("Request for " + pathname + " received.");
   fs.readFile("./statics/"+pathname.substr(1), function (err, data) {
      if (err) {
         console.log(err);
         fs.readFile("./statics/404.html",function(err,dataa){
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
 'Location': '/statics/login.html'
});
res.end();
});
var server = app.listen(8081, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log("8081");
});

app.post('/login',function(req,res){
	if(req.session.u==null&&req.body.u!=null&&req.body.p!=null){
		pool.connect(function(err, client, done){
			if(err){
				return console.error("db connnet err",err);
			}
			client.query("SELECT * FROM users WHERE username=$1",[req.body.u],function(err,result){
				if(err){
					return console.error("db query err",err);
				}
				if(result.rows[0]==null){
					res.writeHead(200, {'Content-Type': 'text/html'});	
         			res.write('nouser');		
      				res.end();
				}else if(req.body.p==result.rows[0].password){
					req.session.u=req.body.u;
					req.session.user={'username':req.body.u};
         			res.writeHead(200, {'Content-Type': 'text/html'});	
         			res.write('ok');		
      				res.end();
				}else{
         			res.writeHead(200, {'Content-Type': 'text/html'});	
         			res.write('pwerr');		
      				res.end();
				}
			});
		});
	}else{
         res.writeHead(200, {'Content-Type': 'text/html'});	
         res.write('logined');		
      	res.end();
	}
		
});
				


