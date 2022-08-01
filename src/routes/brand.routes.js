/**
 * @author: ntwari egide
 * @description: brand routing module
 */

const express = require('express')
const { GetPOBrandListByClient } = require('../microservices/brand.microservice')
const { getDynamicFieldListValidation, getPOBrandListByClientValidation, getWastageListValidation } = require('../validations/brand.validate')
const {getContentNumberSettingValidaton} = require('../validations/contact.validate')
const router = express.Router()

router.route('/')
    .get( (req, res) => {
        console.log("reached here ......" , req)
    })

/**
 * @swagger
 * tags:
 *  name: Brands
 *  description: po brands apis are here
 */


    router.route('/GetContentNumberSetting')
/**
 * @swagger
 * path:
 * /api/Contentnumber/GetContentNumberSetting:
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
 *                 error: 
 *                   example: Fail
 *                 error_description: 
 *                   example: sqlserver connection timeout    
*/    
    .get( getContentNumberSettingValidaton, (req,res) => {

        const validationResponse = validationResponse(req)

        if (Object.entries(validationResponse.errors).length != 0) return res.send({ message: 'Check the parameter passed', erorrs: errors.array() })
        
        GetPOBrandListByClient(req.params.order_user)

        res.json({
            message: 'Return Content Number Setting of Brand',
            data: req.params
        })

    })



router.route('/GetPOBrandListByClient')
    .get( getPOBrandListByClientValidation, (req,res) => {

        const response = validationResponse(req)

        if( Object.entries( response.errors).length != 0 ) return res.send({ message: 'Check the parameter passed', erorrs: response.array()})

        res.json({
            message: 'Return the po brand list.',
            data: req.params
        })
        
    })

router.route('/GetWastageList')
    .get( getWastageListValidation, (req,res) => {
        
        const results = validationResponse(req);

        if( Object.entries(results.errors).length != 0 ) return res.send({ message: 'Check the parameters passed',errors: results.array()})

        res.json ({
            message: 'Return wastage list.',
            data: req.params
        })

    })

module.exports = router