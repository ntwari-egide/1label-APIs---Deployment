const { QueryTypes, Sequelize } = require('sequelize');
const { sequelize } = require("../utils/dbConnection");
const nodemailer = require("nodemailer");


exports.addPOOrder = async (brand_key, order_user, order_keys) => {
    
    let query1 = `SELECT B.* FROM (SELECT order_no,Consolidated_ID FROM tb_order_edi WHERE guid_key IN ('${order_keys[0]}', '${order_keys[1]}'))A LEFT JOIN tb_order_edi B ON A.order_no=B.order_no AND A.Consolidated_ID=B.Consolidated_ID GROUP BY size_matrix_type,ID ORDER BY B.order_no,B.num `;
    
    let poOrderByKeys = await sequelize.query(query1, {type: QueryTypes.SELECT, raw: true})
    console.log("result", poOrderByKeys)
    
    
    let EDISetupQuery = `SELECT A.guid_key,brand_name,brand_prefix,display_Content,display_SizeTable,Content_Model,OrderModel,BatchConfirm,IsDataSync,B.guid_key CompanyKey,B.group_code CompanyGroupCode,qr_rengen_at,qr_rengen_url,C.IsImportItem,C.IsAllowConfirmOrder,B.IsShowButtons,C.IsApplyMOQtoGroup,a.brand_url,A.OrderReceiptState,A.WastageSwitch,A.WastageValue FROM tb_brand A LEFT JOIN tb_company B ON a.company_key=B.guid_key LEFT JOIN tb_EdiConfig C ON A.guid_key=C.BrandId WHERE A.guid_key= :brand_key`

    let EDISetup = await sequelize.query(EDISetupQuery, {replacements: {brand_key}, type: QueryTypes.SELECT, raw: true})

    console.log("EDISetup",EDISetup)

    let itemRef;
    if (EDISetup[0]?.IsImportItem === 'Y') {
         itemRef = await sequelize.query(`SELECT * FROM tb_OrderItems WHERE BrandId= :brand_key AND OrderKey=:order_keys`,{replacements: {brand_key, order_keys}} )
    } else {    
         itemRef = await sequelize.query(`SELECT guid_key=B.guid_key,B.item_ref,B.BrandId FROM tb_Brand_item_ref A
        INNER JOIN tb_item_reference B ON A.item_guid_key=B.guid_key AND A.brandid= :brand_key`, {replacements: {brand_key}, type: QueryTypes.SELECT, raw: true})
    }


    console.log("itemRef",itemRef)

    await sequelize.query(`insert into tb_order_edi_temp(guid_key, order_no, num, po_number, factory_code, order_expdate, invoice_cpyname,invoice_addr, invoice_email, invoice_contact, invoice_phone, invoice_fax, delivery_cpyname, delivery_addr, delivery_email, delivery_contact, delivery_phone, delivery_fax ,item_ref1 ,item_ref2 ,item_ref3 ,item_ref4 ,item_ref5 ,item_ref6 ,item_ref7 ,item_ref8 ,item_ref9 ,
        item_ref10 , style_number, coo, season_code, colour, gender, remark, content_number, size_matrix_type1, size_content1, total_qty, artwork_number, brandid, order_user, order_date,is_draft ,total_qty1,total_qty2 ,total_qty3 ,total_qty4 ,total_qty5 ,total_qty6 ,total_qty7 ,total_qty8 ,total_qty9 ,total_qty10 ,F1 ,F2 ,F3 ,F4 ,F5 ,F6 ,F7 ,F8 ,F9 ,F10 ,F11 ,F12 ,F13, F14 ,F15 ,F16,F17 ,
        F18 ,F19 ,F20 ,F21 ,F22 ,F23 ,F24 ,F25 ,F26 ,F27 ,F28 ,F29 ,F30, A_Content_Number, B_Content_Number, C_Content_Number, invoice_addr2, invoice_addr3, delivery_city, delivery_country, delivery_post_code, delivery_addr2,delivery_addr3,size_pointer,LocationCode,Price1 ,Price2 ,Price3 ,Price4 ,Price5 ,Price6 ,Price7 ,Price8 ,Price9 ,Price10 ,currency1 ,currency2 ,currency3 ,currency4 ,currency5 ,currency6 ,currency7 ,currency8 ,currency9 ,currency10 ,SumPrice,ShrinkagePorcentaje,DraftOrderEmail,SizeTableImg,DefaultSizeContent,IsWastage,EdiOrderNo,Consolidated_ID,Supplier_Code,Send_Date,Product_Description,OptionId,PoLastUpdateTime) values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? ,? ,? ,? ,? ,? ,? ,?,? ,?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
        ?,?,? ,?,?,? ,?,?,? ,? ,? ,? ,? ,? ,? ,? ,?,? ,? ,? ,? ,? ,? ,? ,? ,? ,? ,? ,? ,? ,? ,? ,? ,? ,? ,? ,? ,? ,? ,? ,? , ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? ,? ,? ,? ,? ,? ,? ,?,? ,?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
        ?,?,? ,?,?,? ,?,?,? ,? ,? ,? ,? ,?)`, { replacements: [EDISetup?.guid_key, EDISetup?.order_no, EDISetup[0]?.num, EDISetup[0]?.po_number,EDISetup[0]?.factory_code,EDISetup[0]?.order_expdate,EDISetup[0]?.invoice_cpyname,EDISetup[0]?.invoice_addr,EDISetup[0]?.invoice_email,EDISetup[0]?.invoice_contact,EDISetup[0]?.invoice_phone,EDISetup[0]?.invoice_fax,EDISetup[0]?.delivery_cpyname,EDISetup[0]?.delivery_addr,EDISetup[0]?.delivery_email,EDISetup[0]?.delivery_contact,EDISetup[0]?.delivery_phone,EDISetup[0]?.delivery_fax,EDISetup[0]?.item_ref1,EDISetup[0]?.item_ref2,EDISetup[0]?.item_ref3,EDISetup[0]?.item_ref4,EDISetup[0]?.item_ref5,EDISetup[0]?.item_ref5,EDISetup[0]?.item_ref6,EDISetup[0]?.item_ref7,EDISetup[0]?.item_ref8,EDISetup[0]?.item_ref9,EDISetup[0]?.item_ref10,EDISetup[0]?.style_number,EDISetup[0]?.coo,EDISetup[0]?.season_code,EDISetup[0]?.colour,EDISetup[0]?.gender,EDISetup[0]?.remark,EDISetup[0]?.content_number,poOrderByKeys[0]?.size_matrix_type1,EDISetup[0]?.size_content,EDISetup[0]?.total_qty,EDISetup[0]?.artwork_number,EDISetup[0]?.brandid,EDISetup[0]?.order_user,EDISetup[0]?.order_date,EDISetup[0]?.is_draft,EDISetup[0]?.total_qty1,EDISetup[0]?.total_qty2,EDISetup[0]?.total_qty3,EDISetup[0]?.total_qty4,EDISetup[0]?.total_qty5,EDISetup[0]?.total_qty6,EDISetup[0]?.total_qty7,EDISetup[0]?.total_qty8,EDISetup[0]?.total_qty9,EDISetup[0]?.total_qty10,EDISetup[0]?.F1,EDISetup[0]?.F2,EDISetup[0]?.F3,EDISetup[0]?.F4,EDISetup[0]?.F5,EDISetup[0]?.F6,EDISetup[0]?.F7,EDISetup[0]?.F8,EDISetup[0]?.F9,EDISetup[0]?.F10,EDISetup[0]?.F11,EDISetup[0]?.F12,EDISetup[0]?.F13,EDISetup[0]?.F14,EDISetup[0]?.F15,EDISetup[0]?.F16,EDISetup[0]?.F17,EDISetup[0]?.F18,EDISetup[0]?.F19,EDISetup[0]?.F20,EDISetup[0]?.F21,EDISetup[0]?.F22,EDISetup[0]?.F23,EDISetup[0]?.F24,EDISetup[0]?.F25,EDISetup[0]?.F26,EDISetup[0]?.F27,EDISetup[0]?.F28,EDISetup[0]?.F29,EDISetup[0]?.F30,EDISetup[0]?.A_Content_Number,EDISetup[0]?.B_Content_Number,EDISetup[0]?.C_content_number,poOrderByKeys[0]?.invoice_addr2,poOrderByKeys[0]?.invoice_addr3,poOrderByKeys[0]?.delivery_city,poOrderByKeys[0]?.delivery_country,poOrderByKeys[0]?.delivery_post_code,poOrderByKeys[0]?.delivery_addr2,poOrderByKeys[0]?.delivery_addr3,poOrderByKeys[0]?.size_pointer,poOrderByKeys[0]?.LocationCode,poOrderByKeys[0]?.Price1,poOrderByKeys[0]?.Price2,poOrderByKeys[0]?.Price3,poOrderByKeys[0]?.Price4,poOrderByKeys[0]?.Price5,poOrderByKeys[0]?.Price6,poOrderByKeys[0]?.Price7,poOrderByKeys[0]?.Price8,poOrderByKeys[0]?.Price9, 
poOrderByKeys[0]?.Price10,poOrderByKeys[0]?.currency1,poOrderByKeys[0]?.currency2,poOrderByKeys[0]?.currency3,poOrderByKeys[0]?.currency4,poOrderByKeys[0]?.currency5,poOrderByKeys[0]?.currency6,poOrderByKeys[0]?.currency7,poOrderByKeys[0]?.currency8,poOrderByKeys[0]?.currency9,poOrderByKeys[0]?.currency10,poOrderByKeys[0]?.SumPrice,poOrderByKeys[0]?.ShrikagePorcentaje,poOrderByKeys[0]?.DraftOrderEmail,poOrderByKeys[0]?.SizeTableImg,poOrderByKeys[0]?.DefaultSizeContent,poOrderByKeys[0]?.IsWastage,poOrderByKeys[0]?.IsWastage,poOrderByKeys[0]?.EdiOrderNo, poOrderByKeys[0]?.Consolidated_ID, poOrderByKeys[0]?.Supplier_Code, poOrderByKeys[0]?.Send_Code, poOrderByKeys[0]?.Send_Date, poOrderByKeys[0]?.Product_Description, poOrderByKeys[0]?.OptionId, poOrderByKeys[0]?.PoLastUpdateTime],type: QueryTypes.SELECT, raw: true}     
    )



    await sequelize.query(`insert into tb_AsosOrderPoSize(GuidKey, OrderKey, BrandId, EdiOrderNo, ConsolidatedId, SizeContent,SendDate, CreateDate) values(?, ?, ?, ?, ?, ?,?, ?)`, {replacements: [EDISetup[0]?.guid_key, order_keys, brand_key, EDISetup[0]?.order_no, EDISetup[0]?.Consolidated_ID, EDISetup?.size_content,EDISetup[0]?.Send_Date, ''], raw: true})

    await sequelize.query(`INSERT INTO tb_OrderItems(OrderKey ,ItemIndex ,ItemKey ,BrandId ) VALUES(?,?,?,?)`, { replacements: [order_keys, '', '', brand_key] })
    
    return 

    // if(EDISetup)
}


exports.GetOrderDetail = async (brand_key, order_user, order_no, is_po_order_temp) => {
    let orderDetail = await sequelize.query(`
    SELECT A.custom_number AS A_Custom_Content_Number,
    B.custom_number AS B_Custom_Content_Number,C.custom_number AS C_Custom_Content_Number
    ,A.style_number AS A_Content_Number_Name,
    B.style_number AS B_Content_Number_Name,C.style_number AS C_Content_Number_Name
    ,orders.*
    FROM (SELECT ROW_NUMBER() over(order by orders.num) as orderID, orders.* ,(select guid_key from tb_item_reference item where item.item_ref=orders.item_ref1 and (item.brandid=orders.brandid OR item.brandid=(SELECT guid_key FROM tb_brand WHERE brand_prefix='ACD') ) ) as item_guid_key1 ,(select guid_key from tb_item_reference item where item.item_ref=orders.item_ref2 and (item.brandid=orders.brandid OR item.
    brandid=(SELECT guid_key FROM tb_brand WHERE brand_prefix='ACD') ) ) as item_guid_key2 ,(select guid_key from tb_item_reference item where item.item_ref=orders.item_ref3 and (item.brandid=orders.brandid OR item.brandid=(SELECT guid_key FROM tb_brand WHERE brand_prefix='ACD') ) ) as item_guid_key3 ,(select guid_key from tb_item_reference item where item.item_ref=orders.item_ref4 and (item.brandid=orders.
    brandid OR item.brandid=(SELECT guid_key FROM tb_brand WHERE brand_prefix='ACD') ) ) as item_guid_key4 ,(select guid_key from tb_item_reference item where item.item_ref=orders.item_ref5 and (item.brandid=orders.brandid OR item.brandid=(SELECT guid_key FROM tb_brand WHERE brand_prefix='ACD') ) ) as item_guid_key5 ,(select guid_key from tb_item_reference item where item.item_ref=orders.item_ref6 and (item.
    brandid=orders.brandid OR item.brandid=(SELECT guid_key FROM tb_brand WHERE brand_prefix='ACD') ) ) as item_guid_key6 ,(select guid_key from tb_item_reference item where item.item_ref=orders.item_ref7 and (item.brandid=orders.brandid OR item.brandid=(SELECT guid_key FROM tb_brand WHERE brand_prefix='ACD') ) ) as item_guid_key7 ,(select guid_key from tb_item_reference item where item.item_ref=orders.
    item_ref8 and (item.brandid=orders.brandid OR item.brandid=(SELECT guid_key FROM tb_brand WHERE brand_prefix='ACD') ) ) as item_guid_key8 ,(select guid_key from tb_item_reference item where item.item_ref=orders.item_ref9 and (item.brandid=orders.brandid OR item.brandid=(SELECT guid_key FROM tb_brand WHERE brand_prefix='ACD') ) ) as item_guid_key9 ,(select guid_key from tb_item_reference item where item.
    item_ref=orders.item_ref10 and (item.brandid=orders.brandid OR item.brandid=(SELECT guid_key FROM tb_brand WHERE brand_prefix='ACD') ) ) as item_guid_key10 ,(select d365itemcode from tb_item_reference item where item.item_ref=orders.item_ref1 and (item.brandid=orders.brandid OR item.brandid=(SELECT guid_key FROM tb_brand WHERE brand_prefix='ACD') ) ) as d365itemcode1 ,(select d365itemcode from 
    tb_item_reference item where item.item_ref=orders.item_ref2 and (item.brandid=orders.brandid OR item.brandid=(SELECT guid_key FROM tb_brand WHERE brand_prefix='ACD') ) ) as d365itemcode2 ,(select d365itemcode from tb_item_reference item where item.item_ref=orders.item_ref3 and (item.brandid=orders.brandid OR item.brandid=(SELECT guid_key FROM tb_brand WHERE brand_prefix='ACD') ) ) as d365itemcode3 ,
    (select d365itemcode from tb_item_reference item where item.item_ref=orders.item_ref4 and (item.brandid=orders.brandid OR item.brandid=(SELECT guid_key FROM tb_brand WHERE brand_prefix='ACD') ) ) as d365itemcode4 ,(select d365itemcode from tb_item_reference item where item.item_ref=orders.item_ref5 and (item.brandid=orders.brandid OR item.brandid=(SELECT guid_key FROM tb_brand WHERE 
    brand_prefix='ACD') ) ) as d365itemcode5 ,(select d365itemcode from tb_item_reference item where item.item_ref=orders.item_ref6 and (item.brandid=orders.brandid OR item.brandid=(SELECT guid_key FROM tb_brand WHERE brand_prefix='ACD') ) ) as d365itemcode6 ,(select d365itemcode from tb_item_reference item where item.item_ref=orders.item_ref7 and (item.brandid=orders.brandid OR item.brandid=(SELECT guid_key FROM 
    tb_brand WHERE brand_prefix='ACD') ) ) as d365itemcode7 ,(select d365itemcode from tb_item_reference item where item.item_ref=orders.item_ref8 and (item.brandid=orders.brandid OR item.brandid=(SELECT guid_key FROM tb_brand WHERE brand_prefix='ACD') ) ) as d365itemcode8 ,(select d365itemcode from tb_item_reference item where item.item_ref=orders.item_ref9 and (item.brandid=orders.brandid OR item.brandid=
    (SELECT guid_key FROM tb_brand WHERE brand_prefix='ACD') ) ) as d365itemcode9 ,(select d365itemcode from tb_item_reference item where item.item_ref=orders.item_ref10 and (item.brandid=orders.brandid OR item.brandid=(SELECT guid_key FROM tb_brand WHERE brand_prefix='ACD') ) ) as d365itemcode10 FROM tb_order_edi_temp2 as orders 
    WHERE orders.order_no='${order_no}'
    )orders LEFT JOIN 
    tb_content A ON A.content_key=orders.A_Content_Number_Name
    LEFT JOIN tb_content B ON B.content_key=orders.B_Content_Number
    LEFT JOIN tb_content C ON C.content_key=orders.C_Content_Number
    ORDER BY orders.order_no,orders.nu`)

    // console.log("orderDetail: ", orderDetail)

    return orderDetail
   
}



exports.GetDynamicFieldList = async (brand_key, show_status, order_user, order_no, is_po_order_temp) => {
    let orderFormFields = await sequelize.query("SELECT b_f.*,f.field_name FROM tb_fields f LEFT join tb_brand_fields b_f ON f.field_name=b_f.fieldsid  WHERE 1=1 and show_status=? and b_f.brandid=? ORDER BY b_f.seqno", { replacements: [show_status, brand_key], type: QueryTypes.SELECT, raw: true })
    
    console.log("orderFormFields", orderFormFields)


    let orderDetails = await sequelize.query(`SELECT A.custom_number AS A_Custom_Content_Number, B.custom_number AS B_Custom_Content_Number,C.custom_number AS C_Custom_Content_Number,A.style_number AS A_Content_Number_Name,B.style_number AS B_Content_Number_Name,C.style_number AS C_Content_Number_Name,orders.* FROM (SELECT ROW_NUMBER() over(order by orders.num)-1 as orderID, orders.* ,(select guid_key from tb_item_reference item where item.item_ref=orders.item_ref1 and (item.brandid=orders.brandid ) ) as item_guid_key1,(select guid_key from tb_item_reference item where item.item_ref=orders.item_ref2 and (item.brandid=orders.brandid ) ) as item_guid_key2,(select guid_key from tb_item_reference item where item.item_ref=orders.item_ref3 and (item.brandid=orders.brandid ) ) as item_guid_key3 ,(select guid_key from tb_item_reference item where item.item_ref=orders.item_ref4 and (item.brandid=orders.brandid ) ) as item_guid_key4 ,(select guid_key from tb_item_reference item where item.item_ref=orders.item_ref5 and (item.brandid=orders.brandid )) as item_guid_key5 ,(select guid_key from tb_item_reference item where item.item_ref=orders.item_ref6 and (item.brandid=orders.brandid ) ) as item_guid_key6 ,(select guid_key from tb_item_reference item where item.item_ref=orders.item_ref7 and (item.brandid=orders.brandid ) ) as item_guid_key7 ,(select guid_key from tb_item_reference item where item.item_ref=orders.item_ref8 and (item.brandid=orders.brandid ) ) as item_guid_key8 ,(select guid_key from tb_item_reference item where item.item_ref=orders.item_ref9 and (item.brandid=orders.brandid ) ) as item_guid_key9 ,(select guid_key from tb_item_reference item where item.item_ref=orders.item_ref10 and (item.brandid=orders.brandid ) ) as item_guid_key10 ,(select d365itemcode from tb_item_reference item where item.item_ref=orders.item_ref1 and (item.brandid=orders.brandid ) ) as d365itemcode1 ,(select d365itemcode from tb_item_reference item where item.item_ref=orders.item_ref2 and (item.brandid=orders.brandid ) ) as d365itemcode2 ,(select d365itemcode from tb_item_reference item where item.item_ref=orders.item_ref3 and (item.brandid=orders.brandid ) ) as d365itemcode3 ,(select d365itemcode from tb_item_reference item where item.item_ref=orders.item_ref4 and (item.brandid=orders.brandid ) ) as d365itemcode4 ,(select d365itemcode from 
tb_item_reference item where item.item_ref=orders.item_ref5 and (item.brandid=orders.brandid ) ) as d365itemcode5 ,(select d365itemcode from tb_item_reference item where item.item_ref=orders.item_ref6 and (item.brandid=orders.brandid ) ) as d365itemcode6 ,(select d365itemcode from tb_item_reference item where item.item_ref=orders.item_ref7 and (item.brandid=orders.brandid ) ) as d365itemcode7 ,(select d365itemcode from 
        tb_item_reference item where item.item_ref=orders.item_ref8 and (item.brandid=orders.brandid ) ) as d365itemcode8 ,(select d365itemcode from tb_item_reference item where item.item_ref=orders.item_ref9 and (item.brandid=orders.brandid ) ) as d365itemcode9 ,(select d365itemcode from tb_item_reference item where item.item_ref=orders.item_ref10 and (item.brandid=orders.brandid ) ) as d365itemcode10 
        FROM tb_order as orders 
        WHERE orders.order_no=?
        )orders LEFT JOIN 
        tb_content A ON A.content_key=orders.A_Content_Number
        LEFT JOIN tb_content B ON B.content_key=orders.B_Content_Number
        LEFT JOIN tb_content C ON C.content_key=orders.C_Content_Number
        ORDER BY orders.order_no,orders.num `, { replacements: [order_no], type: QueryTypes.SELECT, raw: true })
    
    console.log("OrderDetails", orderDetails)

    return orderDetails
    
}


exports.GetLocationList = async (brand_key, order_no, order_user) => {
    let erpList = await sequelize.query(`SELECT e.erp_id,e.erp_name,e.currency FROM tb_erp_name e left join tb_brand_erp_code b_e on e.erp_id=b_e.erpid where b_e.brandid=? and b_e.erp_status='Y'`, { replacements: [brand_key], type: QueryTypes.SELECT  })
    
    console.log("erpList", erpList)

    // let defaultSelected = await sequelize.query(`SELECT * FROM (SELECT LocationCode ,SeqNo FROM tb_order WHERE order_no=? AND num=1 AND IFNULL(LocationCode,'')<>'' AND IFNULL(LocationCode,'')<>'Please select' UNION ALL SELECT erp_name,LocationCode,SeqNo FROM tb_cust WHERE admin=?) A
    // ORDER BY SeqNo`, { replacements: [order_no, order_user], type: QueryTypes.SELECT, raw: true })
    
    // console.log("defaultSelected", defaultSelected)

    // let result = 

    erpList.map(item => {
        item.default = 'N'
    })

    return erpList  

}

exports.GetPOOrderStatus = () => {
    return [
        {
        "order_status": "COMPLETE",
        "status_id": 0
        },
        {
        "order_status": "New",
        "status_id": 2
        },
        {
        "order_status": "Revised",
        "status_id": 3
        }
       ]

}

const getCustomerDetails =  async (admin) => {
    let customerDetails = await sequelize.query(
        `Select * from tb_cust where admin='${admin}'`
    )

    return customerDetails
}

const getDisableInputPercentageStatus = async (guid_key,order_user) => {

    let disableInputPercentage = await sequelize.query(
        `select DisableInputPercentage from tb_translation where 1=1 and guid_key='${guid_key}'`
    )

    return disableInputPercentage;
}

const getOrderLine = async (order_no) => {
    let count = await sequelize.query(
        `SELECT COUNT(*)+1 FROM tb_order WHERE order_no='${order_no}'`
    );

    return count;
}

const getCountryCodeForContent =  async (brandid) => {
    let countryCode = await sequelize.query(
        `
        select tc.country_code id,c_url,ti.country_code icon_country from tb_countrycode_qr tcq
        left join tb_countrycode tc on tc.guid_key=tcq.country_code_key
        left join tb_countrycode ti on ti.guid_key=tcq.icon_symbol
        where show_status='Y' and brandid='${brandid}'
        order by tcq.seqno
        `
    )

    return countryCode
}

const getAPIlink = async (order_no, order) => {
    let apiLink = await sequelize.query(
        ` 
        SELECT c.ApiLink ,a.currency FROM tb_erp_name a LEFT JOIN tb_order b ON a.erp_name = b.LocationCode LEFT JOIN tb_erp_api_module c ON a.erp_id = c.ErpId WHERE b.order_no ='" + xBean.${order_no} + "' and c.ApiModuleType='${order}'
        `
    )
}

const getOrderData = async () => {

    

    let orderData = await sequelize.query(`
    select (isnull(o.content_number,'')+' '+isnull(q.VersionNum,'')) [AW_Number], edi.IsGenericConcession, o.guid_key,Company_Code= p.group_code,Order_Number=order_no+'_'+cast(num as varchar(10)),
    Factory_PO_No=o.po_number,
    Nike_PO_No= '',
    {2}
    total_qty,
    size_matrix_type=size_matrix_type1,
    size_content=size_content1,
    delivery_addr,
    delivery_email,
    delivery_contact,
    delivery_phone,
    delivery_fax,
    delivery_post_code,
    delivery_addr2,
    delivery_addr3,
    delivery_cpyname,
    delivery_country,
    delivery_city,invoice_cpyname,invoice_addr,invoice_email,invoice_contact,invoice_phone,invoice_fax,invoice_addr2
    ,invoice_addr3 ,
    Content_Number=q.A_Content_Number,
    Care_Number=q.B_Content_Number,
    Icon_Number=q.C_Content_Number,
    Line_Number='',
    Order_Seq_Zoned= '',
    Expected_Delivery_Date=o.order_expdate
    from {0} o left join tb_brand b on o.brandid=b.guid_key left join tb_EdiConfig edi on b.guid_key = edi.BrandId left join tb_company p on b.company_key = p.guid_key LEFT JOIN {1} q ON o.content_number=q.Z_Content_Number where
    order_no=@order_no order by o.num", dyTbBean.TbOrder, dyTbBean.TbZContent, itemSql)
    `)
}

// send email to ntwariegide2@gmail.com

exports.SendEmail = async (email, subject, body) => {
     // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass, // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Fred Foo 👻" <foo@example.com>', // sender address
    to: "bar@example.com, baz@example.com", // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: "<b>Hello world?</b>", // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  
}
 
exports.SavePOOrder = async (body) => {
    
    let customerDetails = await getCustomerDetails(body.order_user)

    // check if order_status is Confirm
    if(body.order_status === 'Confirm') body.order_status = new Date().toISOString()

    //--If the field ”DisableInputPercentage“ is Y indicates the unfilled percentage.
    let disableInputPercentage = await getDisableInputPercentageStatus(body.guid_key, body.order_user)

    // SAVE POorder

    let saveorder = await sequelize.query(`
    insert into tb_order(guid_key, order_no, num, po_number, factory_code, order_expdate, invoice_cpyname, invoice_addr, invoice_email, invoice_contact, invoice_phone, invoice_fax, delivery_cpyname, delivery_addr, delivery_email, delivery_contact, delivery_phone, delivery_fax
        , style_number, coo, season_code, colour, gender, remark, content_number, size_matrix_type1, size_content1, total_qty, artwork_number, brandid, order_user, order_date,is_draft
        , A_Content_Number, B_Content_Number, C_Content_Number, invoice_addr2, invoice_addr3, delivery_city, delivery_country, delivery_post_code, delivery_addr2,delivery_addr3,size_pointer,LocationCode
        ,SumPrice,ShrinkagePorcentaje,DraftOrderEmail,SizeTableImg,DefaultSizeContent,IsWastage
        ,CustomerId,InvoiceAddressId,InvoiceContactId,DeliveryAddressId,DeliveryContactId)
        values( '${body.guid_key}', '${body.order_no}', '${body.num}', '${body.po_number}', '${body.factory_code}', '${body.order_expdate_delivery_date}', '${body.invoice_address[0].invoice_cpyname}', '${body.invoice_address[0].invoice_addr}', '${body.invoice_address[0].invoice_email}', '${body.invoice_address[0].invoice_contact}', '${body.invoice_address[0].invoice_phone}', '${body.invoice_address[0].invoice_fax}', '${body.delivery_address[0].delivery_cpyname}', '${body.delivery_address[0].delivery_addr}', '${body.delivery_address[0].delivery_email}', '${body.delivery_address[0].delivery_contact}', '${body.delivery_address[0].delivery_phone}', '${body.delivery_address[0].delivery_fax}'
        , '${body.contents[0].style_number}', '${body.coo}', '', '', '', '${body.remark}', '${body.contents[0].content_number}', '${body.po_size_tables[0].size_matrix_type}', '${body.po_size_tables[0].size_content}', ${body.total_qty}, '', '', '${body.order_user}', '${body.order_date}','N', '${body.contents[0].content_number}', '${body.contents[0].content_number}', '${body.contents[0].content_number}', '${body.invoice_address[0].invoice_addr2}', '${body.invoice_address[0].invoice_addr3}', '${body.delivery_address[0].delivery_city}', '${body.delivery_address[0].delivery_country}', '${body.delivery_address[0].delivery_post_code}', '${body.delivery_address[0].delivery_addr2}', '${body.delivery_address[0].delivery_addr3}',null,'${body.location_code}',${body.SumPrice},null,'${body.draft_order_email}',null,null,'${body.is_wastage}','','${body.invoice_address[0].invoice_address_id}','${body.invoice_address[0].invoice_contact_id}','${body.delivery_address[0].delivery_address_id}','${body.delivery_address[0].delivery_contact_id}')
    `)




    // save poorder size table

    const sizetable = await sequelize.query(`
    insert into tb_asosorderposize(GuidKey, OrderKey, BrandId, EdiOrderNo, ConsolidatedId, SizeContent,SendDate, CreateDate)
values('${body.guid_key}', '${body.order_key}', '${body.brand_key}', '${body.po_size_tables[0].edi_order_no}', '${body.po_size_tables[0].consolidated_id}', '${body.po_size_tables[0].size_content}','${body.po_size_tables[0].send_date}', '${body.po_size_tables[0].create_date}');
`)


    // Return order line by order no.

    const orderLine = await getOrderLine(body.order_no);
    console.log('order line : ', await orderLine)

    //return country codes for content

    const countryCode = await getCountryCodeForContent(body.brandid);

    // Get the API link of order for the location code selected for the current order.

    const apiLink = await getAPIlink(body.order_no, body.order_no);

    //Get the order data

    const orderData = await sequelize.query(`
    Select * from tb_order where order_no='${body.order_no}'
    `)

    //  item ref setting

    const itemRefSetting = await sequelize.query(`select layout_file,guid_key
    ,is_nonsize
    ,wastage=case when isnull(hasqr)='Y' then ROUND(CAST(isnull(wastage) as float)/100, 2) else 0 end
    ,enablePrint
    ,EnableDPPDFBySize
    ,case when isnull(hasqr)='Y' then 'QR' when isnull(EnableArtworkBarcode)='Y' then 'Barcode' else 'Normal' end as ArtworkItemType,ArtworkLabel
    from tb_item_reference where 1=1
    and item_ref='${body.item_ref[0].item_ref}';
    `)

    // size data for order

    const sizeData = await sequelize.query(`
    select * from tb_order_sizetable_dtl where order_key='${body.po_size_tables[0].guid_key}' order by id
    `)

    

    // update order api status

    const update = await sequelize.query(`
    Update tb_order set OrderApiStatus='Y' where guid_key='${body.guid_key}'
    `);

    // Edi status updated

    const ediStatusUpdated = await sequelize.query(
        `
        UPDATE 
            tb_order_edi_Temp2 A INNER JOIN tb_asosorderposize B ON A.guid_key=B.OrderKey AND A.order_no='${body.order_no}'  
        SET 
            status=0,ConfirmDate=NOW()
        WHERE
            A.order_no=B.EdiOrderNo AND A.Consolidated_ID=B.ConsolidatedId;
        `
    )


    //  Check that total page no. of artwork order, when the total page no. is null then updated the xml status is N, otherwise, updated it to Y


    const checkArtworkPageNo = await sequelize.query(`
    UPDATE tb_order SET AwXmlStatus='Y' WHERE order_no='${body.order_no}' and 
    (SELECT cun FROM ( SELECT count(B.Total_Page_No) cun FROM  tb_order as A LEFT JOIN tb_auto_artwork B ON A.guid_key=B.Order_Key WHERE A.order_no='${body.order_no}' and B.Total_Page_No is not null) AS N )>0;
    `)

    // send order email for confirm order if order status is confirm. reference to the SendArtworkEmail API

    return body;


}

exports.GetPOOrderList = async(order_user, brand_key, order_date_from, order_date_to, order_status, factory_code, consolidated_id, order_no) => {
    let orderList = await sequelize.query(`SELECT MAX(guid_key) guid_key, order_no, brandid as brand_key,SUM(CAST(total_qty as SIGNED)) AS total_qty,consolidated_id,supplier_code,factory_code,CAST(Send_Date as DATE) send_date,CASE status WHEN '0' THEN MAX(ConfirmDate) ELSE status_date END status_date,status,optionId=max(optionId), Product_Description=max(Product_Description), PoLastUpdateTime=max(PoLastUpdateTime) FROM tb_order_edi_temp  WHERE 1=1 and Factory_Code like '${factory_code}' and Consolidated_ID like '${consolidated_id}' and Send_Date >=CAST('${order_date_from}' as DATE) and Send_Date <=CAST('${order_date_to}' as DATE) and status ='${order_status}' and (order_no like '${order_no}' or Consolidated_ID IN (SELECT Consolidated_ID FROM tb_order_edi_temp WHERE order_no LIKE '${order_no}'))`)

    // await sequelize.query('select * from tb_order')
    
    // console.log('orderList', orderList[0])

    return orderList
}



exports.GetPOSizeTableTempList = async(brand_key, order_key, is_po_order_temp) => {
    let tb = await sequelize.query(`SELECT brand_key=tb_order_edi.guid_key,A.id, B.TbContent,B.TbContentDtl,B.TbCareDtl,B.TbIconDtl,B.TbZContent,B.TbOrder,B.TbOrderEDI,B.TbOrderEDITemp
    ,B.qr_tbOrderPo,B.qr_tbItemNo,B.sp_Qr,B.TbOrderSizeTableDtl,C.TbTranslation,C.TbSysIcon FROM tb_brand A LEFT JOIN tb_DynamicTable B ON A.guid_key=B.ForeignKey AND B.SourceType='Brand' LEFT JOIN tb_DynamicTable C ON A.translation_code=C.ForeignKey AND C.SourceType='Trans'WHERE A.guid_key=?`, brand_key)
    
    let sizeTableTempList = await sequelize.query(`select group_type=A.OptionId+','+ A.size_matrix_type1,A.order_no,option_id=A.OptionId,production_description=A Product_Description,supplier_code=A.Supplier_Code,factory_code=A.factory_code,size_matrix_type=A.size_matrix_type1, guid_key=B.GuidKey,order_key=B.OrderKey
    ,brand_key=B.BrandId,edi_order_no=B.EdiOrderNo,consolidated_id=B.ConsolidatedId,size_content=B.SizeContent,send_date=B.SendDate,create_date=B.CreateDate,B.total_qty1,B.total_qty2,B.total_qty3,B.total_qty4,B.total_qty5,B.total_qty6,B.total_qty7, B.total_qty8, B.total_qty9,B.total_qty10 from tb_AsosOrderPoSize B left join ${tb[0]?.TbOrderEDITemp}A on A.guid_key=B.OrderKey where A.order_no='?'`, order_key)


    return sizeTableTempList;
}

exports.GetMinExpectedDeliveryDate = async(brand_guid_key, item_refs, erp_id) => {
//     let minExpectedDeliveryDate = await sequelize.query(`
//     SELECT leadtime=CASE b.itemstatus WHEN '--Select--' then MAX(a.leadtime) WHEN 'Seven' THEN CASE WHEN MAX(a.leadtime)>7 THEN MAX(a.leadtime) ELSE 7 END
//    WHEN 'Fourteen'  THEN  CASE WHEN MAX(a.leadtime)>14 THEN MAX(a.leadtime) ELSE 14 END ELSE MAX(a.leadtime) end as leadtime FROM tb_item_reference_erp a  LEFT JOIN  tb_item_reference b  on  a.item_reference_guid_key = b.guid_key WHERE b.item_ref IN (:item_refs) AND a.erp_id =:erp_id AND  (b.brandid=:brand_guid_key)`, { replacements: { item_refs: [...item_refs], erp_id: erp_id, brand_guid_key: brand_guid_key } })
    
    let minExpectedDeliveryDate = [
    {
        lead_time: 0,
        min_delivery_date: "2022-04-21"
    }
    
    ]
    
   return minExpectedDeliveryDate
}

