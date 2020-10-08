const { json } = require("express")
const Category = require('../../../models/category');


function cartController() {
    return {
        index(req, res) {

            res.render('customers/cart')
        },
        update(req, res) {

//for the first time creating cart and adding basic object structure.
            if (!req.session.cart) {
                req.session.cart = {
                    items: {},
                    totalQty: 0,
                    totalPrice: 0
                }
                
            }
            let cart = req.session.cart
            //check if item does not exist in cart
            if(!cart.items[req.body._id]) {
                cart.items[req.body._id] = {
                    item: req.body, 
                    qty: 1
                }
                cart.totalQty = cart.totalQty + 1
                cart.totalPrice = cart.totalPrice + req.body.price
            }else {
                cart.items[req.body._id].qty = cart.items[req.body._id].qty + 1
                cart.totalQty = cart.totalQty + 1
                cart.totalPrice = cart.totalPrice + req.body.price
            }
            return res.json({ totalQty: req.session.cart.totalQty})
        },
        updateupqty(req, res) {
            let cart = req.session.cart;
            cart.items[req.body._id].qty += 1;
            cart.totalQty += 1;
            cart.totalPrice += req.body.price;
            res.redirect('/customer/cart')
        },
        updatedownqty(req, res) {
            let cart = req.session.cart;
            cart.items[req.body._id].qty -= 1;
            cart.totalQty -= 1;
            cart.totalPrice -= req.body.price;
            if(cart.items[req.body._id].qty == 0) {
                delete cart.items[req.body._id]
            }
            if(cart.totalQty == 0) {
                delete req.session.cart;
            }
            res.redirect('/customer/cart')
        },
        deleteitem(req, res) {
            let cart = req.session.cart;
            if(cart.items[req.body._id]) {
                cart.totalQty -= cart.items[req.body._id].qty;
                cart.totalPrice -= cart.items[req.body._id].qty * req.body.price;
                delete cart.items[req.body._id];
            }
            if(cart.totalQty == 0) {
                delete req.session.cart;
            }
            res.redirect('/customer/cart')
        }
    }
}

module.exports = cartController;