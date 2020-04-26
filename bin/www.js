
var http = require('http');
var AppConfig=require('../AppConfig.json');
var proxyService = require('../PKG.SDK.Packages/PKG.ProxyService/index');
var globals = require('../Globals');


if (require.main === module) {

  proxyService.POST(AppConfig.KingsonsApi+'Session/LoginAsEmployee',{ Email:'Teja@gmail.com', Password:'Teja0168' },{ 'AppKey':AppConfig.AppKey },function(err, response){

    if(!err){
      
      globals.setSession(response.Result);

      proxyService.POST(AppConfig.KingsonsApi+'AppManager/GetAppInformation',{},{'AppKey':AppConfig.AppKey, Authorization : 'bearer '+response.Result.AuthToken },function(err2, response2){
        if(!err2){
          globals.setGlobals(response2);
          boot();
        }

      })
    }
    else{
      //console.log(err);
    }

  });


} else {
  console.info('Running app as a module');
  exports.boot = boot;
  exports.shutdown = shutdown;
  exports.port = app.get('port');
}




/**
 * Listen on provided port, on all network interfaces.
 */

 var server ;

 var boot = function () {
    
  var app = require('../app');
  var io = require('../SocketIOApp');
  /**
   * Get port from environment and store in Express.
   */

  var port = normalizePort( process.env.PORT || AppConfig.PORT);
  app.set('port', port);

  /**
   * Create HTTP server.
   */

  
  server = http.createServer(app);
  io.attach(server);

  server.listen(port, function(){
	server.on('error', onError);
	server.on('listening', onListening);
    console.info('Express server listening on port ' + port);
  });
}


var shutdown = function() {
  server.close();
}




/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
	//Logger_H.error(error);
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
}