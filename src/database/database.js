const { Sequelize } = require('sequelize');
 const sequelize = new Sequelize(
  'bznifnxhzmqpba3lt2z0', 
  'bznifnxhzmqpba3lt2z0-mysql.services.clever-cloud.com', 
  'kmj7ptgyKmRmxJacVpt8', 
  {
        host: 'bznifnxhzmqpba3lt2z0-mysql.services.clever-cloud.com',
        dialect: 'mysql',
        port: 3306
      });

   try {
    sequelize.authenticate()
   } catch (error) {
    console.error('Error occured: ', JSON.stringify(error))
}
   
module.exports = { sequelize }


// const mysql = require('mysql')
// const util = require('util');


// const connection = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: 'pass123',
//     database: 'po_order',
//     port: 3307,
//     typeCast: function (field, next) {
//         if (field.type == 'VAR_STRING') {
//             return field.string();
//         }
//         return next();
//     }
// })

// const query = util.promisify(connection.query).bind(connection);

// connection.connect( (error) => {
//     if(! error) console.log("Connection established successfuly");
//     else console.log("Connection failed: ", JSON.stringify(error,undefined, 2))
// })








// export default query