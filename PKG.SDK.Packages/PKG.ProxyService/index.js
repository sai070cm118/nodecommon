var request = require('request');
var BaseApiUri = require('../PKG.ConfigurationManager/index').getApiURI();
var ApiKey = require('../PKG.ConfigurationManager/index').getAppKey();
var isRejectUnauthorized  = require('../PKG.ConfigurationManager/index').rejectUnauthorized();

var ProxyService={

	GET:function(inURI,inJsonObj, inHeaders ,getBack){
		
		request({ method: 'GET', uri: inURI, json:inJsonObj, headers: inHeaders, rejectUnauthorized: isRejectUnauthorized }, function(err,response,body){
			if (!err && response.statusCode == 200) {
				getBack(err,body);
			}
			else if(err){
				getBack(err);
			}
			else{
				getBack(null,body);
			}
		});
	},
	POST:function(inURI,inJsonObj,inHeaders,getBack){
		
		request({ method: 'POST', uri: inURI, json:inJsonObj, headers: inHeaders, rejectUnauthorized: isRejectUnauthorized }, function(err,response,body){
			if (!err && response.statusCode == 200) {
				getBack(err,body);
			}
			else if(err){
				getBack(err);
			}
			else{
				getBack(null,body);
			}
		});
	},
	PUT:function(inURI,inJsonObj,inHeaders,getBack){
        
		request({ method: 'PUT', uri: inURI, json:inJsonObj, headers: inHeaders, rejectUnauthorized: isRejectUnauthorized }, function(err,response,body){
			
			if (!err && response.statusCode == 200) {
				getBack(err,body);
			}
			else if(err){
				getBack(err);
			}
			else{
				getBack(null,body);
			}
		});
	},
	DELETE:function(inURI,inJsonObj,inHeaders,getBack){
        
		request({ method: 'DELETE', uri: inURI, json:inJsonObj, headers: inHeaders, rejectUnauthorized: isRejectUnauthorized }, function(err,response,body){
			
			if (!err && response.statusCode == 200) {
				getBack(err,body);
			}
			else if(err){
				getBack(err);
			}
			else{
				getBack(null,body);
			}
		});
	}
}

module.exports=ProxyService;