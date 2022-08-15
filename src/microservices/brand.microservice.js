/**
 * @author: ntwari egide
 * @description: brand microservices
 */

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


exports.GetWastageList = async (brand_id) => {
    
    let wastageList = await sequelize.query(`SELECT A.guid_key,brand_name,brand_prefix,display_Content,display_SizeTable,Content_Model,OrderModel,BatchConfirm,IsDataSync,B.guid_key CompanyKey,B.group_code CompanyGroupCode,qr_rengen_at,
    qr_rengen_url
    ,C.IsImportItem,C.IsAllowConfirmOrder,B.IsShowButtons,C.IsApplyMOQtoGroup
    ,a.brand_url,A.OrderReceiptState,A.WastageSwitch,A.WastageValue
    FROM dbo.tb_brand A
    LEFT JOIN dbo.tb_company B ON a.company_key=B.guid_key
    LEFT JOIN dbo.tb_EdiConfig C ON A.guid_key=C.BrandId
    WHERE A.guid_key=${brand_id}`)

    console.log("returned here: ", wastageList)

    return wastageList
}