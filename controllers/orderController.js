const Order = require('../models/Order')
const Product = require('../models/Product')
const {StatusCodes} = require('http-status-codes')
const CustomError = require('../errors')
const { checkPermissions } = require('../utils')

const fakeStripeAPI = async ({amount,currency}) => {
    const client_secret = 'someRandonValue'
    return {client_secret, amount}
}

const createOrder = async (req,res) => {
    const  {items:cartItems, tax, shippingFee } = req.body

    if (!cartItems || cartItems.length < 1) {
        throw new CustomError.BadRequestError('No cart items provided')

    }
    if (!tax || !shippingFee) {
        throw new CustomError.BadRequestError('Please provide tax and shipping fee')
    }

    let orderItems = []
    let subtotal = 0

    for (const item of cartItems) {
        const dbProduct = await Product.findOne({_id:item.product})
        if (!dbProduct) {
            throw new CustomError.NotFoundError(
                `No product with id: ${item.product}`
            )
        }
        const {name,price,image,_id} = dbProduct
        const singleOrderItem  = {
            amount:item.amount,
            name,
            price,
            image,
            product:_id,

        }
        orderItems = [...orderItems,singleOrderItem]
        subtotal += item.amount * price
    }
    const total = tax + shippingFee + subtotal

    const paymentIntent = await fakeStripeAPI({
        amount: total,
        currency: 'usd',
    })

    const order = await Order.create({
        orderItems, total, subtotal,tax, shippingFee, clientSecret:paymentIntent.client_secret, user: req.user.userId,

    })

    res.status(StatusCodes.CREATED).json({order, clientSecret:order.clientSecret})
}

const getAllOrders = async (req,res) => {
    res.send('get all orders')
}

const getSingleOrder = async (req,res) => {
    res.send('get single order')
}

const getCurrentUserOrders = async (req,res) => {
    res.send('get current user orders')
}

const updateOrder = async (req,res) => {
    res.send('update order')
}

module.exports = {
    createOrder,
    getAllOrders,
    getSingleOrder,
    getCurrentUserOrders,
    updateOrder,
}