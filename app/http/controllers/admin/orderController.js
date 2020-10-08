
const Order = require('../../../models/order')
const User = require('../../../models/user')
const Menu = require('../../../models/menu')
const Category = require('../../../models/category')
const multer = require('multer')
const path = require('path');
const category = require('../../../models/category');


//using multer for file upload


var Storage = multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, "public/img/products");
    },
    filename: function (req, file, callback) {
      callback(null, file.fieldname + "_" + Date.now() + "_" + path.extname(file.originalname));
    },
  });
  
  var upload = multer({
    storage: Storage,
  }).single("image"); //Field name and max count
  



function orderController() {
    return {
        index(req, res) {
            Order.find({ status: { $ne: 'completed'}}, null, { sort: { 'createdAt': -1}}).populate('customerId', '-password').exec((err, orders) => {
                if(req.xhr) {
                    
                    return res.json(orders)
                }else {
                    return res.render('admin/orders')
                }
                
            })

        },
        dashboard(req, res) { 

            Order.countDocuments().then((count) => {
                Order.find({status: 'completed'}).countDocuments().then((completed) => {
                    User.find({}).countDocuments().then((customerCount) => {
                        Menu.find({}).countDocuments().then((totalMenu) => {
                            let pending = count - completed;
                        res.render('admin/dashboard', { orders: count, pending: pending, customerCount, totalMenu})
                        })
                        
                    })
                   
                })
                
                
            });
            
        },
        allProducts(req, res) {
            Menu.find({}).then( result => {
                
                res.render('admin/allProducts', {menus: result})
            }).catch(err => {
                throw err;
            })
            
        },
        addProduct(req, res) {
            Category.find({}).then(result => {
                res.render('admin/addProduct', {category: result})

            }).catch(err => {
                throw err;
            })
        },
        postAddProduct(req, res) {
            upload(req, res, (err) => {
                if (err) {
                console.log(err);
                } else {
                // Everything went fine.
                
                const Product = {
                    name : req.body.name,
                    artist : req.body.artistName,
                    price : req.body.rate,
                    image : req.file.filename,
                    category: req.body.category,
                    discripsion : req.body.discripsion
                }
                let newProduct = new Menu(Product)
                newProduct.save();
                
                res.redirect('/admin/allProducts')
                }
        
                
            })
            
        },
        editProduct(req, res) {
            const id = req.body.id;
            
            Menu.findOne({_id: id }).lean().exec((err, data) => {
                category.find({}).lean().exec((err, result) => {
                    res.render('admin/editProduct', {menus: data, category: result});

                })
            })
            
        },
        editProductSave(req, res) {
            upload(req, res, (err) => {
                if (err) {
                console.log(err);
                } else {
                
                const Product = {
                    _id: req.body.id,
                    name : req.body.name,
                    artist : req.body.artistName,
                    price : req.body.rate,
                    image : req.file.filename,
                    discripsion : req.body.discripsion
                }
                const _id= req.body.id;
                Menu.updateOne({_id: _id}, Product, (err, docs) => {
                    
                    if(err) throw err;
                    res.redirect('/admin/allProducts')
                }).catch(err => {
                    res.render('admin/editProduct')
                })
                
                
                }
            })
        },
        deleteProduct(req, res) {
            const id = req.body.id
            
            Menu.deleteOne({_id: id}).exec((err, data) => {
                if(err) throw err;
                res.redirect("/admin/allproducts")
            })
        },
        category(req, res) {
            Category.find({}).then( result => {
                console.log(result);
                res.render('admin/category', {category: result})
            }).catch(err => {
                throw err;
            })
        },
        addCategory(req, res) {
            res.render('admin/addCategory')
        },
        postAddCategory(req, res) {
            const category = {
                category: req.body.category
            }
            console.log(category);
            let newCategory = new Category(category)
            newCategory.save();
            res.redirect('/admin/category')
        },
        editCategory(req, res) {
            category.findOne({}).lean().exec((err, result) => {
                res.render('admin/editCategory', { category: result });

            })
        },
        postEditCategory(req, res) {
            const Product = {
                _id: req.body.id,
                category: req.body.category
            }
            const _id= req.body.id;
            Category.updateOne({_id: _id}, Product, (err, docs) => {
                
                if(err) throw err;
                res.redirect('/admin/category')
            })
            
        },
        deleteCategory(req, res) {
            const id = req.body.id
            
            Category.deleteOne({_id: id}).exec((err, data) => {
                if(err) throw err;
                res.redirect("/admin/category")
            })
            
        }

    }
}

module.exports = orderController;