const  { sql, pool, poolConnect }  =  require('../PKG.SDK.Packages/PKG.ConnectionManager/index');

module.exports = async function(procedure, parameters,callback) {
    await poolConnect;
    try{
        let request = pool.request();
        (parameters).forEach(parameter => {

            let parameterType = null;
            switch(parameter.Type){
                case "int" : parameterType = sql.Int;
                break;
                case "varchar" :   parameterType = sql.VarChar;
                break;
                case "datetime" :   parameterType = sql.DateTime;
                break;
                case "bit" :   parameterType = sql.Bit;
                break;
                case "nvarchar" :   parameterType = sql.NVarChar;
                break;
                case "text" :   parameterType = sql.Text;
                break;
                case "bigint" :   parameterType = sql.BigInt;
                break;
                case "tinyint" :   parameterType = sql.TinyInt;
                break;
                case "smallint" :   parameterType = sql.SmallInt;
                break;
                case "float" :   parameterType = sql.Float;
                break;
                case "numeric" :   parameterType = sql.Numeric;
                break;
                case "decimal" :   parameterType = sql.Decimal;
                break;
                case "real" :   parameterType = sql.Real;
                break;
                case "date" :   parameterType = sql.Date;
                break;
                case "datetime2" :   parameterType = sql.DateTime2;
                break;
                case "datetimeoffset" :   parameterType = sql.DateTimeOffset;
                break;
                case "smalldateTime" :   parameterType = sql.SmallDateTime;
                break;
                case "time" :   parameterType = sql.Time;
                break;
                case "smallmoney" :   parameterType = sql.SmallMoney;
                break;
                case "uniqueidentifier" :   parameterType = sql.UniqueIdentifier;
                break;
                case "money" :   parameterType = sql.Money;
                break;
                case "money" :   parameterType = sql.Money;
                break;
                case "binary" :   parameterType = sql.Binary;
                break;
                case "varbinary" :   parameterType = sql.VarBinary;
                break;
                case "image" :   parameterType = sql.Image;
                break;
                case "xml" :   parameterType = sql.Xml;
                break;
                case "char" :   parameterType = sql.Char;
                break;
                case "nchar" :   parameterType = sql.NChar;
                break;
                case "ntext" :   parameterType = sql.XNTextl;
                break;
                case "tvp" :   parameterType = sql.TVP;
                break;
                case "udp" :   parameterType = sql.UDT;
                break;
                case "geography" :   parameterType = sql.Geography;
                break;
                case "geometry" :   parameterType = sql.Geometry;
                break;
                case "variant" :   parameterType = sql.Variant;
                break;
                    
            }
    
            if(parameter.Is_Out == true){
                request.output(parameter.Name, parameterType);
            }
            else{
                request.input(parameter.Name, parameterType, parameter.Value);
            }
    
        });
    
        request.execute(procedure, (err, recordset) => {
            callback(err,recordset)
        });
    }
    catch(err){
        callback(err)
    }
}
