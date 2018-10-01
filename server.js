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
var xss=require('xss');
var crypto=require('crypto');

function ret(req,res,str){
   res.writeHead(200, {'Content-Type': 'text/html'});	
   res.write(str);		
   res.end();
}
var md;
var salt=auth.salt;

function md5(a){
md=crypto.createHash("md5");
md.update(salt+a);
return md.digest("hex");
}
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
app.get('/*\.*', function(req, res) {   
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
 'Location': '/login.html'
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
                		ret(req,res,"error");
				return console.error("db connnet err",err);
			}
			client.query("SELECT * FROM users WHERE username=$1",[xss(req.body.u)],function(err,result){
				if(err){
                    ret(req,res,"error");
					return console.error("db query err",err);
				}
				if(result.rows[0]==null){
					res.writeHead(200, {'Content-Type': 'text/html'});	
         			res.write('nouser');		
      				res.end();
				}else if(md5(req.body.p)==result.rows[0].password){
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
app.post('/passwd',function(req,res){
    if(req.session.u!=null&&req.body.u!=null&&req.body.p!=null&&req.body.u==req.session.u&&req.body.np!=null)
    {
        pool.connect(function(err,client,done){
            if(err){
                ret(req,res,'error');
                return console.error("db connnet err",err);
            }
            client.query("SELECT * FROM users WHERE username=$1",[xss(req.body.u)],function(err,result)
            {
                if(err)
                {
                    ret(req,res,"error");
                    return console.error("db query err",err);
                }
                if(result.rows[0]==null){
					res.writeHead(200, {'Content-Type': 'text/html'});	
         			res.write('nouser');		
                      res.end();
                }
                else if(md5(req.body.p)==result.rows[0].password){
                    client.query("UPDATE users SET password=$1 where username=$2",[md5(req.body.np),xss(req.body.u)],function(err,result){
                        if(err){
                            ret(req,res,"error");
                            return console.error("db update err",err);
                        }
                        ret(req,res,"ok");
                    });
                }
                else{
                    res.writeHead(200, {'Content-Type': 'text/html'});	
         			res.write('pwerr');		
      				res.end();
                }
            });
        });
    }
    else{
        ret(req,res,"cpwerr");
    }
});


app.post('/logout',function(req,res){
	req.session.u=null;
	res.writeHead(200, {'Content-Type': 'text/html'});	
    res.write('ok');		
    res.end();
});


app.post('/register', function (req, res) {
    if (req.session.u == null && req.body.u != null && req.body.p != null) {
        pool.connect(function (err, client, done) {
            if (err) {
                ret(req, res, "error");
                return console.error("db connect err", err);
            }
            client.query("SELECT * FROM users WHERE username=$1", [xss(req.body.u)], function (err, result) {
                if (result.rows[0] != null) {
                    ret(req, res, "exist");
                }
                else {
                    client.query("INSERT INTO users (username,password) VALUES($1,$2)", [xss(req.body.u), xss(req.body.p)], function (err, result) {
                        if (err) {
                            res.writeHead(200, { 'Content-Type': 'text/html' });
                            res.write('error');
                            res.end();
                            return console.error("db insert err", err);
                        }
                        res.writeHead(200, { 'Content-Type': 'text/html' });
                        res.write('ok');
                        res.end();
                    });
                }
            })

        });
    }
});

app.get('/info',function(req,res){
	ret(req,res,JSON.stringify({"username":req.session.u}));
});
