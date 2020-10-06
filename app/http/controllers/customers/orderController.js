const flash = require('express-flash')
const Order = require('../../../models/order')
const Menu = require('../../../models/menu')
const Category = require('../../../models/category');
const moment = require('moment')
const { deleteOne, countDocuments } = require('../../../models/order')
const Razorpay = require('razorpay');
const crypto = require('crypto');
const order = require('../../../models/order');
// const order = require('../../../models/order')



//order id global variable
let orderIdPayment = '';

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
            const order = await Order.find({ customerId: req.user._id}, null, {sort: {'createdAt': -1}})
            
            if (req.xhr) {
                return res.json(order);
            } else {
                res.render('customers/orders', { order: order, moment: moment })

            }
            
        },
        async status(req, res) {
            const order = await Order.findById(req.params.id)
            
            if(req.user._id.toString() === order.customerId.toString()) {
                return res.render('customers/orderStatus', { order })
            } 
            return res.redirect('/customer/orders')
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
        postselectpay(req, res) {
            const totalPrice = req.body.totalPrice
            const orderid = req.body.id
            orderIdPayment = req.body.id;
            const paymentType = req.body.paymentSelect;
            console.log(paymentType);
            if(paymentType == 'razorpay'){
                delete req.session.cart;
                res.render('customers/razorpay', {totalPrice: totalPrice, orderid: orderid})
            } else {
                Order.updateOne({_id: req.body.id }, { $set: { paymentMethod: 'COD', paymentStatus: 'success'}}, (err) => {
                    if (err) throw err
                    req.flash('success', 'Order placed succesfully');
                    delete req.session.cart;
                    res.redirect('/customer/orders')
                })
                
            }
            
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
            // console.log(req.body);
            body = req.body.razorpay_order_id + "|" + req.body.razorpay_payment_id;
            
            var expectedSignature = crypto.createHmac('sha256', 'GJN7VCeMJYcC7kHatPrgNdhw')
                .update(body.toString())
                .digest('hex');
            if (expectedSignature === req.body.razorpay_signature) {
                console.log(orderIdPayment);
                const orderLatest = {
                    paymentStatus: 'success'
                }
                Order.updateOne({ _id: orderIdPayment }, orderLatest , (err, docs) => {
                    delete req.session.cart;
                    req.flash('success', 'Order placed succesfully');
                    if (err) throw err
                    
                })
                req.flash('success', 'Order placed succesfully');
                res.redirect('/customers/orders')
                
            } else {
                req.flash('error', 'something went wrong');
                res.redirect('/customers/payment');

            }
        }
    }
}

module.exports = orderController