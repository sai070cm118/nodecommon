
var RandomStringGenerator = require("password-generator");
var crypto = require('crypto');

var ConfigurationManager = require('../PKG.ConfigurationManager/index');
var ProxyService=require('../PKG.ProxyService/index');
var nJwt = require('njwt');


//Verifies the token whether the token is valid or not.
function verifyToken(token,verificationCallback){
    nJwt.verify(token||"",ConfigurationManager.getTokenSecret(),function(err,verifiedJwt){
        verificationCallback(err,verifiedJwt) ;
    });
}

//Middleware user on every request after login for Extract the user details form the token which is passend in autherization header.
function extractUserFromToken(req, res, next) {  

    console.log(req.headers['authorization']);

    if(req.headers['authorization']==null || req.headers['authorization']==undefined){
        console.log('No autherizaion headr present');
        next();
    }
    else{
        nJwt.verify(req.headers['authorization'],ConfigurationManager.getTokenSecret(),function(err,verifiedJwt){
            
            if(err)
                next();
            else if(verifiedJwt==undefined)
                next();
            else{
                req.body.UserId=verifiedJwt.body.Id;
                next();
            }
        });
    }
 
}

//It will Generates the new token.
function createToken(claims){

    claims.iat=new Date().getTime();
    claims.exp=new Date().getTime() + (24*60*60*1000); //One Day is the expiration.

    var jwt =  nJwt.create(claims,ConfigurationManager.getTokenSecret(),ConfigurationManager.getTokenAlgorithm(0));
    return token = jwt.compact();
}

//Register New User
function NewRegistration(profile,callback){

  var passwordObj=saltHashPassword(profile.User.PasswordHash)
  profile.User.PasswordHash=passwordObj.passwordHash;
  profile.User.Salt=passwordObj.salt;
  profile.User.EmailVerification=generateRandomString(64);


  ProxyService.POST('api/Profile',profile,function(err,createResponse){

    var claims = {
        "Id":createResponse.data
    }

    callback(createToken(claims));

    //var mailOptions=new CoreModels.MailOptions(ConfigurationManager.getEmailConfiguration().auth.user,profile.Email,'Email verication','Welcome to the Application',EmailActivationTemplate(ConfigurationManager.getWebURI()+'verifyEmail/'+profile.User.EmailVerification));
    
    NotificationManager.sendEmail(mailOptions);

  });
}

function SocialLogin(profile,callback){

    profile.User.EmailVerification=generateRandomString(64);

    Login(profile,true,function(err,loginResponse){
        ProxyService.POST('api/Profile',profile,function(err,createResponse){
            if(err){
                callback('');
            }
            else{
                if(!loginResponse.error){
                    var claims = {
                        "Id":loginResponse.data._id
                    }
                    callback(createToken(claims));
                }
                else{
                    var claims = {
                        "Id":createResponse.data
                    }
                
                    callback(createToken(claims));
                
                    //var mailOptions=new CoreModels.MailOptions(ConfigurationManager.getEmailConfiguration().auth.user,profile.Email,'Email verication','Welcome to the Application',EmailActivationTemplate(ConfigurationManager.getWebURI()+'verifyEmail/'+profile.User.EmailVerification));
                    
                    NotificationManager.sendEmail(mailOptions);
                }
            }
        });
    });
}

function Login(profile,IsSocialLogin,callback){
    ProxyService.GET('api/user/GetByEmailOrMobile/'+profile.Email,{},function(err,response){

        if(IsSocialLogin){
            callback(err,response);
        }
        else{

            if(err){
                callback(err,response);
            }
            else{
                var fetchedProfile=response.data;

                if(fetchedProfile.error){
                    callback(err,response);
                }
                else{

                    var passwordObj=sha512(profile.Password,fetchedProfile.Salt);


                    profile.PasswordHash=passwordObj.passwordHash;

                    if(fetchedProfile.PasswordHash==profile.PasswordHash){

                        var claims = {
                            "Id":fetchedProfile._id
                        }
                        callback(err,{error:false,data:createToken(claims)});
                    }
                    else{
                        callback(err,{error:true,data:'Invalid Credentials'});
                    }

                }

            }
                




        }

    });
}

//Generates the random string with the given lenght.
function generateRandomString(length,pattern){
  if(pattern==undefined)
    return RandomStringGenerator(length, false);
  else
    return RandomStringGenerator(length, false,pattern);
}

//Hashes the password with the sald.
function sha512(password, salt){
    var hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
    hash.update(password);
    var value = hash.digest('hex');
    return {
        salt:salt,
        passwordHash:value
    };
};

//Generates the salt and request for password encryption.
function saltHashPassword(userpassword) {
    var salt = generateRandomString(16);
    var passwordData = sha512(userpassword, salt);
    return passwordData;
}



function EmailActivationTemplate(activationLink){
        return '<div class="maincontainer" style="box-sizing: border-box;background:#cccacab0;  width:100%;  height:auto;  padding:10px;">	<div class="Detailscontainer" style="margin-top:20px;  width:90%;  background:white;  margin:auto;  box-shadow: 7px 7px 5px -5px gray;  padding:0px 20px 0px 20px;"> 		<div class="Details" style="box-sizing: border-box;padding:5px 50px 0px 20px;  height:60px;  width:100%;">			<p style=\'font-family: "Helvetica Neue",Helvetica,Arial,sans-serif;"\'>To activate your accout for GT, please follow the <a href="'+activationLink+'">link</a> below:<p> '+activationLink+' </p></p>		</div> 	</div></div>'
    }


//Export the module
module.exports = {
    verifyToken : verifyToken,
    createToken : createToken,
    sha512 : sha512,
    SocialLogin : SocialLogin,
    generateRandomString : generateRandomString,
    saltHashPassword : saltHashPassword,
    extractUserFromToken:extractUserFromToken,
    NewRegistration:NewRegistration,
    Login:Login
}