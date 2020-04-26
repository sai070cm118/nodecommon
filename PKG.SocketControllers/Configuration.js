

const SocketRouter = require('../Router');

function StoC(socket,io,Config){
	if(Config.Type=='MySelf'){
		socket.emit('StoC',Config.Message);
	}
	else if(Config.Type=='Room'){
		io.of('/AsUser').to(Config.RoomId).emit('StoC', Config.Message);
	}
	else if(Config.Type=='BroadCast'){
		io.of('/AsUser').emit('StoC', Config.Message);
	}
	else{
		console.log('No response to user.');
	}
}

function StoA(socket,io,Configs,Message){
	
	Configs.forEach(Config => {

		if(Config.Type=='Room'){
			io.of('/AsUser').to(Config.RoomId).emit('StoC', Message);
		}
		else if(Config.Type=='BroadCast'){
			io.of('/AsUser').emit('StoC', Message);
		}
		else{
			console.log('No response to user.');
		}
	});
}

function JoinInUserGroup(socket,RoomId){
	socket.join(RoomId, () => {
		socket.emit('StoC','User Joined in Room: ' +RoomId); 
	});
}


function ManageUserRoute(socket,io,message){
    SocketRouter(message,socket._id,function(response){
		StoC(socket,io,response);
    });	
}

function ManageAdminRoute(socket,io,message){
	SocketRouter(message,socket._id,function(response){
		response.forEach(Output => {
			StoC(socket,io,Output.Config,Output.Message);
		});
    });	
}

function DisconnectRoute(data){
    console.log('User disconnected.');		
}


module.exports={
    StoC:StoC,
    StoA:StoA,
    JoinInUserGroup:JoinInUserGroup,
    ManageUserRoute:ManageUserRoute,
    ManageAdminRoute:ManageAdminRoute,
    DisconnectRoute:DisconnectRoute
};