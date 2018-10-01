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
				type JSON,\
				isBaned INT,\
				password VARCHAR(256)\
				);\n\
				INSERT INTO users (username,password,type) VALUES (\'admin\',\''+pw+'\',\'{"admin":true,"su":true}\');', function(err, result) {
    done();
    if(err) {
      return console.error('queryerr', err);
    }
	if(result.rows!=null)
    console.log(result.rows[0].out);
  });
  client.query('DROP TABLE IF EXISTS topic;\n\
  CREATE TABLE topic(\
  title VARCHAR(30),\
  content VARCHAR(50000),\
  author VARCHAR(128),\
  time BIGINT,\
  lon INT,\
  lat INT,\
  alt INT,\
  t_ip VARCHAR(64));',function(err,results){
    if(err){
      done();
      return console.error('queryerr',err);
    }
    else{
      console.log('Create topic successfully');
    }
  });
});
console.log("DB init comp! username=admin pw="+pw)


