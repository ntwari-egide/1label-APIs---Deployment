/**
 * @author: ntwari egide
 * @description: orders routing  module
 */

const express = require('express');
const { validationResult } = require('express-validator');
const { body } = require('express-validator');
const { addPOOrder, GetDynamicFieldList, GetLocationList, GetPOOrderList, GetPOSizeTableTempList } = require('../microservices/order.microservice');
const { getApi } = require('../controller');
const { getDynamicFieldListValidation } = require('../validations/brand.validate');
const router = express.Router()
const {addPOOrderValidation, getMinExpectedDeliveryDateValidation, getOrderDetailValidation, getIconSequenceValidation, getPOOrderListValidation, getPOSizeTableTempListValidation, getLocationListValidation, savePOOrderValidation} = require('../validations/orders.validate')



router.route('/')
    .get( (req,res) => {
        console.log('reached out here .....');
        res.send('Welcome to orders endpoints')
    })

/**
 * @swagger
 * tags:
 *  name: Orders
 *  description: po orders apis are here
 */
router.route('/AddPOOrder')

/**
 * @swagger
 *  path:
 * /api/Order/AddPOOrder:
 *   post:
 *     summary: Check PO order and combination.
 *     description: Combine po orders of same option id and size matrix type, and sumarrize total qty of the same size for size content.
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               brand_key:
 *                 type: string
 *                 description: brand key
 *                 example: e88d9b8e-44ed-4fc2-b9a0-aef31ca0ccf3
 *               order_user:
 *                 type: string
 *                 description: Login ID
 *                 example: innoa
 *               order_keys:
 *                 type: object
 *                 example: ["c13205a2-3c86-4e15-80b0-2aedbf0e8f04","7037c6a3-6ad0-42bb-81c5-fce8e7284f85"]
 *     responses:
 *       200:
 *         description: Check order passed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       status:
 *                         type: string
 *                         description: status
 *                         example: Success
 *                       status_description:
 *                         type: string
 *                         description: status description
 *                         example: dbb98fac-d44a-4e5f-add3-bfec01ef5499
 */
    .post( addPOOrderValidation, (req,res) => {

        const response = validationResult(req)

        if( Object.entries(response.errors).length !==0 ) return res.json({ message: 'Check your request, validation failed', errors: response.array()})

        addPOOrder(req.body.brand_key, req.body.order_user, req.body.order_keys)
             
                  
        res.json({
            message: 'Check PO order and combination.'
        })
    })

router.route('/GetMinExpectedDeliveryDate/brand-guid-key/:brand_guid_key/item-refs/:item_refs/erp-id/:erp_id')
    /**
 * @swagger
 * path:
 * /api/Order/GetMinExpectedDeliveryDate/brand-guid-key/{brand_guid_key}/item-refs/{item_refs}/erp-id/{erp_id}:
 *   get:
 *     summary: Return lead time of expected Delivery date.
 *     description: Return lead time of expected Delivery date.
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: brand_guid_key
 *         description: Brand primary Key
 *         schema:
 *           type: string
 *         required: true
 * 
 *       - in: path
 *         name: item_refs
 *         description: Item refs
 *         schema:
 *           type: string
 *         required: true
 * 
 *       - in: path
 *         name: erp_id
 *         description: Erp id
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
 *                   lead_time:
 *                     type: string
 *                     example: 4
 *                   min_delivery_date:
 *                     type: string
 *                     example: 2022-04-26
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
    .get(getMinExpectedDeliveryDateValidation, (req,res) => {

        const response = validationResult(req)

        if( Object.entries(response.errors).length !==0 ) return res.json({ message: 'Check your request, validation failed', errors: response.array()})

        res.json({
            message: 'Return lead time of expected Delivery date',
            data: req.body
        })
    })

router.route('/GetOrderDetail/brand-key/:brand_key/order-user/:order_user/order-no/:order_no/is-po-order-tem/:is_po_order_tem')
/**
 * @swagger
 * path:
 * /api/orders/GetOrderDetail/brand-key/{brand_key}/order-user/{order_user}/order-no/{order_no}/is-po-order-tem/{is_po_order_tem}:
 *   get:
 *     summary: Return order detail
 *     description: Return order detai
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: brand_key
 *         description: Brand Key
 *         schema:
 *           type: string
 *         required: true
 * 
 *       - in: path
 *         name: order_user
 *         description: Login ID
 *         schema:
 *           type: string
 *         required: true
 * 
 *       - in: path
 *         name: order_no
 *         description: Multiple PO order keys
 *         schema:
 *           type: string
 *         required: true
 * 
 *       - in: path
 *         name: is_po_order_temp
 *         description: 
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
 *                     type: string
 *                     example: a8b80fca-c346-4f99-ba2b-8dcb6b9db131
 *                   custom_number:
 *                     type: string
 *                     example: J2-BC-2016050002
 *                   style_number:
 *                     type: string
 *                     example: J2-BC-2016050002
 *                   user_id: 
 *                     example: innoa
 * 
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
 *                 status: 
 *                   example: Fail
 *                 status_description: 
 *                   example: error   
*/  
    .get( getOrderDetailValidation, (req,res) => {


        const response = validationResult(req)

        if( Object.entries(response.errors).length !==0 ) return res.json({ message: 'Check your request, validation failed', errors: response.array()})

        res.json({
            message: 'Return order detail. Client double-click the order in the order listing go to the order form and show the order details',
            data: req.body
        })

    })

router.route('/GetPOOrderList/order-user/:order_user/brand-key/:brand_key/order-date-from/:order_date_from/order-date-to/:order_date_to/order-status/:order_status/factory-code/:factory_code/consolidated-id/:consolidated_id/order-no/:order_no')
    /**
 * @swagger
 * path:
 * /api/Order/GetPOOrderList/order-user/{order_user}/brand-key/{brand_key}/order-date-from/{order_date_from}/order-date-to/{order_date_to}/order-status/{order_status}/factory-code/{factory_code}/consolidated-id/{consolidated_id}/order-no/{order_no}:
 *   get:
 *     summary: Return PO Order List
 *     description: Return PO Order List
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: order_user
 *         description: Order user
 *         schema:
 *           type: string
 *         required: true
 * 
 *       - in: path
 *         name: brand_key
 *         description: Brand key
 *         schema:
 *           type: string
 *         required: true
 * 
 *       - in: path
 *         name: order_date_from
 *         description: Order date from
 *         schema:
 *           type: string
 * 
 *       - in: path
 *         name: order_date_to
 *         description: Order date to
 *         schema:
 *           type: string
 * 
 *       - in: path
 *         name: order_status
 *         description:  porder status
 *         schema:
 *           type: string
 * 
 *       - in: path
 *         name: factory_code
 *         description: factory code
 *         schema:
 *           type: string
 * 
 *       - in: path
 *         name: consolidated_id
 *         description: consilidated id
 *         schema:
 *           type: string
 * 
 *       - in: path
 *         name: order_no
 *         description: Order no
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: PO Order list
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   order_user:
 *                     example: innoa
 *                     type: string
 *                   guid_key:
 *                     example: f7e48079-e8d5-4e7e-9c41-2a71a89db85a
 *                     type: string
 *                   order_no:
 *                     example: Wholesale010
 *                     type: string
 *                   brand_key:
 *                     example: e88d9b8e-44ed-4fc2-b9a0-aef31ca0ccf3
 *                     type: string
 *                  
 *                   total_qty:
 *                     example: 8
 *                     type: string
 *                  
 *                   consolidated_id:
 *                     type: string
 *                     example: 22332639
 *                   factory_code:
 *                     type: string
 *                     example: 9999
 *                   supplier_code:
 *                     example: 1100002473
 *                     type: string
 *                  
 *                   send_date:
 *                     type: string
 *                     example: 4/11/2022 4:01:07 PM
 * 
 *                   status_date:
 *                     type: string
 *                     example: 5/3/2022 12:00:00 AM
 *                   order_status:
 *                     type: string
 *                     example: Confirm
 *                   option_id:
 *                     type: string
 *                     example: 101346830
 *                   production_description:
 *                     type: string
 *                     example: Outerwear
 *                   po_last_update_time:
 *                     type: string
 *                     example: 06/04/2022
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

    .get( getPOOrderListValidation, async(req,res) => {

        const response = validationResult(req)

        if (Object.entries(response.errors).length !== 0) return res.json({ message: 'Check your request, validation failed', errors: response.array() })
        
        let orderList = await GetPOOrderList(req.params.order_user, req.params.brand_key, req.params.order_date_from, req.params.order_date_to, req.params.order_status, req.params.factory_code, req.params.consolidated_id, req.params.order_no)

        console.log('orderList', orderList)

        res.json({
            message: 'Return po order list',
            data: orderList
        })
        
    })

    router.route('/GetPOOrderStatus')
    /**
     * @swagger
     * path:
     * /api/Order/GetPOOrderStatus:
     *   get:
     *     summary: Return order detail
     *     description: Return order detai
     *     tags: [Orders]
     *     responses:
     *       200:
     *         description: Success
     *              
     *       500:
     *         description: Fail Return
     *         content:
     *           application/json:
     *             schema: 
     *               type: object
     *               properties:
     *                 status: 
     *                   example: Fail
     *                 status_description: 
     *                   example: error   
    */  
        .get((req, res) => {
            let status = [
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
               
            res.send({data : status})
        })

/**
 * @swagger
 * path:
 * /api/Order/GetPOSizeTableTempList/brand-key/{brand_key}/order-key/{order_key}/is-po-order-temp/{is_po_order_temp}:
 *   get:
 *     summary: Return order detail
 *     description: Return order detai
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: brand_key
 *         description: Brand Key
 *         schema:
 *           type: string
 *         required: true
 * 
 *       - in: path
 *         name: order_key
 *         description: Order key
 *         schema:
 *           type: string
 *         required: true
 * 
 *       - in: path
 *         name: is_po_order_temp
 *         description: is_po_order_temp
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
 *                     type: string
 *                     example: a8b80fca-c346-4f99-ba2b-8dcb6b9db131
 *                   custom_number:
 *                     type: string
 *                     example: J2-BC-2016050002
 *                   style_number:
 *                     type: string
 *                     example: J2-BC-2016050002
 *                   user_id: 
 *                     example: innoa
 * 
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
 *                 status: 
 *                   example: Fail
 *                 status_description: 
 *                   example: error   
*/  

router.route( '/GetPOSizeTableTempList/brand-key/:brand_key/order-key/:order_key/is-po-order-temp/:is_po_order_temp' )
    .get(getPOSizeTableTempListValidation, (req,res) => {

        const response = validationResult(req)

        if (Object.entries(response.errors).length !== 0) return res.json({ message: 'Check your request, validation failed', errors: response.array() })
        
        let sizeTableTempList = GetPOSizeTableTempList(req.params.brand_key, req.params.order_key, req.params.is_po_order_temp)

        res.json({
            message: 'Return multiple po size table list',
            data: sizeTableTempList
        })
        
    })

router.route('/GetLocationList/brand-key/:brand_key/order-no/:order_no/order-user/:order_user')
    /**
 * @swagger
 * path:
 * /api/Order/GetLocationList/brand-key/{brand_key}/order-no/{order_no}/order-user/{order_user}:
 *   get:
 *     summary: Return Dynamic fields of Brand, limit 30 fields
 *     description: Return Dynamic fields of Brand, limit 30 fields
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: brand_key
 *         description: Brand primary Key
 *         schema:
 *           type: string
 *         required: true
 * 
 *       - in: path
 *         name: order_no
 *         description: Order no
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
 * 

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
 *                    erp_id:
 *                      example: 8
 *                    erp_name:
 *                      example: HK
 *                    currency:
 *                      example: C-HK
 *                    default:
 *                      example: N
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
    .get( getLocationListValidation, (req,res) => {
        const response = validationResult(req)

        if (Object.entries(response.errors).length !== 0) return res.json({ message: 'Check your request, validation failed', errors: response.array() })
        
        let locationList = GetLocationList(req.params.brand_key, req.params.order_no, req.params.order_user)

        res.json({
            message: 'Return ERP List of brand',
            data: locationList
        })
        
    })


router.route('/GetDynamicFieldList/brand-key/:brand_key/show-status/:show_status/order-user/:order_user/order-no/:order_no/is-po-order-tem/:is_po_order_temp')
    /**
 * @swagger
 * path:
 * /api/Order/GetDynamicFieldList/brand-key/{brand_key}/show-status/{show_status}/order-user/{order_user}/order-no/{order_no}/is-po-order-tem/{is_po_order_temp}:
 *   get:
 *     summary: Return Dynamic fields of Brand, limit 30 fields
 *     description: Return Dynamic fields of Brand, limit 30 fields
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: brand_key
 *         description: Brand primary Key
 *         schema:
 *           type: string
 *         required: true
 * 
 *       - in: path
 *         name: show_status
 *         description: Y,N, empty
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
 * 
 *       - in: path
 *         name: order_no
 *         description: Order no
 *         schema:
 *           type: string
 *         required: true
 * 
 *       - in: path
 *         name: is_po_order_temp
 *         description: Distinguish po order
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
    .get(getDynamicFieldListValidation, (req, res) => {
        
        console.log('in controller', req.params)
        const response = validationResult(req)
        
        if (Object.entries(response.errors).length != 0) return res.send({ message: 'Check the parameter passed', erorrs: response.array() })
        
        let dynamicFieldList = GetDynamicFieldList(req.params.brand_key, req.params.show_status, req.params.order_user, req.params.order_no, req.params.is_po_order_temp)

        res.json({
            message: 'Return Dynamic fields of Brand, limit 30 fields',
            data: dynamicFieldList
        })
    
    })

router.route('/SavepoOrder')
/**
 * @swagger
 *  path:
 * /api/Order/SavepoOrder:
 *   get:
 *     summary: Save Order
 *     description: Save Order
 *     parameters:
 *       - in: path
 *         name: order_user
 *         description: Login ID
 *         schema:
 *           type: string
 *         required: true
 *     tags: [Orders]
 *     responses:
 *       201:
 *         description: Check order passed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: array
 *                     properties:
 *                       status:
 *                         type: string
 *                         description: status
 *                         example: Success
 *                       status_description:
 *                         type: string
 *                         description: status description
 *                         example: dbb98fac-d44a-4e5f-add3-bfec01ef5499
 */
    .post( savePOOrderValidation, (req,res) => {

        const response = validationResult(req)

        if( Object.entries(response.errors).length !==0 ) return res.json({ message: 'Check your request, validation failed', errors: response.array()})

        res.json({
            message: 'Save Order',
            data: req.body
        })
    })

    .get( (req, res) => {
        async.parallel(
            {
              task1: async (callback) => {
                let result = await getApi("http://localhost:9998/items") 
                callback(null, result);
              },
              task2: async (callback) => {
                let result = await getApi("http://localhost:9999/customers")
                callback(null, result);
              },
            },
            (err, result) => {
              //console.log(result);
              let d = {
                d1: JSON.stringify(result.task1.data),
                d2: JSON.stringify(result.task2.data),
              };
              res.status(200).send(d);
            }
          );
    })

module.exports = router