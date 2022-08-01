const { Sequelize } = require('sequelize');
 const sequelize = new Sequelize('po_order', 'root', 'pass123', {
        host: 'localhost',
        dialect: 'mysql',
        port: 3307
      });

   try {
    sequelize.authenticate()
   } catch (error) {
    console.error(error)
}
   
module.exports = { sequelize }