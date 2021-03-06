const Menu = require('../../models/menu');
const Category = require('../../models/category');
const User = require('../../models/user')
function homeController() {
    return {
        async index(req, res) {
            const items = await Menu.find()
            const category = await Category.find();    
            const user = await User.find();    
            return res.render('home', {items: items, category: category, user: user})

            // Menu.find().then( function(items) {
            //     console.log(items);
            //     return res.render('home', {items: items})
            // })
        },
        async categorySelect(req, res) {
            console.log('hi');
            console.log(req.body);
            const category = await Category.find({category: req.body.category})
            const selected = category[0].category
            const items = await Menu.find({ category: selected})
            // console.log(req.session);
            req.session.category = selected;
            // console.log(req.session);
            
            return res.json({ category: req.session.category})
        }
    }
}

module.exports = homeController;