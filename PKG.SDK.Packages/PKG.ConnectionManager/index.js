const sql = require('mssql')
var databaseConfig = require('../../Globals').getGlobals();

console.log(databaseConfig.DatabaseConfig);

const pool = new sql.ConnectionPool(databaseConfig.DatabaseConfig);
const poolConnect = pool.connect();

module.exports = {
  sql, pool, poolConnect
}