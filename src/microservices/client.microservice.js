const { sequelize } = require("../database/database")


exports.GetClientDetail = async(order_user) => {
    let clientDetails = await sequelize.query(`Select * from tb_cust 
    where admin='${order_user}'`, order_user)

    return clientDetails[0]
}