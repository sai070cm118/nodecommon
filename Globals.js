var AppSettings = {
    
}

var sessionData = {

}

function setSession(sess) {
    sessionData=sess;
}

function getSession(sess) {
    return sessionData;
}

function setGlobals(val){
    AppSettings = val;

    //Setup the DbConfig
    const datbaseConfig = AppSettings.Databases[0];
    AppSettings.DatabaseConfig ={
        user: datbaseConfig.UserId,
        password: datbaseConfig.Password,
        server: datbaseConfig.Server, 
        database: datbaseConfig.Name
    }
}

function getGlobals(){
    return AppSettings;
}

module.exports = {
    setGlobals: setGlobals,
    getGlobals: getGlobals,
    setSession: setSession,
    getSession: getSession
}