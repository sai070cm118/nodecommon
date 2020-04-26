var express = require('express'),
    cookieParser = require('cookie-parser'),
    cors = require('cors'),
    bodyParser = require('body-parser'),
    app = express(),
    _responsemanager=require('./PKG.ResponseManager/index');

var globals = require('./Globals');
app.use('/', express.static(__dirname + '/'));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json'}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
var jwt = require('jsonwebtoken');

const SocketRouter = require('./Router');


// app.use('/user/api',require('../GT.UserManager/Router'));
// app.use('/game/api',require('../GT.GameManager/ApiControllers/Router'));

app.use(function (req, res, next) {
  next()
})

app.use(function (err, req, res, next) {
  if (err.isBoom) {
      _responsemanager.ValidationError(req,res,err.data);
  }
  else{
      _responsemanager.ServerError(req,res,err);
  }
});

app.post('/api/GetData', authenticateToken, function (req, res) {
  //console.log(req.body);
  //console.log(req.user);
  //res.send('hello world');

  SocketRouter(req.body, req.user.Id, function(result,isApi){
    res.json(result);
  },true)
});


function authenticateToken(req, res, next) {
  try{
    // Gather the jwt access token from the request header
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) {next();}else{
      jwt.verify(token, 'This is the password used for the key that will be used to sign the tokens. The server signing password needs to be at least 16 chars and should be stored safely, not in a json file as here. This is just an example. Use for example user-secrets or azure key vault.', function(err, verifiedJwt) {
        if(!err){
          //console.log(verifiedJwt);
          req.user = verifiedJwt
        }
        next();
      });
    }
  }
  catch(ex){
    next();
  }
}


process.on('uncaughtException', function (err) {
  //Logger_H.error(err);
  //console.log(err);
  process.exit(1);
});

process.on('SIGINT', function() {
	//Logger_H.info("Server is Intentinally stopped.");
	process.exit(0); 
}); 

process.on('exit', function(code){
	//console.log(code);
	//Logger_H.info("exit code is:"+code);
});

module.exports = app;
