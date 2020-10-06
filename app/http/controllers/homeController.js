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
        }
    }
}

module.exports = homeController;