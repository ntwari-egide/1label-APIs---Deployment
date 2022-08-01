const { sequelize } = require("../utils/dbConnection");

exports.GetPOBrandListByClient = async(order_user) => {
     let listByClient = await sequelize.query(`select b.guid_key,b.brand_name
     from tb_brand b 
     inner join tb_cust_brand cb on b.guid_key=cb.brand_guid_key
     inner join tb_cust cust on cust.guid_key=cb.cust_guid_key
     where 1=1
     and cust.admin=?
     and b.display='Y'
     and OrderModel in(7,8)
     order by b.brand_name`, order_user)
    
    return listByClient;
} 