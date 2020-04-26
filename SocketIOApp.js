
var io = require('socket.io')();
var Authentication_Mid=require('./Middlewares/Authentication_Mid.js');
var uuid = require('uuid');
var socketConfiguration=require('./PKG.SocketControllers/Configuration');
var jwt = require('jsonwebtoken');

const SecurityManager = require('./PKG.SDK.Packages/PKG.SecurityManager/index');

//Authenticatie the user.
var AsUser = io.of('/AsUser').use(Authentication_Mid);
//Authenticatie the user.
var AsAdmin = io.of('/AsAdmin').use(Authentication_Mid);

//============================================================================================//
//=================================  Actual Implementation  ==================================//
//============================================================================================//

io.on('connection', function(socket){
	//socket.disconnect();
})

AsUser.on('connection', function (socket) {
	
	jwt.verify(socket.request._query['token'], 'This is the password used for the key that will be used to sign the tokens. The server signing password needs to be at least 16 chars and should be stored safely, not in a json file as here. This is just an example. Use for example user-secrets or azure key vault.', function(err, verifiedJwt) {
		if(err){
			socket.disconnect();
		}else{
			socket._id=verifiedJwt.Id;
			socketConfiguration.JoinInUserGroup(socket,verifiedJwt.Id);
		}
	});


	socket.on('disconnect',socketConfiguration.DisconnectRoute);
	socket.on('CtoS',function(message){
		message._id=socket._id;
		socketConfiguration.ManageUserRoute(socket,io,message);
	});
});


AsAdmin.on('connection', function (socket) {

	SecurityManager.verifyToken(socket.request._query['Token'],function(err,verifiedJwt){
		if(err){
			console.log(err);
		}else{
			
			socket._id=verifiedJwt.body.Id;
			
			socket.emit('StoA',socket._id);
			//TODO: Handle the user is admin or not.
		}
	});

	console.log('Admin connected.');

	socket.on('disconnect',socketConfiguration.DisconnectRoute);

	socket.on('AtoS',function(message){

		console.log(message);
		socket.emit('StoA',socket._id);

		//message.data._id=socket._id;
		//socketConfiguration.ManageAdminRoute(socket,io,message);
	});
});


//============================================================================================//
//=================================  Actual Implementation  ==================================//
//============================================================================================//
	
module.exports = io;