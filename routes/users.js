const express = require('express');
const authController = require('../app/http/controllers/authController');
const cartController = require('../app/http/controllers/customers/cartController');
const orderController = require('../app/http/controllers/customers/orderController');
const app = express.Router();
const homeController = require('../app/http/controllers/homeController');
const guest = require('../app/http/middleware/guest')
const auth = require('../app/http/middleware/auth');
const order = require('../app/models/order');


app.get('/', homeController().index)


app.get('/register', guest, authController().register)
app.post('/register', authController().postRegister)
app.get('/login', guest, authController().login)
app.post('/login', authController().postLogin)
app.post('/logout', authController().logout)

app.get('/cart', cartController().index)
app.post('/update-cart', cartController().update);
app.post('/updateupqty', cartController().updateupqty)
app.post('/updatedownqty', cartController().updatedownqty)
app.post('/deleteCartItem', cartController().deleteitem)


//Customer routes
app.post('/cusomer/payment', auth, orderController().store)
app.get('/customer/orders', auth, orderController().index)
app.get('/customer/orders/:id', auth, orderController().status)

//popup window setting
app.get('/products/:_id', orderController().detailedView)
//payment
app.get('/customers/payments', auth, orderController().paymentSelect)
// app.get('/razorpay',auth, orderController().getrazorpay)
app.post('/customer/payment/razorpay', auth, orderController().razorpay)
app.post('/razorpay', auth, orderController().razorpay )
app.post('/razorpayvarify', auth, orderController().razorpayVerify)
app.post('/postpaymentSelect', auth, orderController().postselectpay)
app.post('/categorySelect', homeController().categorySelect)

module.exports = app;