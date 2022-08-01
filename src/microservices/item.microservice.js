const { sequelize } = require("../database/database")

exports.GetItemRefDetail = async(guid_key) => {
    let itemRefDetail = await sequelize.query(`Select b.brand_name,it.tag_name,i.*
    from tb_item_reference i left join tb_brand b on b.guid_key=i.brandid left join tb_ItemTag it on i.itemtag_id=it.id where 1=1 AND i.guid_key='${guid_key}'`)

    return itemRefDetail[0]
}
