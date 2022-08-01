/**
 * @author: ntwari egide
 * @description: translation routing module
 */

const express = require('express')
const { getCountryTranslationListValidation, getTranslationListValidation } = require('../validations/translation.validate')
const router = express.Router()

router.route('/')
    .get( (req, res) => {
        console.log("reached here ......" , req)
    })

/**
 * @swagger
 * tags:
 *   name: Translations
 *   description: translation apis here
 */

router.route('/GetCountryTranslationList/brand-key/:brand_key/page-type/:page_type/query-str/:query_str')
/**
 * @swagger
 * path:
 * /api/Translation/GetCountryTranslationList/brand-key/{brand_key}/page-type/{page_type}/query-str/{query_str}:
 *   get:
 *     summary: Return country list
 *     description: Return country list
 *     tags: [Translations]
 *     parameters:
 *       - in: path
 *         name: brand_key
 *         description: Brand Key
 *         schema:
 *           type: string
 *         required: true
 * 
 *       - in: path
 *         name: page_type
 *         description: Page Type
 *         schema:
 *           type: string
 *         required: true
 * 
 *       - in: path
 *         name: query_str
 *         description: content number
 *         schema:
 *           type: string
 *         required: true
 * 
 *       - in: path
 *         name: query_str
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
 *                     example: C935452C-830A-455D-B563-117FAF00BF59
 *                   gb_translation:
 *                     type: string
 *                     example: Made in Bangladesh
 *                   page_type:
 *                     type: string
 *                     example: country
 *                   ist_percentage:
 *                     type: string
 *                     example: null
 *                   icon_symbol:
 *                     type: string
 *                     example: null
 *                   icon_file:
 *                     type: string
 *                     example: null 
 *                      
 *              
 *       500:
 *         description: Fail Return
 *         content:
 *           application/json:
 *             schema: 
 *               type: object
 *               example:
 *                 error: request timeout
 *                 error_description: sqlserver connection timeout   
*/
    .get( getCountryTranslationListValidation, (req,res) => {
        try {
            const response = validationResponse(req)

            if (Object.entries(response.errors).length != 0) return res.send({ message: 'Check the parameter passed', erorrs: errors.array() })

            res.json({
                message: 'Return country list',
                data: req.params
            })
        } catch (e) {
            return res.status(500).send({
                error: "request timeout",
                error_description: "sqlserver connection timeout"
            })
        }
    })
   
router.route('/GetDefaultContentByContentKey/brand-key/:brand_key/cont-key/:content_key/page-type/:page_type')
    /**
 * @swagger
 * path:
 * /api/Translation/GetDefaultContentByContentKey/brand-key/{brand_key}/cont-key/{cont_key}/page-type/{page_type}:
 *   get:
 *     summary: Return Content Number List
 *     description: Return Content Number List
 *     tags: [Translations]
 *     parameters:
 *       - in: path
 *         name: brand_key
 *         description: Brand Key
 *         schema:
 *           type: string
 *         required: true
 * 
 *       - in: path
 *         name: cont_key
 *         description: content key
 *         schema:
 *           type: string
 *         required: true
 * 
 *       - in: path
 *         name: page_type
 *         description: page type
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
 *                   guid_key:
 *                     type: string
 *                     example: a8b80fca-c346-4f99-ba2b-8dcb6b9db131
 *                   gb_translation:
 *                     type: string
 *                     example: Contains non-textile parts of animal origin (Content)
 *                   page_type:
 *                     type: string
 *                     example: content
 *                   ist_percentage:
 *                     type: string
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
    .get((req,res) => {

        const response = validationResponse(req)

        if( Object.entries( response.errors).length != 0 ) return res.send({ message: 'Check the parameter passed', erorrs: errors.array()})

        res.json({
            message: 'Return Default content by content',
            data: req.params
        })

    })
    
router.route('/GetTranslationList')
    .get( getTranslationListValidation, (req,res) => {
        const response = validationResponse(req)

        if( Object.entries( response.errors).length != 0 ) return res.send({ message: 'Check the parameter passed', erorrs: errors.array()})

        res.json({
            message: 'Return Part / Content / Care / Icon (wash or footwear) / Country listing',
            data: req.params
        })
        
    })

module.exports = router