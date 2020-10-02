const flash = require('express-flash')
const Order = require('../../../models/order')
const Menu = require('../../../models/menu')
const moment = require('moment')
const { deleteOne } = require('../../../models/order')
const Razorpay = require('razorpay');
const crypto = require('crypto')



//razorpay config
const instance = new Razorpay({
    key_id: 'rzp_test_045PrguGI74mB6',
    key_secret: 'GJN7VCeMJYcC7kHatPrgNdhw'
})

    

function orderController() {

    return {
        store(req, res) {
           // validate request
           const { phone, address } = req.body
           if(!phone || !address) {
               req.flash('error', 'All fields are required')
               return res.redirect('/cart')
           }

           const order = new Order({
               customerId: req.user._id,
               items: req.session.cart.items,
               phone,
               address
           })
           order.save().then(result => {
               req.flash('success', 'Order placed successfully')
               const totalPrice = req.body.totalPrice;
               
            //    delete req.session.cart
               return res.render('customers/payments', {totalPrice: totalPrice, order: result})
           }).catch(err => {
               req.flash('error', 'Something went wrong')
               return res.redirect('/cart')
           })
        },
        async index(req, res) {
            const order = await Order.find({ customerId: req.user._id},
                null,
                {sort: {'createdAt': -1}})
            res.render('customers/orders', { order: order, moment: moment })
            
        },
        async status(req, res) {
            const order = await Order.findById(req.params.id)
            if(req.user._id.toString() === order.customerId.toString()) {
                return res.render('customers/orderStatus', { order })
            } 
            return res.redirect('/')
        },
        async detailedView(req, res) {
            await Menu.findById(req.params._id).then((result) => {

                res.render('product', {item:result})
            }).catch(err => {
                return res.redirect('/')
            })
               
        },
        paymentSelect(req, res) {
            res.render('customers/payments')
        },
        razorpay(req, res) {
            const params = req.body;
            instance.orders.create(params).then((data) => {
                console.log(data);
                res.send({"sub": data, "status": "success"});

            }).catch((err) => {
                res.send({ "sub": error, "status": "failed" });
            })
        },
        razorpayVerify(req, res) {
            console.log(req.body);
            body = req.body.razorpay_order_id + "|" + req.body.razorpay_payment_id;
            
            var expectedSignature = crypto.createHmac('sha256', 'GJN7VCeMJYcC7kHatPrgNdhw')
                .update(body.toString())
                .digest('hex');
            console.log("sig" + req.body.razorpay_signature);
            console.log("sig" + expectedSignature);
            var response = { "status": "failure" }
            if (expectedSignature === req.body.razorpay_signature)
                response = { "status": "success" }
            res.send(response);

        }
    }
}

module.exports = orderController