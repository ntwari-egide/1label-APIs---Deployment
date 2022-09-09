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
    console.log('Connection has been established successfully.');
    sequelize.authenticate()
   } catch (error) {
    console.error(error)
}
   
module.exports = { sequelize }