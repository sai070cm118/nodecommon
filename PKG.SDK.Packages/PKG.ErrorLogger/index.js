var http = require('http');
var AppConfig=require('../../AppConfig.json');
var proxyService = require('../PKG.ProxyService/index');
var globals = require('../../Globals');

module.exports = function(message, exception, controller, action, data,thread, level,  type) {

  try{

    proxyService.POST(AppConfig.KingsonsApi+'ErrorLogger/ExceptionLog',{
      
      ExMessage: message,
      Exception: exception,
      Controller: controller,
      Action: action,
      Data: JSON.stringify(data),

      Thread: thread == null || thread == undefined ?  0 : thread,
      Level: level == null || level == undefined ?  0 : level,
      Type: type == null || type == undefined ?  0 : type,
     }, { 'AppKey':AppConfig.AppKey, 'Authorization': ' bearer '+ globals.getSession().AuthToken },function(err, response){

      if(!err){
        console.log(response);
      }
      else{

        //If session expires, then get the new token.
        console.log('Unable to handle log error.');

      }
  
    });
  }
  catch(ex){
    console.log('Unable to handle log error.');
  }

};