function admin(req, res, next) {
    if (!req.session.email) {
        res.redirect('/admin/login');
    } else {
        next();
    }

    // if(req.isAuthenticated() && req.user.role ==='admin') {
    //     return next()
    // }
    // return res.redirect('/')
}

module.exports = admin;