

function adminAuthController() {

    

    return {
        login(req, res) {
            res.render('admin/admin')
        },
        postlogin(req, res) {
            const email = "admin@luviaka.com";
            const password = "12345"
            req.session.email = email;
            req.session.password = password
            if(req.body.email === email && req.body.password === password) {
                res.redirect('/admin/orders')
            } else {
                res.redirect('/admin/login')

            }
        }
    }
}
module.exports = adminAuthController;