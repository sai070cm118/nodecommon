var request = require('request');
var URI_H = require('./UriHelper.js').URI_H.getApiURI();

var AccessApi_H={

	GET:function(inURI,inJsonObj,getBack){
        
		request({ method: 'GET', uri:URI_H+inURI, json:inJsonObj }, function(err,response,body){
			
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
	POST:function(inURI,inJsonObj,getBack){
        
		request({ method: 'POST', uri:URI_H+inURI, json:inJsonObj }, function(err,response,body){
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
	PUT:function(inURI,inJsonObj,getBack){
        
		request({ method: 'PUT', uri:URI_H+inURI, json:inJsonObj }, function(err,response,body){
			
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
	DELETE:function(inURI,inJsonObj,getBack){
        
		request({ method: 'DELETE', uri:URI_H+inURI, json:inJsonObj }, function(err,response,body){
			
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

exports.AccessApi_H=AccessApi_H;