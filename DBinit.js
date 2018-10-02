var pg = require('pg');
var auth=require("./auth.json");
var config = {
    user:auth.dbuser,
    database:auth.db,
    password:auth.dbpw,
    port:5432,
    max:20,
    idleTimeoutMillis:3000,
}
var pool = new pg.Pool(config);
crypto=require("crypto");
var md5=crypto.createHash("md5");
var salt=auth.salt
md5.update(salt+"123456");
var pw=md5.digest("hex");
pool.connect(function(err, client, done) {
  if(err) {
    return console.error('db connect err', err);
  }
  client.query('DROP TABLE IF EXISTS users;\n\
				CREATE TABLE users (\
				uid bigserial PRIMARY KEY,\
				username VARCHAR(128),\
				nick VARCHAR(128),\
				email VARCHAR(256),\
				register_time BIGINT,\
				register_ip VARCHAR(64),\
				last_login_time BIGINT,\
				phone VARCHAR(20),\
				moto TEXT,\
				type VARCHAR(15),\
				isBaned VARCHAR(10),\
				password VARCHAR(256)\
				);\n\
				INSERT INTO users (username,password,type) VALUES (\'admin\',\''+pw+'\',\'su\');', function(err, result) {
    done();
    if(err) {
      return console.error('queryerr', err);
    }
	if(result.rows!=null)
    console.log(result.rows[0].out);
  });
  client.query("DROP TABLE IF EXISTS posts;\n\
  CREATE TABLE posts(\
  title TEXT,\
  content TEXT,\
  author VARCHAR(128),\
  time BIGINT,\
  lon DOUBLE PRECISION,\
  lat DOUBLE PRECISION,\
  alt DOUBLE PRECISION,\
  pos TEXT,\
  t_ip VARCHAR(64),\
  status VARCHAR(10));\
  INSERT INTO posts (title,content,author,time,lon,lat,alt,pos,t_ip,status) VALUES ('到此一游','哈哈哈哈','admin',1538404667887,132,28,0,'新华中学','127.0.0.1','display');INSERT INTO posts (title,content,author,time,lon,lat,alt,pos,t_ip,status) VALUES ('到此一游','哈哈哈哈','admin',1538404667887,132,28,0,'新华中学','127.0.0.1','display');",function(err,results){
    if(err){
      done();
      return console.error('queryerr',err);
    }
    else{
      console.log('Create posts successfully');
    }
  });
});
console.log("DB init comp! username=admin pw="+pw)


