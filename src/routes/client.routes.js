/**
 * @author: ntwari egide
 * @description: clients routing module
 */

const express = require('express')
const { validationResult } = require('express-validator')
const { GetClientDetail } = require('../microservices/client.microservice')
const { getClientDetailsValidation, getClientAddressDetailValidation, getClientAddressListValidation } = require('../validations/order-user.validate')
const router = express.Router()

router.route('/')
    .get((req, res) => {
        res.send("reached here ......" )
    })


/**
 * @swagger
 * tags:
 *  name: Clients
 *  description: po orders apis are here
 */

router.route('/GetClientDetail/:order_user')

/**
 * @swagger
 *  path:
 * /api/Client/GetClientDetail/{order_user}:
 *   get:
 *     summary: Return Client Detail.
 *     description: Return Client Detail.
 *     parameters:
 *       - in: path
 *         name: order_user
 *         description: Login ID
 *         schema:
 *           type: string
 *         required: true
 *     tags: [Clients]
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

    .get( getClientDetailsValidation, async(req, res) => {

        const errors = validationResult(req)
        
        if( Object.entries(errors.errors).length != 0 ) return res.send({ message: 'Check the parameter passed', erorrs: errors.array()})

        let clientDetail = await GetClientDetail(req.params.order_user)
        res.json({
            message: 'Return Client Detail...',
            data: clientDetail
        })
    })

router.route('/GetClientAddressDetail/:order_user/address-type/:address_type/address-id/:address_id' )
    .get( getClientAddressDetailValidation, (req,res) => {

        const errors = validationResult(req)
        
        if( Object.entries(errors.errors).length != 0 ) return res.send({ message: 'Check the parameter passed', erorrs: errors.array()})

        res.json({
            message: 'Return invoice/delivery/contact details detail...',
            data: req.params
        })
    })

router.route('/GetClientAddressList/:order_user/address-type/:address_type' )
    .get( getClientAddressListValidation, (req,res) => {

        const errors = validationResult(req)
        
        if( Object.entries(errors.errors).length != 0 ) return res.send({ message: 'Check the parameter passed', erorrs: errors.array()})

        res.json({
            message: 'Return client invoice / delivery / contact address list...',
            data: req.params
        })

    })


module.exports = router