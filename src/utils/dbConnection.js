const { Sequelize } = require('sequelize');
 const sequelize = new Sequelize('po_order', 'egide', '123', {
        host: 'localhost',
        dialect: 'mysql',
        port: 3306
      });

   try {
    sequelize.authenticate()
   } catch (error) {
    console.error(error)
}
   
module.exports = { sequelize }