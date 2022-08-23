const { sequelize } = require("../database/database")


exports.GetContentNumberDetail = async (brand_key, content_number, order_user, style_number) => {
    
    const contentNumberDetail = await sequelize.query(`
    SELECT b.content_key, GB_TRANSLATION FROM tb_content AS b 
LEFT JOIN tb_content AS a ON a.style_number=b.content_key 
LEFT JOIN tb_translation AS c ON c.guid_key=b.content_key 
WHERE a.content_key='${content_number}';`)

    return contentNumberDetail;
   
}

exports.getContentNumberSetting = async (brand_key) => {
    const contentNumberSetting = await sequelize.query(` Select * from tb_brand where guid_key='${brand_key}'`)

    return contentNumberSetting;
}


exports.getContentNumberList = async (brand_key, content_group, query_str, order_user) => {

    const contentNumberList = await sequelize.query(`
    SELECT style_number,custom_number,content_key as guid_key,Userid as user_id FROM tb_content A
   WHERE A.ApprovedState='Y' AND (A.type='{1}' OR ISNULL('{1}')='') AND (A.Userid='${order_user}' OR A.Userid='') AND A.IsEnable='Y';`)

    return contentNumberList;

}


exports.getDefaultContentByContentKey = async (brand_key,cont_key,page_type) => {

    const deafultContent = await sequelize.query(`
    select C.RelationContentKey as value ,D.GB_TRANSLATION as label
    from tb_defaultcontentmaintenance C LEFT JOIN tb_translation D on C.RelationContentKey=D.guid_key
    where C.contentkey ='${cont_key}' order by D.GB_TRANSLATION;`)

    return deafultContent
} 
 
// router.route('/MatchMultiContentNumber/brand-key/:brand_key?/order-user/:order_user?/content-group/:content_group?/content/part-key?/:part_key?/cont-key/:cont_key?/percentage/:percentage?/seqno/:seqno1?/default-content/cont-key/:cont_key1?/seqno/:seqno2?/care/care-key/:care_key?/seqno/:seqno2/icon/icon-key/:icon_key?/icon-type/:icon_type_id?/seqno/:seqno3?')

exports.matchMultiContentNumber =  async (brand_key, order_user, content_group, part_key, cont_key, percentage, seqno1, cont_key1, seqno2, care_key) => {
    
}