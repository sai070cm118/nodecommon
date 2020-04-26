var session = require("express-session");
var MongoStore=require('connect-mongo')(session);
const mongoose = require('mongoose');


var URI_H={
	getApiURI:function(){
		var env = process.argv[2] || 'dev';
		switch (env) {
			case 'dev':return 'http://127.0.0.1:3002';
			case 'prod':return 'http://127.0.0.1:3002';
			case 'home':return 'http://127.0.0.1:3002';
		}
	},
	getNotificationURI:function(){
		var env = process.argv[2] || 'dev';
		switch (env) {
			case 'dev':return 'http://127.0.0.1:3002';
			case 'prod':return 'http://127.0.0.1:3002';
			case 'home':return 'http://127.0.0.1:3002';
		}
	},
	getApplicationURI:function(){
		var env = process.argv[2] || 'dev';
		switch (env) {
			case 'dev':return 'http://127.0.0.1:3003';
			case 'prod':return 'http://127.0.0.1:3003';
			case 'home':return 'http://127.0.0.1:3003';
		}
	},
	getSocketURI:function(){
		var env = process.argv[2] || 'dev';
		switch (env) {
			case 'dev':return 'http://127.0.0.1:3004';
			case 'prod':return 'http://127.0.0.1:3004';
			case 'home':return 'http://127.0.0.1:3004';
		}
	},
	getMongoDatabaseURI:function(){
		var env = process.argv[2] || 'dev';
		switch (env) {
			case 'dev':return 'mongodb://127.0.0.1:27017/gamechat';
			case 'prod':return 'mongodb://sairam:sairam0168@ds031183.mongolab.com:31183/gamechat';
			case 'home':return 'mongodb://127.0.0.1:27017/gamechat';
		}
		console.log(env);
	},
	
	getSessionSecret:'sairam0168',
	
	getExpressSessionURI:function(){
		var mongoURI=this.getMongoDatabaseURI();
		const connection = mongoose.createConnection(mongoURI);
		
		connection.on('connected', function () {  
		  console.log('Mongoose default connection open to ' + mongoURI);
		}); 

		// If the connection throws an error
		connection.on('error',function (err) {  
		  console.log('Mongoose default connection error: ' + err);
		}); 

		// When the connection is disconnected
		connection.on('disconnected', function () {  
		  console.log('Mongoose default connection disconnected'); 
		});
		connection.on('connecting', function(){
			logger.info("trying to establish a connection to mongo");
		});
		// If the Node process ends, close the Mongoose connection 
		process.on('SIGINT', function() {  
		  connection.close(function () { 
			console.log('Mongoose default connection disconnected through app termination'); 
			process.exit(0); 
		  }); 
		}); 
		
		
		/*6days*/
		return {secret: this.getSessionSecret, saveUninitialized:true,resave:true, name:'AmILST',cookie: { maxAge: 518400000 },store:new MongoStore({mongooseConnection:connection})}
	},
	
	getSocketSessionURI:function(){
		var mongoURI=this.getMongoDatabaseURI();
		const connection = mongoose.createConnection(mongoURI);
		
		connection.on('connected', function () {  
		  console.log('Mongoose default connection open to ' + mongoURI);
		}); 

		// If the connection throws an error
		connection.on('error',function (err) {  
		  console.log('Mongoose default connection error: ' + err);
		}); 

		// When the connection is disconnected
		connection.on('disconnected', function () {  
		  console.log('Mongoose default connection disconnected'); 
		});
		connection.on('connecting', function(){
			logger.info("trying to establish a connection to mongo");
		});
		// If the Node process ends, close the Mongoose connection 
		process.on('SIGINT', function() {  
		  connection.close(function () { 
			console.log('Mongoose default connection disconnected through app termination'); 
			process.exit(0); 
		  }); 
		}); 
		
		/*6days*/
		return {secret: this.getSessionSecret,saveUninitialized:false,name:'AmILST',resave:true, cookie: { maxAge: 518400000 },store:new MongoStore({mongooseConnection:connection})}
	},
	
	
	getRedisSocketURI:function(){
		var env = process.argv[2] || 'dev';
		switch (env) {
			case 'dev':return 'http://localhost:3001';
			case 'prod':return 'http://localhost:3001';
			case 'home':return 'http://localhost:3001';
		}
	}
	
}

exports.URI_H=URI_H;