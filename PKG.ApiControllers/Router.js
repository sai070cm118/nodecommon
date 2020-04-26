
const sqlRepository = require('./SqlRepository');
var us = require('microtime');
const errorLogger = require('../PKG.SDK.Packages/PKG.ErrorLogger/index');

module.exports = function(message,userId,callback) {
    try{
        const appSettings = require('../Globals').getGlobals();
        var findedRoute = appSettings.Routes.find(x=> x.Route == message.Route && x.BusinessLogicMethod == message.Method );

        if(findedRoute != null ){
            var findedProcedureParams = appSettings.ProcedureParams.filter(x=> x.AppProcedureId == findedRoute.ProcedureId);

            if(findedProcedureParams != null){
                (findedProcedureParams).forEach(param => {
                    if(param.Name == "AppId" || param.Name == "AppKey"){
                        param.Value = appSettings.App.Id;
                    }
                    else{
                        param.Value = message.Data[param.MapProperty];
                    }
                });
                
                sqlRepository(findedRoute.ProcedureName,findedProcedureParams,function(err,result){

                    if(err){
                        console.log(err);
                        var errObj = { Code: -1, IsError: true, Message: 'Unable to process your request.' }
                        callback({Type:'MySelf',RoomId:'',Message: errObj});
                    }
                    else{
                        try{
                            (result[result.recordsets[result.recordsets.length - 1]]).forEach(response => {
                                callback({Type:response.To, RoomId:response.RoomId, Message: result.recordsets[response.ResultSetIndex]});
                            });
                            //console.log('Speed Test : ' + us.nowDouble() );
                            console.log('Norma Test : ' + Date.now() );
                        }catch(ex){
                            console.log(ex);
                            //var errObj = { Code: -1, IsError: true, Message: 'Unable to process your request.2' }
                            //callback({Type:'MySelf',RoomId:'',Message: errObj});
                        }
                        callback({Type:'MySelf', RoomId:'', Message: result.output});
                    }
                });
            }
            else{
                var errObj = { Code: -1, IsError: true, Message: 'Route not have valid structure' }
                callback({Type:'MySelf',RoomId:'',Message: errObj});
                errorLogger(error, error, message.Routes, message.Method, message.Data);
            }
        }
        else{
            var error = 'Requested route not found. dfs';
            var errObj = { Code: -1, IsError: true, Message: error }
            callback({Type:'MySelf',RoomId:'',Message: errObj});
            errorLogger(error, error, message.Routes, message.Method, message.Data);
        }
    }
    catch(ex){
        console.log(ex);
        var errObj = { Code: -1, IsError: true, Message: 'Unable to process your request.' }
        callback({Type:'MySelf',RoomId:'',Message: errObj});
        errorLogger(error, error, message.Routes, message.Method, message.Data);
    }
}