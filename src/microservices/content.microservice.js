const { sequelize } = require("../database/database")


exports.GetContentNumberDetail = async (brand_key, content_number, order_user, style_number) => {
    
    const contentNumberDetail = await sequelize.query(`
    SELECT icon_type_id=IconSeqNo.id,sys_icon_key=b.sysicon_key,en_descr=c.ENDescr,b.seqno,en_file=c.enfile,icon_group=icontype FROM dbo.{1} AS b 
    LEFT JOIN {0} AS a ON a.style_number=b.care_key LEFT JOIN {2} AS c 
    ON b.sysicon_key=c.guid_key 
    LEFT JOIN (SELECT A.ID, ISNULL(SeqNo,seq) AS SeqNo ,ISNULL(B.IsEnable,'Y') AS IsEnable FROM (SELECT * FROM dbo.tb_Sys_IconItem)A 
    LEFT JOIN (SELECT * FROM dbo.tb_BrandIconConfigure WHERE BrandId='${brand_key}') B ON A.id=B.IconTypeId) IconSeqNo 
    ON B.IconTypeId=IconSeqNo.id
    WHERE a.content_key='${content_number}' AND (IconSeqNo.IsEnable IS NULL OR IconSeqNo.IsEnable='Y')
    ORDER BY ISNULL(IconSeqNo.SeqNo, B.SeqNo)`)

    return contentNumberDetail;
   
}

exports.getContentNumberSetting = async (brand_key) => {
    const contentNumberSetting = await sequelize.query(` Select * from tb_brand where guid_key=${brand_key}`)

    return contentNumberSetting;
}


exports.getContentNumberList = async (brand_key, content_group, query_str, order_user) => {

    const contentNumberList = await sequelize.query(`SELECT TOP 50 [style_number],[custom_number],[content_key] as guid_key,Userid as user_id FROM dbo.{0} A
    WHERE A.ApprovedState='Y' AND (a.type='{1}' OR ISNULL('{1}','')='') AND (A.Userid=${order_user} OR A.Userid='') AND A.IsEnable='Y'`)

    return contentNumberList;

}


exports.getDefaultContentByContentKey = async (brand_key,cont_key,page_type) => {

    const deafultContent = await sequelize.query(`
    select value=C.RelationContentKey,label=D.GB_TRANSLATION
    from tb_DefaultContentMaintenance C LEFT JOIN {0} D on C.RelationContentKey=D.guid_key
    where C.contentkey =${cont_key} order by D.GB_TRANSLATION`)

    return deafultContent
} 