/**
 * @author: ntwari egide
 * @description: content number routing module
 */

const express = require('express')
const {  getContentNumberListValidation,getContentNumberDetailValidation, getIconSequenceValidation, matchMultiContentNumberValidation } = require('../validations/contact.validate')

const router = express.Router()

router.route('/')
    .get( (req, res) => {
        console.log("reached here ......" , req)
    })

/**
 * @swagger
 * tags:
 *  name: ContentNumber
 *  description: content number apis are here
 */

router.route("/GetContentNumberDetail/brand-key/:brand_key/content-number-key/:content_number_key/order-user/:order_user/style-number/:style_number")
/**
 * @swagger
 * path:
 * /api/Contentnumber/GetContentNumberDetail/brand-key/{brand_key}/content-number-key/{content_number_key/order-user/{order_user}/style-number/{style_number}:
 *   get:
 *     summary: Return Content Number details
 *     description: Return Content Number detail, including content,care,icon,default content
 *     tags: [ContentNumber]
 *     parameters:
 *       - in: path
 *         name: brand_key
 *         description: Brand Key
 *         schema:
 *           type: string
 *         required: true
 * 
 *       - in: path
 *         name: content_number_key
 *         description: Content Number Key
 *         schema:
 *           type: string
 *         required: true
 * 
 *       - in: path
 *         name: style_number
 *         description: content number
 *         schema:
 *           type: string
 *         required: true
 * 
 *       - in: path
 *         name: order_user
 *         description: Login id
 *         schema:
 *           type: string
 *         required: true  
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: 
 *                   type: string
 *                   example: Return Content Number detail, including content,care,icon,default content
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       brandKey 
 *                      
 *              
 *       500:
 *         description: Fail Return
 *         content:
 *           application/json:
 *             schema: 
 *               type: object
 *               example:
 *                 error: Fail
 *                 error_description: sqlserver connection timeout   
*/
    .get(getContentNumberDetailValidation, (req,res) => {

        const validationResponse = validationResponse(req)

        if(Object.entries(validationResponse.errors).length !=0 ) return res.send({ message: 'Check the parameter passed', erorrs: errors.array()})

        res.json({
            message: 'Return Content Number detail, including content,care,icon,default content',
            data: req.params
        })
    })

router.route('/GetContentNumberList/brand-key/:brand_key/content-group/:content_group/query-str/:query_str/order-user/:order_user')
    /**
 * @swagger
 * path:
 * /api/Contentnumber/GetContentNumberList/brand-key/{brand_key}/content-group/{content_group}/query-str/{query_str}/order-user/{order_user}:
 *   get:
 *     summary: Return Content Number List
 *     description: Return Content Number List
 *     tags: [ContentNumber]
 *     parameters:
 *       - in: path
 *         name: brand_key
 *         description: Brand Key
 *         schema:
 *           type: string
 *         required: true
 * 
 *       - in: path
 *         name: content_group
 *         description: ABC,A,AB,C
 *         schema:
 *           type: string
 *         required: true
 * 
 *       - in: path
 *         name: query_str
 *         description: search value
 *         schema:
 *           type: string
 *         required: true
 * 
 *       - in: path
 *         name: order_user
 *         description: Login id
 *         schema:
 *           type: string
 *         required: true  
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   guid_key:
 *                     example: C935452C-830A-455D-B563-117FAF00BF59
 *                   custom_number:
 *                     example: J2-BC-2016050002
 *                   style_number:
 *                     example: J2-BC-2016050002
 *                   user_id:
 *                     example: innoa
 *               
 *              
 *       500:
 *         description: Fail Return
 *         content:
 *           application/json:
 *             schema: 
 *               type: object
 *               example:
 *                 error: Fail
 *                 error_description: sqlserver connection timeout   
*/
   
    .get( getContentNumberListValidation, (req,res) => {

        const validationResponse = validationResponse(req)

        if(Object.entries(validationResponse.errors).length !=0 ) return res.send({ message: 'Check the parameter passed', erorrs: errors.array()})

        res.json({
            message: 'Return Content Number List',
            data: req.params
        })
    })


router.route('/GetIconSequence/brand-key/:brand_key/icon-group/:icon_group/icon-key/:icon_key')
    /**
 * @swagger
 * path:
 * /api/Contentnumber/GetIconSequence/brand-key/{brand_key}/icon-group/{icon_group}/icon-key/{icon_key}:
 *   get:
 *     summary: Return Content Number List
 *     description: Return Content Number List
 *     tags: [ContentNumber]
 *     parameters:
 *       - in: path
 *         name: brand_key
 *         description: Brand Key
 *         schema:
 *           type: string
 *         required: true
 * 
 *       - in: path
 *         name: icon_group
 *         description: A- Wash icon, B- footwear icon
 *         schema:
 *           type: string
 *         required: true
 * 
 *       - in: path
 *         name: icon_key
 *         description: content number key
 *         schema:
 *           type: string
 *         required: true
 *  
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   sys_icon_key:
 *                     type: string
 *                     example: 
 *                   sys_icon_name:
 *                     type: string
 *                     example: Wash
 *                   en_descr:
 *                     type: string
 *                     example: 1
 *                   seq_no: 
 *                     type: string
 *                     example: 1
 *                   icon_symbol:
 *                     type: string
 *                   icon_file:
 *                     type: string
 * 
 *               
 *              
 *       500:
 *         description: Fail Return
 *         content:
 *           application/json:
 *             schema: 
 *               type: object
 *               properties:
 *                 error: 
 *                   example: Fail
 *                 error_description: 
 *                   example: sqlserver connection timeout    
*/   
    .get( getIconSequenceValidation, (req,res) => {
        const validationResponse = validationResponse(req)

        if(Object.entries(validationResponse.errors).length !=0 ) return res.send({ message: 'Check the parameter passed', erorrs: errors.array()})

        res.json({
            message: 'Return wash / Footwear Icon sequence',
            data: req.params
        })
        
    })

router.route('/MatchMultiContentNumber/brand-key/:brand_key?/order-user/:order_user?/content-group/:content_group?/content/part-key?/:part_key?/cont-key/:cont_key?/percentage/:percentage?/seqno/:seqno1?/default-content/cont-key/:cont_key1?/seqno/:seqno2?/care/care-key/:care_key?/seqno/:seqno2/icon/icon-key/:icon_key?/icon-type/:icon_type_id?/seqno/:seqno3?')
    .get( matchMultiContentNumberValidation, (req,res) => {

        const validationResponse = validationResponse(req)

        if(Object.entries(validationResponse.errors).length !=0 ) return res.send({ message: 'Check the parameter passed', erorrs: errors.array()})

        res.json({
            message: 'Return Content number & care number',
            data: req.params
        })
        
    })

module.exports = router
