const express = require('express');
const session = require('express-session')
const app = express.Router();

//use this middelware to authenticate it is admin or user
const admin = require('../app/http/middleware/admin')

const adminOrderController = require('../app/http/controllers/admin/orderController')
const adminAuthController= require('../app/http/controllers/admin/adminAuthController')
const adminStatusController = require('../app/http/controllers/admin/statusController')


//session creating for admin
app.use(session({

    secret: 'ok',
    name: 'adminCookie',
    saveUninitialized: false,
    resave: false,
  
    cookie: {
      maxAge: 60 * 1000 * 60 * 60 * 24 * 30
    }
  }));


//admin routes
app.get('/login', adminAuthController().login)
app.post('/login', adminAuthController().postlogin)
app.get('/logout', adminAuthController().logout)

app.get('/orders', admin, adminOrderController().index)
app.get('/allProducts', admin, adminOrderController().allProducts)

app.get('/addProduct', admin, adminOrderController().addProduct)
app.post('/addProduct', admin, adminOrderController().postAddProduct)
app.post('/editProduct', admin, adminOrderController().editProduct)
app.post('/editProductSave', admin, adminOrderController().editProductSave)
app.post('/deleteProduct', admin, adminOrderController().deleteProduct)
app.get('/category', admin, adminOrderController().category)
app.get('/addCategory', admin, adminOrderController().addCategory)
app.post('/addCategory', admin, adminOrderController().postAddCategory)
//status controller
app.post('/order/status', admin, adminStatusController().update)
app.get('/dashboard', admin, adminOrderController().dashboard)
//category
app.get('/editCategory', admin, adminOrderController().editCategory)
app.post('/editCategory', admin, adminOrderController().postEditCategory)
app.post('/deleteCategory', admin, adminOrderController().deleteCategory)

module.exports = app;